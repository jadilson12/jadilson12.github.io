import React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

import ShareButtons from './ShareButtons';

afterEach(() => {
  cleanup();
});

describe('ShareButtons', () => {
  const title = 'My Post Title';
  const url = 'https://example.com/post';

  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  it('calls window.open with the twitter share url when Twitter button is clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<ShareButtons title={title} url={url} />);

    const twitterButton = screen.getByRole('button', { name: /compartilhar no twitter/i });
    fireEvent.click(twitterButton);

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(title)),
      '_blank',
      'width=600,height=400'
    );
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent(url)),
      '_blank',
      'width=600,height=400'
    );

    openSpy.mockRestore();
  });

  it('calls window.open for LinkedIn, Facebook and WhatsApp buttons', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    render(<ShareButtons title={title} url={url} description="desc" />);

    fireEvent.click(screen.getByRole('button', { name: /compartilhar no linkedin/i }));
    fireEvent.click(screen.getByRole('button', { name: /compartilhar no facebook/i }));
    fireEvent.click(screen.getByRole('button', { name: /compartilhar no whatsapp/i }));

    expect(openSpy).toHaveBeenCalledTimes(3);

    openSpy.mockRestore();
  });

  it('copies the link, shows "Copiado!" then reverts to "Copiar link" after 2s', async () => {
    vi.useFakeTimers();
    render(<ShareButtons title={title} url={url} />);

    expect(screen.getByText('Copiar link')).toBeInTheDocument();

    const copyButton = screen.getByRole('button', { name: /copiar link/i });

    await act(async () => {
      fireEvent.click(copyButton);
      // allow the clipboard promise microtask to resolve
      await Promise.resolve();
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(url);
    expect(screen.getByText('Copiado!')).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(screen.getByText('Copiar link')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('handles clipboard write failure via the catch branch', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValueOnce(new Error('denied')) },
      configurable: true,
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ShareButtons title={title} url={url} />);
    const copyButton = screen.getByRole('button', { name: /copiar link/i });

    await act(async () => {
      fireEvent.click(copyButton);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));
    expect(screen.getByText('Copiar link')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
