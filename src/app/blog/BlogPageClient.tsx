'use client';

import type { PostData } from '@/lib/posts';
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
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = React.useState<FilterState>({
    selectedDate: '',
    selectedTag: '',
  });

  // Use React 19's useOptimistic for instant UI feedback
  const [optimisticFilters, setOptimisticFilters] = useOptimistic(
    filters,
    (state, newFilters: FilterState) => newFilters
  );

  const handleDateClick = (date: string) => {
    const newFilters = {
      selectedDate: date === filters.selectedDate ? '' : date,
      selectedTag: '', // Clear tag filter when selecting date
    };

    // Show optimistic update immediately
    setOptimisticFilters(newFilters);

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
