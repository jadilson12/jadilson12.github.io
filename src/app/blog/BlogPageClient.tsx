'use client';

import type { PostData } from '@/lib/posts';
import React from 'react';
import BlogList from './BlogList';

interface BlogPageClientProps {
  posts: PostData[];
}

const BlogPageClient: React.FC<BlogPageClientProps> = ({ posts }) => {
  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [selectedTag, setSelectedTag] = React.useState<string>('');

  const handleDateClick = (date: string) => {
    setSelectedDate(date === selectedDate ? '' : date);
    setSelectedTag(''); // Clear tag filter when selecting date
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? '' : tag);
    setSelectedDate(''); // Clear date filter when selecting tag
  };

  return (
    <BlogList
      posts={posts}
      selectedDate={selectedDate}
      selectedTag={selectedTag}
      onDateClick={handleDateClick}
      onTagClick={handleTagClick}
    />
  );
};

export default BlogPageClient;
