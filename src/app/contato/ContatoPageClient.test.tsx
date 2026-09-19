import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

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

import ContatoPageClient from './ContatoPageClient';
import { useInView } from 'framer-motion';

describe('ContatoPageClient', () => {
  it('renders static content with isInView=true (default mock)', () => {
    render(<ContatoPageClient />);

    expect(screen.getByText('E-mail')).toBeInTheDocument();

    const emailLink = screen.getByText('contato@jadilson.dev');
    expect(emailLink).toHaveAttribute('href', 'mailto:contato@jadilson.dev');

    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Twitter/X')).toBeInTheDocument();

    const githubCard = screen.getByText('GitHub').closest('a');
    expect(githubCard).toHaveAttribute('href', 'https://github.com/jadilson12');

    const linkedinCta = screen.getByText('Conectar no LinkedIn');
    expect(linkedinCta).toHaveAttribute('href', 'https://www.linkedin.com/in/jadilson12/');

    const githubCta = screen.getByText('Ver GitHub');
    expect(githubCta).toHaveAttribute('href', 'https://github.com/jadilson12');
  });

  it('renders with isInView=false', () => {
    (useInView as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(false);
    render(<ContatoPageClient />);
    expect(screen.getByText('E-mail')).toBeInTheDocument();
  });
});
