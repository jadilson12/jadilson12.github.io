import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PostData } from '@/lib/posts';

vi.mock('@/components/Breadcrumb', () => ({
  default: () => <div data-testid="breadcrumb" />,
}));

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

import YearPageClient from './YearPageClient';

function makePost(overrides: Partial<PostData> = {}): PostData {
  return {
    id: 'sample-post',
    slug: 'sample-post',
    title: 'Sample Post',
    date: '2024-06-15',
    description: 'A sample description',
    tags: ['react', 'nextjs'],
    ...overrides,
  };
}

afterEach(cleanup);

describe('YearPageClient', () => {
  const post1 = makePost({ id: 'p1', slug: 'p1', title: 'March Post', date: '2024-03-10' });
  const post2 = makePost({ id: 'p2', slug: 'p2', title: 'January Post A', date: '2024-01-05' });
  const post3 = makePost({ id: 'p3', slug: 'p3', title: 'January Post B', date: '2024-01-20' });

  const sortedMonths = ['03', '01'];
  const postsByMonth = { '03': [post1], '01': [post2, post3] };
  const yearPosts = [post1, post2, post3];

  it('renders plural "artigos publicados" for multiple posts', () => {
    render(
      <YearPageClient
        year="2024"
        yearPosts={yearPosts}
        sortedMonths={sortedMonths}
        postsByMonth={postsByMonth}
      />
    );

    expect(screen.getByText(/artigos publicados/)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
  });

  it('renders singular "artigo publicado" for a single post', () => {
    render(
      <YearPageClient
        year="2024"
        yearPosts={[post1]}
        sortedMonths={['03']}
        postsByMonth={{ '03': [post1] }}
      />
    );

    expect(screen.getByText(/artigo publicado/)).toBeInTheDocument();
    expect(screen.queryByText(/artigos publicados/)).not.toBeInTheDocument();
  });

  it('renders the "On this page" TOC with one li per month and correct counts', () => {
    render(
      <YearPageClient
        year="2024"
        yearPosts={yearPosts}
        sortedMonths={sortedMonths}
        postsByMonth={postsByMonth}
      />
    );

    expect(screen.getByRole('heading', { name: 'On this page' })).toBeInTheDocument();
    expect(screen.getAllByText('2024 - Março').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2024 - Janeiro').length).toBeGreaterThan(0);

    const marchLink = screen.getByRole('link', { name: /2024 - Março/ });
    expect(marchLink).toHaveAttribute('href', '#2024-março');

    const januaryLink = screen.getByRole('link', { name: /2024 - Janeiro/ });
    expect(januaryLink).toHaveAttribute('href', '#2024-janeiro');
  });

  it('renders each month section heading and its posts', () => {
    render(
      <YearPageClient
        year="2024"
        yearPosts={yearPosts}
        sortedMonths={sortedMonths}
        postsByMonth={postsByMonth}
      />
    );

    expect(screen.getAllByText('2024 - Março').length).toBeGreaterThan(0);
    expect(screen.getByText('March Post')).toBeInTheDocument();
    expect(screen.getByText('January Post A')).toBeInTheDocument();
    expect(screen.getByText('January Post B')).toBeInTheDocument();
  });

  it('renders post description when present, and omits it when absent', () => {
    const withDescription = makePost({
      id: 'd1',
      slug: 'd1',
      title: 'With Description',
      description: 'Has a description',
    });
    const withoutDescription = makePost({
      id: 'd2',
      slug: 'd2',
      title: 'Without Description',
      description: undefined,
    });

    render(
      <YearPageClient
        year="2024"
        yearPosts={[withDescription, withoutDescription]}
        sortedMonths={['01']}
        postsByMonth={{ '01': [withDescription, withoutDescription] }}
      />
    );

    expect(screen.getByText('Has a description')).toBeInTheDocument();
    expect(screen.queryByText('undefined')).not.toBeInTheDocument();
  });

  it('renders tags when present (sliced to 4) and omits the tags block when absent/empty', () => {
    const withManyTags = makePost({
      id: 't1',
      slug: 't1',
      title: 'Many Tags Post',
      tags: ['one', 'two', 'three', 'four', 'five', 'six'],
    });
    const withoutTags = makePost({
      id: 't2',
      slug: 't2',
      title: 'No Tags Post',
      tags: undefined,
    });
    const withEmptyTags = makePost({
      id: 't3',
      slug: 't3',
      title: 'Empty Tags Post',
      tags: [],
    });

    render(
      <YearPageClient
        year="2024"
        yearPosts={[withManyTags, withoutTags, withEmptyTags]}
        sortedMonths={['01']}
        postsByMonth={{ '01': [withManyTags, withoutTags, withEmptyTags] }}
      />
    );

    expect(screen.getByText('#one')).toBeInTheDocument();
    expect(screen.getByText('#two')).toBeInTheDocument();
    expect(screen.getByText('#three')).toBeInTheDocument();
    expect(screen.getByText('#four')).toBeInTheDocument();
    expect(screen.queryByText('#five')).not.toBeInTheDocument();
    expect(screen.queryByText('#six')).not.toBeInTheDocument();
  });

  it('renders a link to the post detail page for each post', () => {
    render(
      <YearPageClient
        year="2024"
        yearPosts={yearPosts}
        sortedMonths={sortedMonths}
        postsByMonth={postsByMonth}
      />
    );

    const link = screen.getByRole('link', { name: /March Post/ });
    expect(link).toHaveAttribute('href', '/blog/p1');
  });
});
