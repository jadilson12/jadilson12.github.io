import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PostData } from '@/lib/posts';

const getSortedPostsDataMock = vi.hoisted(() => vi.fn(() => [] as PostData[]));
vi.mock('@/lib/posts', () => ({
  getSortedPostsData: getSortedPostsDataMock,
}));

vi.mock('@/components/Header', () => ({
  default: () => <div data-testid="header" />,
}));
vi.mock('@/components/Layout', () => ({
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));
vi.mock('./BlogPageClient', () => ({
  default: (props: any) => <div data-testid="blog-page-client" data-count={props.posts.length} />,
}));

import BlogPage, { metadata } from './page';

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
  getSortedPostsDataMock.mockReset();
});

describe('BlogPage', () => {
  it('renders posts fetched from getSortedPostsData through BlogPageClient', () => {
    getSortedPostsDataMock.mockReturnValue([makePost({ id: 'a', slug: 'a' }), makePost({ id: 'b', slug: 'b' })]);

    const { getByTestId } = render(<BlogPage />);

    expect(getSortedPostsDataMock).toHaveBeenCalled();
    expect(getByTestId('blog-page-client').getAttribute('data-count')).toBe('2');
  });

  it('renders zero posts when getSortedPostsData returns an empty array', () => {
    getSortedPostsDataMock.mockReturnValue([]);

    const { getByTestId } = render(<BlogPage />);

    expect(getByTestId('blog-page-client').getAttribute('data-count')).toBe('0');
  });

  it('exports metadata with the expected title', () => {
    expect((metadata.title as { absolute: string }).absolute).toBe(
      'Blog | Jadilson Guedes'
    );
  });

  it('exports metadata with the expected description', () => {
    expect(metadata.description).toBe(
      'Artigos sobre desenvolvimento web, programação e tecnologia por Jadilson Guedes.'
    );
  });
});
