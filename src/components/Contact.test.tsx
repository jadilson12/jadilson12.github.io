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

import { useInView } from 'framer-motion';
import Contact from './Contact';

afterEach(() => {
  cleanup();
  vi.mocked(useInView).mockReturnValue(true);
});

describe('Contact', () => {
  it('renders heading, description and social links when in view', () => {
    render(<Contact />);

    expect(screen.getByText('Entre em Contato')).toBeInTheDocument();
    expect(screen.getByText('Conecte-se comigo através das redes sociais')).toBeInTheDocument();

    // Links have no accessible text (icon only), so query by href instead
    const githubLink = document.querySelector('a[href="https://github.com/jadilson12"]');
    const linkedinLink = document.querySelector('a[href="https://www.linkedin.com/in/jadilson12/"]');
    const twitterLink = document.querySelector('a[href="https://x.com/jadilson"]');

    expect(githubLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
  });

  it('renders correctly when not in view', () => {
    vi.mocked(useInView).mockReturnValue(false);
    render(<Contact />);

    expect(screen.getByText('Entre em Contato')).toBeInTheDocument();
    const githubLink = document.querySelector('a[href="https://github.com/jadilson12"]');
    expect(githubLink).toBeInTheDocument();
  });
});
