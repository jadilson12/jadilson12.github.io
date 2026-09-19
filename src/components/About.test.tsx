import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill: _fill, priority: _priority, sizes: _sizes, ...rest } = props;
    return <img {...rest} />;
  },
}));

import About from './About';
import { useInView } from 'framer-motion';

afterEach(cleanup);

describe('About', () => {
  it('renders static content with isInView=true (default mock)', () => {
    render(<About />);
    expect(screen.getByText(/8\+ anos/)).toBeInTheDocument();
    const blogLink = screen.getByText('Ver Blog');
    expect(blogLink).toHaveAttribute('href', '/blog');
    expect(screen.getByAltText('Jadilson Guedes')).toBeInTheDocument();
  });

  it('renders with isInView=false', () => {
    (useInView as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(false);
    render(<About />);
    expect(screen.getByText('Ver Blog')).toHaveAttribute('href', '/blog');
  });
});
