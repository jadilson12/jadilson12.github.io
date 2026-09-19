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

import TableOfContents from './TableOfContents';

describe('TableOfContents', () => {
  afterEach(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('returns null when there is no article in the document', () => {
    const { container } = render(<TableOfContents />);
    expect(container.firstChild).toBeNull();
  });

  it('returns null when article has no h2/h3 headings', () => {
    const { container } = render(
      <>
        <article>
          <p>No headings here</p>
        </article>
        <TableOfContents />
      </>
    );
    expect(container.querySelector('nav')).toBeNull();
  });

  it('builds TOC from headings, generating ids when missing, and handles h2/h3 levels', () => {
    render(
      <>
        <article>
          <h2>Intro Section</h2>
          <h3 id="already-set">Details</h3>
        </article>
        <TableOfContents />
      </>
    );

    // The h2 without an id should get a slugified id
    const introHeading = screen.getByText('Intro Section', { selector: 'h2' });
    expect(introHeading.id).toBe('intro-section');

    // Links rendered for both headings
    const introLink = screen.getByRole('link', { name: 'Intro Section' });
    expect(introLink).toHaveAttribute('href', '#intro-section');

    const detailsLink = screen.getByRole('link', { name: 'Details' });
    expect(detailsLink).toHaveAttribute('href', '#already-set');

    // h3 heading -> parent li has ml-4 class
    const detailsLi = detailsLink.closest('li');
    expect(detailsLi?.className).toContain('ml-4');

    // h2 heading -> parent li has no ml-4 class
    const introLi = introLink.closest('li');
    expect(introLi?.className).not.toContain('ml-4');
  });

  it('handles click: preventDefault, scrollTo and pushState when target exists', () => {
    render(
      <>
        <article>
          <h2>Intro Section</h2>
        </article>
        <TableOfContents />
      </>
    );

    const pushStateSpy = vi.spyOn(window.history, 'pushState');
    const link = screen.getByRole('link', { name: 'Intro Section' });

    fireEvent.click(link);

    expect(window.scrollTo).toHaveBeenCalled();
    expect(pushStateSpy).toHaveBeenCalledWith(null, '', '#intro-section');

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
        <TableOfContents />
      </>
    );

    const link = screen.getByRole('link', { name: 'Intro Section' });
    const id = link.getAttribute('href')!.slice(1);

    expect(capturedCallback).not.toBeNull();
    act(() => {
      capturedCallback!(
        [{ isIntersecting: true, target: { id } } as unknown as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });

    // Re-query after state update
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
        <TableOfContents />
      </>
    );

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
        <TableOfContents />
      </>
    );

    const getByIdSpy = vi.spyOn(document, 'getElementById').mockReturnValue(null);
    const link = screen.getByRole('link', { name: 'Intro Section' });

    vi.mocked(window.scrollTo).mockClear();
    fireEvent.click(link);

    expect(window.scrollTo).not.toHaveBeenCalled();

    getByIdSpy.mockRestore();
  });
});
