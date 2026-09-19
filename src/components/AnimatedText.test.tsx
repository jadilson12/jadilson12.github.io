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

import AnimatedText, { AnimatedWords, GradientText } from './AnimatedText';

afterEach(cleanup);

describe('AnimatedText', () => {
  it('renders shimmer variant with default tag', () => {
    render(<AnimatedText variant="shimmer">Shimmer Text</AnimatedText>);
    const matches = screen.getAllByText('Shimmer Text');
    expect(matches.length).toBeGreaterThan(0);
    const p = document.querySelector('p');
    expect(p).toBeInTheDocument();
  });

  it('renders default fade variant character by character with a space', () => {
    render(<AnimatedText>ab cd</AnimatedText>);
    // each character rendered as its own span
    const spans = document.querySelectorAll('p > span.inline-block > span');
    expect(spans.length).toBe(5); // 'a','b',' ','c','d'
    // find the space char span - style display 'inline'
    const spaceSpan = Array.from(spans).find((s) => s.textContent === ' ');
    expect(spaceSpan).toBeTruthy();
    expect((spaceSpan as HTMLElement).style.display).toBe('inline');
    const letterSpan = Array.from(spans).find((s) => s.textContent === 'a');
    expect((letterSpan as HTMLElement).style.display).toBe('inline-block');
  });

  it('renders slideUp variant', () => {
    render(<AnimatedText variant="slideUp">Hi</AnimatedText>);
    expect(screen.getAllByText('H').length).toBe(1);
  });

  it('renders reveal variant', () => {
    render(<AnimatedText variant="reveal">Yo</AnimatedText>);
    expect(screen.getAllByText('Y').length).toBe(1);
  });

  it('renders with custom "as" prop', () => {
    render(<AnimatedText as="h2">Title</AnimatedText>);
    expect(document.querySelector('h2')).toBeInTheDocument();
  });
});

describe('AnimatedWords', () => {
  it('renders each word as a separate chunk', () => {
    render(<AnimatedWords>hello world foo</AnimatedWords>);
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
    expect(screen.getByText('foo')).toBeInTheDocument();
  });
});

describe('GradientText', () => {
  it('renders with animate=true (default)', () => {
    render(<GradientText>Gradient</GradientText>);
    const el = screen.getByText('Gradient');
    expect(el.style.backgroundSize).toBe('200% 100%');
  });

  it('renders with animate=false', () => {
    render(<GradientText animate={false}>Static</GradientText>);
    const el = screen.getByText('Static');
    expect(el.style.backgroundSize).toBe('100% 100%');
  });
});
