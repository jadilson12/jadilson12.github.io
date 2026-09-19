'use client';

import type { PostData } from '@/lib/posts';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useOptimistic, useTransition } from 'react';
import BlogList from './BlogList';

interface BlogPageClientProps {
  posts: PostData[];
}

interface FilterState {
  selectedDate: string;
  selectedTag: string;
}

const BlogPageClient: React.FC<BlogPageClientProps> = ({ posts }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Initialize filters from URL params
  const [filters, setFilters] = React.useState<FilterState>({
    selectedDate: searchParams.get('date') || '',
    selectedTag: searchParams.get('tag') || '',
  });

  // Use React 19's useOptimistic for instant UI feedback
  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    filters,
    (state, newFilters: FilterState) => newFilters
  );

  // Update filters when URL params change (e.g. browser back/forward). Derived
  // during render (per React's "adjusting state when props change" guidance)
  // instead of in an effect, since `searchParams` is external, prop-like input.
  const searchKey = `${searchParams.get('date') || ''}|${searchParams.get('tag') || ''}`;
  const [prevSearchKey, setPrevSearchKey] = React.useState(searchKey);
  if (searchKey !== prevSearchKey) {
    setPrevSearchKey(searchKey);
    setFilters({
      selectedDate: searchParams.get('date') || '',
      selectedTag: searchParams.get('tag') || '',
    });
  }

  const handleDateClick = (date: string) => {
    const newFilters = {
      selectedDate: date === filters.selectedDate ? '' : date,
      selectedTag: '', // Clear tag filter when selecting date
    };

    // Show optimistic update immediately
    setOptimisticFilters(newFilters);

    // Update URL
    const params = new URLSearchParams();
    if (newFilters.selectedDate) {
      params.set('date', newFilters.selectedDate);
    }
    const queryString = params.toString();
    router.push(queryString ? `/blog?${queryString}` : '/blog', { scroll: false });

    // Then update actual state in a transition
    startTransition(() => {
      setFilters(newFilters);
    });
  };

  const handleTagClick = (tag: string) => {
    const newFilters = {
      selectedTag: tag === filters.selectedTag ? '' : tag,
      selectedDate: '', // Clear date filter when selecting tag
    };

    // Show optimistic update immediately
    setOptimisticFilters(newFilters);

    // Update URL
    const params = new URLSearchParams();
    if (newFilters.selectedTag) {
      params.set('tag', newFilters.selectedTag);
    }
    const queryString = params.toString();
    router.push(queryString ? `/blog?${queryString}` : '/blog', { scroll: false });

    // Then update actual state in a transition
    startTransition(() => {
      setFilters(newFilters);
    });
  };

  return (
    <BlogList
      posts={posts}
      selectedDate={optimisticFilters.selectedDate}
      selectedTag={optimisticFilters.selectedTag}
      onDateClick={handleDateClick}
      onTagClick={handleTagClick}
      isPending={isPending}
    />
  );
};

export default BlogPageClient;
