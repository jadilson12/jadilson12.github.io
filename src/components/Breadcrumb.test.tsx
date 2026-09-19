import React from 'react';
import { vi } from 'vitest';

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
    useInView: () => true,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {}, onChange: () => () => {} } }),
    useTransform: () => 0,
  };
});

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Breadcrumb from './Breadcrumb';

afterEach(cleanup);

describe('Breadcrumb', () => {
  it('renders a single item with an href as a plain span (isLast overrides href)', () => {
    render(<Breadcrumb items={[{ label: 'Home', href: '/' }]} />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('›')).not.toBeInTheDocument();
  });

  it('renders a middle item without an href as a plain span', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Middle' },
          { label: 'Current' },
        ]}
      />
    );

    expect(screen.getByText('Middle')).toBeInTheDocument();
    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(1);
  });

  it('renders a middle item with an href as a real link', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Current' },
        ]}
      />
    );

    const link = screen.getByRole('link', { name: 'Blog' });
    expect(link).toHaveAttribute('href', '/blog');
  });

  it('renders a separator between every item, items.length - 1 times', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: 'Current' },
        ]}
      />
    );

    const separators = screen.getAllByText('›');
    expect(separators).toHaveLength(2);
  });
});
