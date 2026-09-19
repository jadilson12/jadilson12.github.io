import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PostData } from '@/lib/posts';

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

vi.mock('@/components/Breadcrumb', () => ({
  default: (props: any) => <nav data-testid="breadcrumb">{JSON.stringify(props.items)}</nav>,
}));
vi.mock('@/components/FloatingTocButton', () => ({
  default: () => <div data-testid="floating-toc" />,
}));
vi.mock('@/components/ShareButtons', () => ({
  default: (props: any) => <div data-testid="share-buttons" data-title={props.title} />,
}));
vi.mock('@/components/TableOfContents', () => ({
  default: () => <div data-testid="toc" />,
}));

import BlogPostContent from './BlogPostContent';

function makePost(overrides: Partial<PostData> = {}): PostData {
  return {
    id: 'sample-post',
    slug: 'sample-post',
    title: 'Sample Post',
    date: '2024-06-15',
    description: 'A sample description',
    tags: ['react', 'nextjs'],
    content: 'Some **markdown** body',
    ...overrides,
  };
}

describe('BlogPostContent', () => {
  it('renders title, description, date, children and tags when tags are present', () => {
    const post = makePost();
    render(
      <BlogPostContent post={post}>
        <p data-testid="children-content">Hello children</p>
      </BlogPostContent>
    );

    expect(screen.getByText('Sample Post')).toBeInTheDocument();
    expect(screen.getByText('A sample description')).toBeInTheDocument();
    expect(screen.getByTestId('children-content')).toHaveTextContent('Hello children');

    const expectedDate = new Date('2024-06-15').toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    expect(screen.getByText(expectedDate)).toBeInTheDocument();

    expect(screen.getByText('Tags')).toBeInTheDocument();
    const reactLink = screen.getByText('#react');
    expect(reactLink).toHaveAttribute('href', '/blog?tag=react');
    const nextjsLink = screen.getByText('#nextjs');
    expect(nextjsLink).toHaveAttribute('href', '/blog?tag=nextjs');

    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('toc')).toBeInTheDocument();
    expect(screen.getByTestId('floating-toc')).toBeInTheDocument();
    expect(screen.getByTestId('share-buttons')).toHaveAttribute('data-title', 'Sample Post');
  });

  it('does not render the tags block when tags is undefined', () => {
    const post = makePost({ tags: undefined });
    render(
      <BlogPostContent post={post}>
        <p>content</p>
      </BlogPostContent>
    );

    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
  });

  it('does not render the tags block when tags is an empty array', () => {
    const post = makePost({ tags: [] });
    render(
      <BlogPostContent post={post}>
        <p>content</p>
      </BlogPostContent>
    );

    expect(screen.queryByText('Tags')).not.toBeInTheDocument();
  });
});
