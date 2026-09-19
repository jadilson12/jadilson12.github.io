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
    useInView: vi.fn(() => true),
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {}, onChange: () => () => {} } }),
    useTransform: () => 0,
  };
});

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { PostData } from '@/lib/posts';
import BlogSidebar from './BlogSidebar';

afterEach(cleanup);

const makePost = (overrides: Partial<PostData>): PostData => ({
  id: overrides.slug ?? 'post',
  slug: 'post',
  title: 'Post title',
  date: '2024-01-01',
  ...overrides,
});

describe('BlogSidebar', () => {
  it('shows an empty-state message for tags when there are no posts', () => {
    render(
      <BlogSidebar posts={[]} onDateClick={vi.fn()} onTagClick={vi.fn()} />
    );
    expect(screen.getByText('Nenhuma tag disponível')).toBeInTheDocument();
  });

  it('shows an empty-state message when posts have no tags field', () => {
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'a', date: '2024-03-05', title: 'Post A' }),
    ];
    render(<BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={vi.fn()} />);
    expect(screen.getByText('Nenhuma tag disponível')).toBeInTheDocument();
  });

  it('renders posts grouped by year/month, with a singular "post" label for a single post in a year', () => {
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: '2023-06-15', title: 'Post A', tags: ['react'] }),
    ];
    render(<BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={vi.fn()} />);

    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('1 post')).toBeInTheDocument();
  });

  it('renders the plural "posts" label for a year with 2+ posts and aggregates tags with counts sorted desc', () => {
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: '2024-06-15', title: 'Post A', tags: ['react', 'js'] }),
      makePost({ id: 'b', slug: 'post-b', date: '2024-06-20', title: 'Post B', tags: ['react'] }),
    ];
    render(<BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={vi.fn()} />);

    expect(screen.getByText('2 posts')).toBeInTheDocument();

    // react has count 2, js has count 1 -> react should appear before js in DOM order
    const reactButton = screen.getByText('#react').closest('button')!;
    const jsButton = screen.getByText('#js').closest('button')!;
    const buttons = Array.from(document.querySelectorAll('button')).filter((b) =>
      b.textContent?.includes('#')
    );
    expect(buttons.indexOf(reactButton)).toBeLessThan(buttons.indexOf(jsButton));
  });

  it('expands/collapses a year on repeated clicks of the year toggle, revealing months', () => {
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: '2024-06-15', title: 'Post A' }),
    ];
    render(<BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={vi.fn()} />);

    // Note: re-query the toggle button fresh before every click instead of
    // caching it. The mocked `motion` proxy hands back a brand-new component
    // reference on every render, so React fully remounts the <motion.div>
    // subtree (and its siblings, since they all live under the same
    // <motion.div> card wrapper) whenever expandedYears/expandedMonths state
    // changes; a cached DOM reference from a previous render is detached and
    // no longer receives events.
    const getYearToggleButton = () => {
      const yearRow = screen.getByText('2024').closest('div')!.parentElement as HTMLElement;
      return within(yearRow).getAllByRole('button')[0];
    };

    // Month name should not be visible initially (year collapsed)
    expect(screen.queryByText('Junho')).not.toBeInTheDocument();

    fireEvent.click(getYearToggleButton());
    expect(screen.getByText('Junho')).toBeInTheDocument();

    fireEvent.click(getYearToggleButton());
    expect(screen.queryByText('Junho')).not.toBeInTheDocument();
  });

  it('expands/collapses a month on repeated clicks of the month toggle, revealing posts', () => {
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: '2024-06-15', title: 'Post A' }),
    ];
    render(<BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={vi.fn()} />);

    const getYearToggleButton = () => {
      const yearRow = screen.getByText('2024').closest('div')!.parentElement as HTMLElement;
      return within(yearRow).getAllByRole('button')[0];
    };
    const getMonthToggleButton = () => screen.getByText('Junho').closest('button')!;

    fireEvent.click(getYearToggleButton());
    expect(screen.queryByText('Post A')).not.toBeInTheDocument();

    fireEvent.click(getMonthToggleButton());
    expect(screen.getByText('Post A')).toBeInTheDocument();

    fireEvent.click(getMonthToggleButton());
    expect(screen.queryByText('Post A')).not.toBeInTheDocument();
  });

  it('sorts multiple years in descending order', () => {
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: '2022-03-10', title: 'Post 2022' }),
      makePost({ id: 'b', slug: 'post-b', date: '2024-03-10', title: 'Post 2024' }),
    ];
    render(<BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={vi.fn()} />);

    const years = screen.getAllByText(/^2022$|^2024$/).map((el) => el.textContent);
    expect(years.indexOf('2024')).toBeLessThan(years.indexOf('2022'));
  });

  it('sorts multiple months within an expanded year in descending order', () => {
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: '2024-02-10', title: 'Post February' }),
      makePost({ id: 'b', slug: 'post-b', date: '2024-08-10', title: 'Post August' }),
    ];
    render(<BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={vi.fn()} />);

    const yearRow = screen.getByText('2024').closest('div')!.parentElement as HTMLElement;
    fireEvent.click(within(yearRow).getAllByRole('button')[0]);

    const monthNames = screen.getAllByText(/Fevereiro|Agosto/).map((el) => el.textContent);
    expect(monthNames.indexOf('Agosto')).toBeLessThan(monthNames.indexOf('Fevereiro'));
  });

  it('calls onDateClick with an empty string when the date clear-filter button is clicked, and hides it when no selectedDate', () => {
    const onDateClick = vi.fn();
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: '2024-06-15', title: 'Post A' }),
    ];

    const { rerender } = render(
      <BlogSidebar posts={posts} onDateClick={onDateClick} onTagClick={vi.fn()} />
    );
    expect(screen.queryByText('✕ Limpar filtro')).not.toBeInTheDocument();

    rerender(
      <BlogSidebar
        posts={posts}
        selectedDate="2024-06-15"
        onDateClick={onDateClick}
        onTagClick={vi.fn()}
      />
    );

    const clearButtons = screen.getAllByText('✕ Limpar filtro');
    fireEvent.click(clearButtons[0]);
    expect(onDateClick).toHaveBeenCalledWith('');
  });

  it('calls onTagClick with an empty string when the tag clear-filter button is clicked, and hides it when no selectedTag', () => {
    const onTagClick = vi.fn();
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: '2024-06-15', title: 'Post A', tags: ['react'] }),
    ];

    const { rerender } = render(
      <BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={onTagClick} />
    );
    expect(screen.queryByText('✕ Limpar filtro')).not.toBeInTheDocument();

    rerender(
      <BlogSidebar
        posts={posts}
        selectedTag="react"
        onDateClick={vi.fn()}
        onTagClick={onTagClick}
      />
    );

    const clearButtons = screen.getAllByText('✕ Limpar filtro');
    fireEvent.click(clearButtons[clearButtons.length - 1]);
    expect(onTagClick).toHaveBeenCalledWith('');
  });

  it('calls onTagClick with the tag name when a tag button is clicked', () => {
    const onTagClick = vi.fn();
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: '2024-06-15', title: 'Post A', tags: ['react'] }),
    ];
    render(<BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={onTagClick} />);

    fireEvent.click(screen.getByText('#react'));
    expect(onTagClick).toHaveBeenCalledWith('react');
  });

  it('highlights the post day link matching selectedDate', () => {
    const postDateIso = '2024-06-15';
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'post-a', date: postDateIso, title: 'Post A' }),
    ];

    // Compute the dateKey the same way BlogSidebar does (using local Date
    // getters on a date-only ISO string), so this test is not sensitive to
    // the machine's timezone shifting the local day/month.
    const d = new Date(postDateIso);
    const year = d.getFullYear().toString();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const selectedDate = `${year}-${month}-${day}`;
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
    ];
    const monthName = monthNames[d.getMonth()];

    render(
      <BlogSidebar
        posts={posts}
        selectedDate={selectedDate}
        onDateClick={vi.fn()}
        onTagClick={vi.fn()}
      />
    );

    const yearRow = screen.getByText(year).closest('div')!.parentElement as HTMLElement;
    fireEvent.click(within(yearRow).getAllByRole('button')[0]);
    fireEvent.click(screen.getByText(monthName).closest('button')!);

    const postLink = screen.getByText('Post A').closest('a')!;
    expect(postLink.className).toContain('bg-primary-300');
  });

  it('renders a post link that navigates to the post slug, within an expanded month', () => {
    const posts: PostData[] = [
      makePost({ id: 'a', slug: 'my-post-slug', date: '2024-06-15', title: 'Post A' }),
    ];
    render(<BlogSidebar posts={posts} onDateClick={vi.fn()} onTagClick={vi.fn()} />);

    const yearRow = screen.getByText('2024').closest('div')!.parentElement as HTMLElement;
    fireEvent.click(within(yearRow).getAllByRole('button')[0]);
    fireEvent.click(screen.getByText('Junho').closest('button')!);

    const postLink = screen.getByText('Post A').closest('a')!;
    expect(postLink).toHaveAttribute('href', '/blog/my-post-slug');
  });
});
