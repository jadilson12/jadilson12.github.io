import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PostData } from '@/lib/posts';

// The real next/navigation `useSearchParams` reflects the current URL, which changes whenever
// `router.push` navigates. Our mock simulates that relationship: calling `pushMock` updates the
// value `useSearchParamsMock` returns on the next render, so BlogPageClient's resync effect sees
// consistent state instead of fighting an optimistic update.
const { useSearchParamsMock, pushMock, setSearchParams } = vi.hoisted(() => {
  let currentParams = new URLSearchParams();
  const useSearchParamsMockImpl = vi.fn(() => currentParams);
  const pushMockImpl = vi.fn((url: string) => {
    const queryString = url.includes('?') ? url.split('?')[1] : '';
    currentParams = new URLSearchParams(queryString);
  });
  const setSearchParamsImpl = (query: string) => {
    currentParams = new URLSearchParams(query);
  };
  return {
    useSearchParamsMock: useSearchParamsMockImpl,
    pushMock: pushMockImpl,
    setSearchParams: setSearchParamsImpl,
  };
});
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn(), back: vi.fn(), prefetch: vi.fn(), refresh: vi.fn() }),
  useSearchParams: useSearchParamsMock,
}));

vi.mock('./BlogList', () => ({
  default: (props: any) => (
    <div
      data-testid="blog-list"
      data-selected-date={props.selectedDate}
      data-selected-tag={props.selectedTag}
      data-is-pending={String(props.isPending)}
    >
      <button onClick={() => props.onDateClick('2024-01-01')}>date</button>
      <button onClick={() => props.onTagClick('react')}>tag</button>
    </div>
  ),
}));

import BlogPageClient from './BlogPageClient';

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

const posts: PostData[] = [makePost()];

afterEach(() => {
  cleanup();
  setSearchParams('');
  pushMock.mockClear();
});

describe('BlogPageClient', () => {
  it('initializes filters from present search params', () => {
    setSearchParams('date=2024-01-01&tag=react');

    render(<BlogPageClient posts={posts} />);

    const list = screen.getByTestId('blog-list');
    expect(list.getAttribute('data-selected-date')).toBe('2024-01-01');
    expect(list.getAttribute('data-selected-tag')).toBe('react');
  });

  it('initializes filters as empty strings when search params are absent', () => {
    setSearchParams('');

    render(<BlogPageClient posts={posts} />);

    const list = screen.getByTestId('blog-list');
    expect(list.getAttribute('data-selected-date')).toBe('');
    expect(list.getAttribute('data-selected-tag')).toBe('');
  });

  it('re-syncs filters state when searchParams change on rerender', async () => {
    setSearchParams('');
    const { rerender } = render(<BlogPageClient posts={posts} />);

    let list = screen.getByTestId('blog-list');
    expect(list.getAttribute('data-selected-date')).toBe('');

    setSearchParams('date=2024-05-05');
    rerender(<BlogPageClient posts={posts} />);

    await waitFor(() => {
      list = screen.getByTestId('blog-list');
      expect(list.getAttribute('data-selected-date')).toBe('2024-05-05');
    });
  });

  it('does not change filters state when searchParams rerender with the same values', () => {
    setSearchParams('date=2024-05-05');
    const { rerender } = render(<BlogPageClient posts={posts} />);

    let list = screen.getByTestId('blog-list');
    expect(list.getAttribute('data-selected-date')).toBe('2024-05-05');

    // Same params string but a new URLSearchParams instance - values are equal so the effect's
    // condition should be false and state should not change (still the same value either way).
    setSearchParams('date=2024-05-05');
    rerender(<BlogPageClient posts={posts} />);

    list = screen.getByTestId('blog-list');
    expect(list.getAttribute('data-selected-date')).toBe('2024-05-05');
  });

  it('handleDateClick sets the date, clears the tag, and pushes the URL', async () => {
    setSearchParams('');
    render(<BlogPageClient posts={posts} />);

    fireEvent.click(screen.getByText('date'));

    await waitFor(() => {
      const list = screen.getByTestId('blog-list');
      expect(list.getAttribute('data-selected-date')).toBe('2024-01-01');
      expect(list.getAttribute('data-selected-tag')).toBe('');
    });

    expect(pushMock).toHaveBeenCalledWith('/blog?date=2024-01-01', { scroll: false });
  });

  it('handleDateClick toggles the date off when clicking the same date again, pushing plain /blog', async () => {
    setSearchParams('date=2024-01-01');
    render(<BlogPageClient posts={posts} />);

    fireEvent.click(screen.getByText('date'));

    await waitFor(() => {
      const list = screen.getByTestId('blog-list');
      expect(list.getAttribute('data-selected-date')).toBe('');
    });

    expect(pushMock).toHaveBeenCalledWith('/blog', { scroll: false });
  });

  it('handleTagClick sets the tag, clears the date, and pushes the URL', async () => {
    setSearchParams('');
    render(<BlogPageClient posts={posts} />);

    fireEvent.click(screen.getByText('tag'));

    await waitFor(() => {
      const list = screen.getByTestId('blog-list');
      expect(list.getAttribute('data-selected-tag')).toBe('react');
      expect(list.getAttribute('data-selected-date')).toBe('');
    });

    expect(pushMock).toHaveBeenCalledWith('/blog?tag=react', { scroll: false });
  });

  it('handleTagClick toggles the tag off when clicking the same tag again, pushing plain /blog', async () => {
    setSearchParams('tag=react');
    render(<BlogPageClient posts={posts} />);

    fireEvent.click(screen.getByText('tag'));

    await waitFor(() => {
      const list = screen.getByTestId('blog-list');
      expect(list.getAttribute('data-selected-tag')).toBe('');
    });

    expect(pushMock).toHaveBeenCalledWith('/blog', { scroll: false });
  });

  it('passes isPending through to BlogList', () => {
    setSearchParams('');
    render(<BlogPageClient posts={posts} />);

    const list = screen.getByTestId('blog-list');
    expect(list.getAttribute('data-is-pending')).toBe('false');
  });
});
