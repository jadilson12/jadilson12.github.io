'use client';

import BlogSidebar from '@/components/BlogSidebar';
import Breadcrumb from '@/components/Breadcrumb';
import type { PostData } from '@/lib/posts';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface BlogListProps {
  posts: PostData[];
  selectedDate?: string;
  selectedTag?: string;
  onDateClick: (date: string) => void;
  onTagClick: (tag: string) => void;
  isPending?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  posts,
  selectedDate,
  selectedTag,
  onDateClick,
  onTagClick,
  isPending = false,
}) => {
  const [displayCount, setDisplayCount] = React.useState(10);
  const [isLoading, setIsLoading] = React.useState(false);
  const POSTS_PER_LOAD = 10;
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Filter and sort posts based on selected date and tag
  const filteredPosts = React.useMemo(() => {
    let filtered = posts;

    // Apply date filter
    if (selectedDate) {
      filtered = filtered.filter((post) => {
        const date = new Date(post.date);
        const year = date.getFullYear().toString();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const postDate = `${year}-${month}-${day}`;
        return postDate === selectedDate;
      });
    }

    // Apply tag filter
    if (selectedTag) {
      filtered = filtered.filter((post) =>
        post.tags?.includes(selectedTag)
      );
    }

    // Sort by most recent date
    const sorted = [...filtered].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return sorted;
  }, [posts, selectedDate, selectedTag]);

  // Reset display count when filters change
  React.useEffect(() => {
    setDisplayCount(POSTS_PER_LOAD);
  }, [selectedDate, selectedTag]);

  // Get posts to display
  const displayedPosts = filteredPosts.slice(0, displayCount);
  const hasMore = displayCount < filteredPosts.length;

  // Infinite scroll with Intersection Observer
  React.useEffect(() => {
    const currentRef = loadMoreRef.current;
    if (!currentRef || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
          setIsLoading(true);
          // Simulate loading delay for smoother UX
          setTimeout(() => {
            setDisplayCount((prev) => prev + POSTS_PER_LOAD);
            setIsLoading(false);
          }, 500);
        }
      },
      {
        root: null,
        rootMargin: '200px', // Load more when 200px before reaching the end
        threshold: 0.1,
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading]);

  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-12 md:pb-20">
      <div className="container-custom max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog' },
          ]}
        />

        {/* Main Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Blog Posts - Left Side */}
          <div className="lg:col-span-8">
            {/* Active Filters */}
            {(selectedDate || selectedTag) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-dark-800 rounded-lg"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-dark-300 text-sm">Filtros ativos:</span>
                  {selectedDate && (
                    <span className="px-3 py-1 text-sm bg-primary-300 text-dark-950 rounded-full flex items-center gap-2">
                      📅 {new Date(selectedDate).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                  {selectedTag && (
                    <span className="px-3 py-1 text-sm bg-primary-300 text-dark-950 rounded-full flex items-center gap-2">
                      🏷️ {selectedTag}
                    </span>
                  )}
                  <span className="text-dark-400 text-sm ml-auto">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'post encontrado' : 'posts encontrados'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Blog Posts Grid with React 19 useTransition feedback */}
            <div className={`grid grid-cols-1 gap-6 transition-opacity duration-200 ${isPending ? 'opacity-60' : 'opacity-100'}`}>
              {displayedPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <motion.div
                      className="card card-hover overflow-hidden h-full flex flex-col cursor-pointer group"
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Author Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full border-2 border-dark-700 bg-dark-800 overflow-hidden relative flex-shrink-0">
                            <Image
                              src="https://github.com/jadilson12.png"
                              alt="Jadilson Guedes"
                              width={48}
                              height={48}
                              className="object-cover"
                              priority
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-medium text-sm">Jadilson Guedes</h3>
                            <time className="text-primary-300 text-xs">
                              {new Date(post.date).toLocaleDateString('pt-BR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </time>
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors duration-200 line-clamp-2">
                          {post.title}
                        </h2>

                        {/* Description */}
                        <p className="text-dark-300 text-sm mb-4 flex-grow line-clamp-2">
                          {post.description}
                        </p>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 4).map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 text-xs bg-dark-800 text-dark-300 rounded-md border border-dark-700"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Footer with Read More */}
                        <div className="flex items-center justify-between pt-4 border-t border-dark-800">
                          <motion.div
                            className="flex items-center gap-2 text-primary-300 font-medium text-sm"
                            whileHover={{ x: 5 }}
                          >
                            <span>Ler artigo</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </motion.div>

                          {/* Reading time estimate (optional) */}
                          <span className="text-dark-400 text-xs">
                            {Math.ceil((post.description?.length || 0) / 200)} min leitura
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {hasMore && (
              <div ref={loadMoreRef} className="mt-8 flex justify-center py-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-dark-400"
                >
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-sm">Carregando mais posts...</span>
                </motion.div>
              </div>
            )}

            {/* End of Posts Message */}
            {!hasMore && filteredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-8 text-center py-8 border-t border-dark-800"
              >
                <p className="text-dark-400 text-sm">
                  Você chegou ao fim! 🎉 Total de {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
                </p>
              </motion.div>
            )}

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark-800 mb-6">
                  <svg className="w-10 h-10 text-dark-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedDate || selectedTag ? 'Nenhum post encontrado' : 'Nenhum post ainda'}
                </h3>
                <p className="text-dark-400">
                  {selectedDate || selectedTag
                    ? 'Tente ajustar os filtros para ver mais resultados'
                    : 'Volte em breve para novo conteúdo!'}
                </p>
              </motion.div>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <aside className="lg:col-span-4 order-last">
            <div className="lg:sticky lg:top-24">
              <BlogSidebar
                posts={posts}
                selectedDate={selectedDate}
                selectedTag={selectedTag}
                onDateClick={onDateClick}
                onTagClick={onTagClick}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
