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

import Hero from './Hero';

afterEach(cleanup);

describe('Hero', () => {
  it('renders headline and both CTA links', () => {
    render(<Hero />);
    expect(screen.getByText('Jadilson Guedes')).toBeInTheDocument();

    const soubreLink = screen.getByText('Saiba Mais Sobre Mim').closest('a');
    expect(soubreLink).toHaveAttribute('href', '/sobre');

    const blogLink = screen.getByText('Ver Blog').closest('a');
    expect(blogLink).toHaveAttribute('href', '/blog');
  });

  it('renders the four highlight cards', () => {
    render(<Hero />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Serviços')).toBeInTheDocument();
    expect(screen.getByText('IA')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
  });
});
