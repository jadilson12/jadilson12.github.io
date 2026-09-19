import React from 'react';
import { act, cleanup, render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';

vi.mock('framer-motion', () => {
  const passthrough = (tag: string) =>
    React.forwardRef(function MockMotionComponent(props: any, ref: any) {
      const {
        initial: _initial, animate: _animate, exit: _exit, whileHover: _whileHover, whileTap: _whileTap, whileInView: _whileInView, viewport: _viewport,
        variants: _variants, transition: _transition, layout: _layout, layoutId: _layoutId, onAnimationComplete: _onAnimationComplete, drag: _drag,
        dragConstraints: _dragConstraints, whileDrag: _whileDrag, custom: _custom, ...rest
      } = props;
      return React.createElement(tag, { ref, ...rest });
    });
  const motion = new Proxy({} as any, { get: (_target, tag: string) => passthrough(tag) });
  return {
    motion,
    AnimatePresence: ({ children }: any) => children,
    useInView: vi.fn(() => true),
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {}, onChange: () => () => {} } }),
    useTransform: () => 0,
  };
});

import FloatingTocButton from './FloatingTocButton';

describe('FloatingTocButton', () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
    document.body.style.overflow = '';
  });

  it('returns null when there is no article in the document', () => {
    const { container } = render(<FloatingTocButton />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when article has no h2/h3 headings', () => {
    render(
      <>
        <article>
          <p>No headings here</p>
        </article>
        <FloatingTocButton />
      </>
    );
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('generates ids for headings missing them and respects h2/h3 level classes', () => {
    render(
      <>
        <article>
          <h2>Intro Section</h2>
          <h3 id="already-set">Details</h3>
        </article>
        <FloatingTocButton />
      </>
    );

    const button = screen.getByRole('button', { name: /abrir índice do artigo/i });
    fireEvent.click(button);

    const introLink = screen.getByRole('link', { name: 'Intro Section' });
    expect(introLink).toHaveAttribute('href', '#intro-section');

    const detailsLink = screen.getByRole('link', { name: 'Details' });
    expect(detailsLink).toHaveAttribute('href', '#already-set');

    const detailsLi = detailsLink.closest('li');
    expect(detailsLi?.className).toContain('ml-4');

    const introLi = introLink.closest('li');
    expect(introLi?.className).not.toContain('ml-4');
  });

  it('opens the drawer, toggles body overflow, and closes via backdrop click', () => {
    render(
      <>
        <article>
          <h2>Intro Section</h2>
        </article>
        <FloatingTocButton />
      </>
    );

    expect(document.body.style.overflow).toBe('unset');

    const button = screen.getByRole('button', { name: /abrir índice do artigo/i });
    fireEvent.click(button);

    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByRole('link', { name: 'Intro Section' })).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /fechar índice/i });
    fireEvent.click(closeButton);

    expect(document.body.style.overflow).toBe('unset');
    expect(screen.queryByRole('link', { name: 'Intro Section' })).toBeNull();
  });

  it('closes via backdrop click', () => {
    const { container } = render(
      <>
        <article>
          <h2>Intro Section</h2>
        </article>
        <FloatingTocButton />
      </>
    );

    const button = screen.getByRole('button', { name: /abrir índice do artigo/i });
    fireEvent.click(button);

    const backdrop = container.querySelector('.backdrop-blur-md') as HTMLElement;
    expect(backdrop).toBeTruthy();
    fireEvent.click(backdrop);

    expect(screen.queryByRole('link', { name: 'Intro Section' })).toBeNull();
  });

  it('resets body overflow to unset on unmount', () => {
    const { unmount } = render(
      <>
        <article>
          <h2>Intro Section</h2>
        </article>
        <FloatingTocButton />
      </>
    );

    const button = screen.getByRole('button', { name: /abrir índice do artigo/i });
    fireEvent.click(button);
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('unset');
  });

  it('handles TOC link click: preventDefault, scrollTo, pushState, sets active id and closes drawer', () => {
    render(
      <>
        <article>
          <h2>Intro Section</h2>
        </article>
        <FloatingTocButton />
      </>
    );

    const pushStateSpy = vi.spyOn(window.history, 'pushState');

    const button = screen.getByRole('button', { name: /abrir índice do artigo/i });
    fireEvent.click(button);

    const link = screen.getByRole('link', { name: 'Intro Section' });
    fireEvent.click(link);

    expect(window.scrollTo).toHaveBeenCalled();
    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '#intro-section');
    // drawer should close after clicking a link
    expect(screen.queryByRole('link', { name: 'Intro Section' })).toBeNull();

    pushStateSpy.mockRestore();
  });

  it('activates a heading id via the IntersectionObserver callback', () => {
    let capturedCallback: IntersectionObserverCallback | null = null;
    class ManualIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        capturedCallback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    const OriginalIntersectionObserver = global.IntersectionObserver;
    vi.stubGlobal('IntersectionObserver', ManualIntersectionObserver as any);

    render(
      <>
        <article>
          <h2>Intro Section</h2>
        </article>
        <FloatingTocButton />
      </>
    );

    const button = screen.getByRole('button', { name: /abrir índice do artigo/i });
    fireEvent.click(button);

    const link = screen.getByRole('link', { name: 'Intro Section' });
    const id = link.getAttribute('href')!.slice(1);

    expect(capturedCallback).not.toBeNull();
    act(() => {
      capturedCallback!(
        [{ isIntersecting: true, target: { id } } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    const updatedLink = screen.getByRole('link', { name: 'Intro Section' });
    expect(updatedLink.className).toContain('border-primary-300');

    // Also exercise the isIntersecting=false branch (no state change expected)
    act(() => {
      capturedCallback!(
        [{ isIntersecting: false, target: { id } } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    vi.stubGlobal('IntersectionObserver', OriginalIntersectionObserver);
  });

  it('falls back to empty string for id/text when a heading has no textContent', () => {
    render(
      <>
        <article>
          <h2></h2>
        </article>
        <FloatingTocButton />
      </>
    );

    const button = screen.getByRole('button', { name: /abrir índice do artigo/i });
    fireEvent.click(button);

    const link = document.querySelector('nav a');
    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('#');
    expect(link?.textContent).toBe('');
  });

  it('does nothing on click when the target element is not found in the DOM', () => {
    render(
      <>
        <article>
          <h2>Intro Section</h2>
        </article>
        <FloatingTocButton />
      </>
    );

    const button = screen.getByRole('button', { name: /abrir índice do artigo/i });
    fireEvent.click(button);

    const getByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(null);
    const link = screen.getByRole('link', { name: 'Intro Section' });

    vi.mocked(window.scrollTo).mockClear();
    fireEvent.click(link);

    expect(window.scrollTo).not.toHaveBeenCalled();
    // drawer should remain open since the click handler returned early
    expect(screen.getByRole('link', { name: 'Intro Section' })).toBeInTheDocument();

    getByIdSpy.mockRestore();
  });
});
