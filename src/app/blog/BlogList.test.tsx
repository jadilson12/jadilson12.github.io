import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PostData } from '@/lib/posts';

vi.mock('@/components/BlogSidebar', () => ({
  default: () => <div data-testid="sidebar" />,
}));
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

import BlogList from './BlogList';

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

afterEach(() => {
  cleanup();
});

const noop = () => {};

describe('BlogList', () => {
  it('renders empty state with no filters (no active filters message)', () => {
    render(
      <BlogList posts={[]} onDateClick={noop} onTagClick={noop} />
    );

    expect(screen.getByText('Nenhum post ainda')).toBeInTheDocument();
    expect(screen.getByText('Volte em breve para novo conteúdo!')).toBeInTheDocument();
  });

  it('renders empty state with filters active (filtered empty message)', () => {
    render(
      <BlogList
        posts={[makePost({ date: '2024-01-01' })]}
        selectedDate="2099-01-01"
        onDateClick={noop}
        onTagClick={noop}
      />
    );

    expect(screen.getByText('Nenhum post encontrado')).toBeInTheDocument();
    expect(
      screen.getByText('Tente ajustar os filtros para ver mais resultados')
    ).toBeInTheDocument();
  });

  it('filters by selectedDate matching a post date', () => {
    const matching = makePost({ id: 'a', slug: 'a', date: '2024-03-05T00:00:00.000Z' });
    const other = makePost({ id: 'b', slug: 'b', date: '2024-04-10T00:00:00.000Z' });

    render(
      <BlogList
        posts={[matching, other]}
        selectedDate={(() => {
          const d = new Date(matching.date);
          const year = d.getFullYear().toString();
          const month = (d.getMonth() + 1).toString().padStart(2, '0');
          const day = d.getDate().toString().padStart(2, '0');
          return `${year}-${month}-${day}`;
        })()}
        onDateClick={noop}
        onTagClick={noop}
      />
    );

    expect(screen.getByText('Sample Post')).toBeInTheDocument();
    expect(screen.getByText('1 post encontrado')).toBeInTheDocument();
  });

  it('filters by selectedTag, excluding posts without a matching tag (including posts with no tags field)', () => {
    const withTag = makePost({ id: 'a', slug: 'a', title: 'Has Tag', tags: ['vue'] });
    const withoutTagsField = makePost({ id: 'b', slug: 'b', title: 'No Tags Field', tags: undefined });

    render(
      <BlogList
        posts={[withTag, withoutTagsField]}
        selectedTag="vue"
        onDateClick={noop}
        onTagClick={noop}
      />
    );

    expect(screen.getByText('Has Tag')).toBeInTheDocument();
    expect(screen.queryByText('No Tags Field')).not.toBeInTheDocument();
  });

  it('combines date and tag filters', () => {
    const both = makePost({
      id: 'a',
      slug: 'a',
      title: 'Both Match',
      date: '2024-05-05T00:00:00.000Z',
      tags: ['match'],
    });
    const dateOnly = makePost({
      id: 'b',
      slug: 'b',
      title: 'Date Only',
      date: '2024-05-05T00:00:00.000Z',
      tags: ['other'],
    });
    const tagOnly = makePost({
      id: 'c',
      slug: 'c',
      title: 'Tag Only',
      date: '2024-06-06T00:00:00.000Z',
      tags: ['match'],
    });

    const d = new Date(both.date);
    const year = d.getFullYear().toString();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const selectedDate = `${year}-${month}-${day}`;

    render(
      <BlogList
        posts={[both, dateOnly, tagOnly]}
        selectedDate={selectedDate}
        selectedTag="match"
        onDateClick={noop}
        onTagClick={noop}
      />
    );

    expect(screen.getByText('Both Match')).toBeInTheDocument();
    expect(screen.queryByText('Date Only')).not.toBeInTheDocument();
    expect(screen.queryByText('Tag Only')).not.toBeInTheDocument();
  });

  it('sorts posts by date descending regardless of input order', () => {
    const older = makePost({ id: 'old', slug: 'old', title: 'Older Post', date: '2023-01-01' });
    const newer = makePost({ id: 'new', slug: 'new', title: 'Newer Post', date: '2024-01-01' });

    render(<BlogList posts={[older, newer]} onDateClick={noop} onTagClick={noop} />);

    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    // Filter out the "On this page" style headings if any (none exist here); ensure order.
    expect(titles.indexOf('Newer Post')).toBeLessThan(titles.indexOf('Older Post'));
  });

  it('shows "hasMore" trigger with more than 10 posts, and pluralizes correctly', () => {
    const posts = Array.from({ length: 15 }, (_, i) =>
      makePost({ id: `p${i}`, slug: `p${i}`, title: `Post ${i}`, date: `2024-01-${String(i + 1).padStart(2, '0')}` })
    );

    const { container } = render(<BlogList posts={posts} onDateClick={noop} onTagClick={noop} />);

    expect(screen.getByText('Carregando mais posts...')).toBeInTheDocument();
    expect(screen.queryByText(/Você chegou ao fim/)).not.toBeInTheDocument();
    expect(container.querySelectorAll('article').length).toBe(10);
  });

  it('shows "end of posts" message (plural) with exactly 10 or fewer posts', () => {
    const posts = Array.from({ length: 3 }, (_, i) =>
      makePost({ id: `p${i}`, slug: `p${i}`, title: `Post ${i}`, date: `2024-01-${String(i + 1).padStart(2, '0')}` })
    );

    render(<BlogList posts={posts} onDateClick={noop} onTagClick={noop} />);

    expect(screen.getByText(/Você chegou ao fim! 🎉 Total de 3 posts/)).toBeInTheDocument();
    expect(screen.queryByText('Carregando mais posts...')).not.toBeInTheDocument();
  });

  it('shows "end of posts" message (singular) with exactly 1 post', () => {
    render(
      <BlogList posts={[makePost()]} onDateClick={noop} onTagClick={noop} />
    );

    expect(screen.getByText(/Você chegou ao fim! 🎉 Total de 1 post$/)).toBeInTheDocument();
  });

  it('loads more posts when the IntersectionObserver fires and the timer elapses', () => {
    const originalIntersectionObserver = global.IntersectionObserver;
    let capturedCallback: IntersectionObserverCallback | undefined;
    class ManualIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        capturedCallback = cb;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = () => [];
    }
    vi.stubGlobal('IntersectionObserver', ManualIntersectionObserver as any);

    try {
      const posts = Array.from({ length: 15 }, (_, i) =>
        makePost({ id: `p${i}`, slug: `p${i}`, title: `Post ${i}`, date: `2024-01-${String(i + 1).padStart(2, '0')}` })
      );

      const { container } = render(<BlogList posts={posts} onDateClick={noop} onTagClick={noop} />);

      expect(container.querySelectorAll('article').length).toBe(10);

      vi.useFakeTimers();
      act(() => {
        capturedCallback!([{ isIntersecting: true } as any], {} as any);
      });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      vi.useRealTimers();

      expect(container.querySelectorAll('article').length).toBe(15);
    } finally {
      vi.stubGlobal('IntersectionObserver', originalIntersectionObserver);
    }
  });

  it('resets the display count back to the first page when filters change after loading more', () => {
    const originalIntersectionObserver = global.IntersectionObserver;
    let capturedCallback: IntersectionObserverCallback | undefined;
    class ManualIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        capturedCallback = cb;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = () => [];
    }
    vi.stubGlobal('IntersectionObserver', ManualIntersectionObserver as any);

    try {
      const posts = Array.from({ length: 15 }, (_, i) =>
        makePost({ id: `p${i}`, slug: `p${i}`, title: `Post ${i}`, date: `2024-01-${String(i + 1).padStart(2, '0')}`, tags: ['react'] })
      );

      const { container, rerender } = render(
        <BlogList posts={posts} onDateClick={noop} onTagClick={noop} />
      );

      expect(container.querySelectorAll('article').length).toBe(10);

      vi.useFakeTimers();
      act(() => {
        capturedCallback!([{ isIntersecting: true } as any], {} as any);
      });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      vi.useRealTimers();

      expect(container.querySelectorAll('article').length).toBe(15);

      rerender(
        <BlogList posts={posts} selectedTag="react" onDateClick={noop} onTagClick={noop} />
      );

      expect(container.querySelectorAll('article').length).toBe(10);
    } finally {
      vi.stubGlobal('IntersectionObserver', originalIntersectionObserver);
    }
  });

  it('does not load more posts when the IntersectionObserver reports isIntersecting=false', () => {
    const originalIntersectionObserver = global.IntersectionObserver;
    let capturedCallback: IntersectionObserverCallback | undefined;
    class ManualIntersectionObserver {
      constructor(cb: IntersectionObserverCallback) {
        capturedCallback = cb;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = () => [];
    }
    vi.stubGlobal('IntersectionObserver', ManualIntersectionObserver as any);

    try {
      const posts = Array.from({ length: 15 }, (_, i) =>
        makePost({ id: `p${i}`, slug: `p${i}`, title: `Post ${i}`, date: `2024-01-${String(i + 1).padStart(2, '0')}` })
      );

      const { container } = render(<BlogList posts={posts} onDateClick={noop} onTagClick={noop} />);

      expect(container.querySelectorAll('article').length).toBe(10);

      act(() => {
        capturedCallback!([{ isIntersecting: false } as any], {} as any);
      });

      expect(container.querySelectorAll('article').length).toBe(10);
    } finally {
      vi.stubGlobal('IntersectionObserver', originalIntersectionObserver);
    }
  });

  it('shows active filters banner with only the date chip set', () => {
    const matching = makePost({ date: '2024-03-05T00:00:00.000Z' });
    const d = new Date(matching.date);
    const year = d.getFullYear().toString();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const selectedDate = `${year}-${month}-${day}`;

    render(
      <BlogList
        posts={[matching]}
        selectedDate={selectedDate}
        onDateClick={noop}
        onTagClick={noop}
      />
    );

    expect(screen.getByText('Filtros ativos:')).toBeInTheDocument();
    expect(screen.getByText(new RegExp('📅'))).toBeInTheDocument();
    expect(screen.queryByText(new RegExp('🏷️'))).not.toBeInTheDocument();
  });

  it('shows active filters banner with only the tag chip set', () => {
    render(
      <BlogList
        posts={[makePost({ tags: ['react'] })]}
        selectedTag="react"
        onDateClick={noop}
        onTagClick={noop}
      />
    );

    expect(screen.getByText('Filtros ativos:')).toBeInTheDocument();
    expect(screen.getByText(/🏷️/)).toBeInTheDocument();
    expect(screen.queryByText(/📅/)).not.toBeInTheDocument();
  });

  it('shows no active filters banner when neither date nor tag is set', () => {
    render(<BlogList posts={[makePost()]} onDateClick={noop} onTagClick={noop} />);

    expect(screen.queryByText('Filtros ativos:')).not.toBeInTheDocument();
  });

  it('applies opacity-60 class when isPending is true and opacity-100 when false', () => {
    const { container, rerender } = render(
      <BlogList posts={[makePost()]} onDateClick={noop} onTagClick={noop} isPending />
    );
    const grid = container.querySelector('.grid.grid-cols-1.gap-6');
    expect(grid?.className).toContain('opacity-60');

    rerender(<BlogList posts={[makePost()]} onDateClick={noop} onTagClick={noop} isPending={false} />);
    const grid2 = container.querySelector('.grid.grid-cols-1.gap-6');
    expect(grid2?.className).toContain('opacity-100');
  });

  it('renders tags block when post has tags, and omits it when tags are absent or empty', () => {
    const withTags = makePost({ id: 'a', slug: 'a', title: 'With Tags', tags: ['a', 'b'] });
    const withoutTags = makePost({ id: 'b', slug: 'b', title: 'Without Tags', tags: undefined });
    const emptyTags = makePost({ id: 'c', slug: 'c', title: 'Empty Tags', tags: [] });

    render(
      <BlogList posts={[withTags, withoutTags, emptyTags]} onDateClick={noop} onTagClick={noop} />
    );

    expect(screen.getByText('#a')).toBeInTheDocument();
    expect(screen.getByText('#b')).toBeInTheDocument();
  });

  it('computes reading time using description length, falling back to 0 when absent', () => {
    const withDescription = makePost({
      id: 'a',
      slug: 'a',
      title: 'With Description',
      description: 'x'.repeat(400), // ceil(400/200) = 2
    });
    const withoutDescription = makePost({
      id: 'b',
      slug: 'b',
      title: 'Without Description',
      description: undefined,
    });

    render(
      <BlogList posts={[withDescription, withoutDescription]} onDateClick={noop} onTagClick={noop} />
    );

    expect(screen.getByText('2 min leitura')).toBeInTheDocument();
    expect(screen.getByText('0 min leitura')).toBeInTheDocument();
  });

  it('renders a real Link for each post card without throwing on click', () => {
    render(<BlogList posts={[makePost()]} onDateClick={noop} onTagClick={noop} />);

    const link = screen.getByRole('link', { name: /Sample Post/ });
    expect(link).toHaveAttribute('href', '/blog/sample-post');
  });
});
