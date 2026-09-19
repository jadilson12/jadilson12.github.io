'use client';

import type { PostData } from '@/lib/posts';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, useTransition } from 'react';
import BlogList from './BlogList';

interface FilterState {
  query: string;
  selectedDate: string;
  selectedTag: string;
}

// Only URL synchronization waits for hydration; article links are pre-rendered.
function FilterSync({
  onChange,
}: {
  onChange: (filters: FilterState) => void;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const selectedDate = searchParams.get('date') || '';
  const selectedTag = searchParams.get('tag') || '';

  useEffect(() => {
    onChange({ query, selectedDate, selectedTag });
  }, [query, selectedDate, selectedTag, onChange]);

  return null;
}

export default function BlogPageClient({ posts }: { posts: PostData[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    selectedDate: '',
    selectedTag: '',
  });

  function updateFilters(next: FilterState) {
    startTransition(() => {
      setFilters(next);
      const params = new URLSearchParams();
      if (next.query.trim()) params.set('q', next.query.trim());
      if (next.selectedDate) params.set('date', next.selectedDate);
      if (next.selectedTag) params.set('tag', next.selectedTag);
      const query = params.toString();
      router.push(query ? `/blog?${query}` : '/blog', { scroll: false });
    });
  }

  return (
    <>
      <Suspense fallback={null}>
        <FilterSync onChange={setFilters} />
      </Suspense>
      <BlogList
        posts={posts}
        query={filters.query}
        onClear={() =>
          updateFilters({ query: '', selectedDate: '', selectedTag: '' })
        }
        selectedDate={filters.selectedDate}
        selectedTag={filters.selectedTag}
        onDateClick={date =>
          updateFilters({
            ...filters,
            selectedDate: date === filters.selectedDate ? '' : date,
          })
        }
        onTagClick={tag =>
          updateFilters({
            ...filters,
            selectedTag: tag === filters.selectedTag ? '' : tag,
          })
        }
        isPending={isPending}
      />
    </>
  );
}
