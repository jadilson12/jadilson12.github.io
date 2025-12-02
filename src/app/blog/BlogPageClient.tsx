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

  // Update filters when URL params change
  React.useEffect(() => {
    const date = searchParams.get('date') || '';
    const tag = searchParams.get('tag') || '';

    if (date !== filters.selectedDate || tag !== filters.selectedTag) {
      setFilters({ selectedDate: date, selectedTag: tag });
    }
  }, [searchParams, filters.selectedDate, filters.selectedTag]);

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
