'use client';

import Breadcrumb from '@/components/Breadcrumb';
import FloatingTocButton from '@/components/FloatingTocButton';
import ShareButtons from '@/components/ShareButtons';
import TableOfContents from '@/components/TableOfContents';
import type { PostData } from '@/lib/posts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

interface BlogPostContentProps {
  post: PostData;
  children: React.ReactNode;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ post, children }) => {
  return (
    <>
      <article className="min-h-screen pt-20 md:pt-32 pb-12 md:pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />

          <div className="flex flex-col xl:flex-row gap-6 xl:gap-8 items-start">{/* Sidebar - Table of Contents */}
            <TableOfContents />

          {/* Main Content */}
          <div className="flex-1 w-full max-w-4xl xl:mx-auto">{/* Rest of the content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <header className="mb-8 md:mb-12">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 md:mb-6"
                >
                  {post.title}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-base sm:text-lg md:text-xl text-dark-300 leading-relaxed mb-3 md:mb-4"
                >
                  {post.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <time className="text-primary-300 text-sm font-medium">
                    {new Date(post.date).toLocaleDateString('pt-BR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </motion.div>
              </header>

              {/* Divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="h-px bg-gradient-to-r from-transparent via-primary-300/30 to-transparent mb-8 md:mb-12"
              />

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="prose prose-base md:prose-lg prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-h1:hidden prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-8 md:prose-h2:mt-12 prose-h2:mb-4 md:prose-h2:mb-6 prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-6 md:prose-h3:mt-8 prose-h3:mb-3 md:prose-h3:mb-4 prose-p:text-dark-200 prose-p:leading-loose prose-p:mb-4 md:prose-p:mb-6 prose-a:text-primary-300 prose-a:no-underline hover:prose-a:text-primary-400 prose-code:text-primary-300 prose-code:bg-dark-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-dark-800 prose-pre:border prose-pre:border-dark-700 prose-pre:p-3 md:prose-pre:p-4 prose-pre:overflow-x-auto prose-strong:text-white prose-strong:font-semibold prose-ul:text-dark-200 prose-ul:leading-loose prose-ol:text-dark-200 prose-ol:leading-loose prose-li:marker:text-primary-300 prose-li:leading-loose prose-li:mb-2 prose-blockquote:border-l-primary-300 prose-blockquote:text-dark-300 prose-img:rounded-xl"
              >
                {children}
              </motion.div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-dark-700"
                >
                  <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3 md:mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 text-sm bg-dark-800 text-primary-300 rounded-full border border-primary-300/20 hover:bg-dark-700 transition-colors duration-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Share Buttons */}
              <ShareButtons
                title={post.title}
                url={typeof window !== 'undefined' ? window.location.href : ''}
                description={post.description}
              />

              {/* Back to Blog */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-10 md:mt-16 pt-8 md:pt-12 border-t border-dark-700"
              >
                <Link href="/blog" className="inline-flex items-center gap-2 text-primary-300 hover:text-primary-400 transition-colors duration-200">
                  <motion.span
                    className="inline-flex items-center gap-2 cursor-pointer"
                    whileHover={{ x: -5 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span>Voltar ao Blog</span>
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </div>{/* End Main Content */}
        </div>{/* End flex container */}
      </div>{/* End container */}
      </article>

      {/* Floating TOC Button for Mobile/Tablet */}
      <FloatingTocButton />
    </>
  );
};

export default BlogPostContent;
