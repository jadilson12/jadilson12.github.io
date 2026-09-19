import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PostData } from '@/lib/posts';

afterEach(cleanup);

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

vi.mock('@/lib/posts', () => ({
  getSortedPostsData: vi.fn(() => []),
}));

vi.mock('@/components/Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('@/components/Layout', () => ({
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));
vi.mock('./YearPageClient', () => ({
  default: (props: any) => (
    <div
      data-testid="year-client"
      data-year={props.year}
      data-months={JSON.stringify(props.sortedMonths)}
      data-count={props.yearPosts.length}
    />
  ),
}));

import { getSortedPostsData } from '@/lib/posts';
import YearPage, { generateMetadata, generateStaticParams } from './page';

describe('generateStaticParams', () => {
  it('derives unique years from post dates, de-duplicating same-year posts', async () => {
    vi.mocked(getSortedPostsData).mockReturnValue([
      makePost({ id: 'a', date: '2024-01-10' }),
      makePost({ id: 'b', date: '2024-05-20' }),
      makePost({ id: 'c', date: '2023-03-01' }),
    ]);

    const result = await generateStaticParams();
    expect(result).toEqual([{ year: '2024' }, { year: '2023' }]);
  });
});

describe('generateMetadata', () => {
  it('returns title and description templated with the year', async () => {
    const result = await generateMetadata({ params: Promise.resolve({ year: '2024' }) });
    expect((result.title as { absolute: string }).absolute).toBe(
      'Posts de 2024 | Jadilson Guedes'
    );
    expect(result.description).toBe(
      'Todos os artigos publicados em 2024 por Jadilson Guedes sobre programação e tecnologia.'
    );
  });
});

describe('YearPage', () => {
  it('filters posts by year, groups by month, and sorts months descending', async () => {
    vi.mocked(getSortedPostsData).mockReturnValue([
      makePost({ id: 'jan-1', date: '2024-01-05' }),
      makePost({ id: 'jan-2', date: '2024-01-20' }),
      makePost({ id: 'mar-1', date: '2024-03-10' }),
      makePost({ id: 'other-year', date: '2023-01-01' }),
    ]);

    const jsx = await YearPage({ params: Promise.resolve({ year: '2024' }) });
    render(jsx);

    const client = screen.getByTestId('year-client');
    expect(client).toHaveAttribute('data-year', '2024');
    expect(client).toHaveAttribute('data-months', JSON.stringify(['03', '01']));
    expect(client).toHaveAttribute('data-count', '3');
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});
