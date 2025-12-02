'use client';

import Breadcrumb from '@/components/Breadcrumb';
import type { PostData } from '@/lib/posts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface YearPageClientProps {
  year: string;
  yearPosts: PostData[];
  sortedMonths: string[];
  postsByMonth: Record<string, PostData[]>;
}

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const YearPageClient: React.FC<YearPageClientProps> = ({
  year,
  yearPosts,
  sortedMonths,
  postsByMonth
}) => {
  return (
    <div className="min-h-screen pt-20 md:pt-32 pb-12 md:pb-20">
      <div className="container-custom max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: year },
          ]}
        />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {year}
            <span className="text-primary-300"> #</span>
          </h1>
          <p className="text-dark-300 text-lg">
            {yearPosts.length} {yearPosts.length === 1 ? 'artigo publicado' : 'artigos publicados'} em {year}
          </p>
        </motion.div>

        {/* On this page - Table of Contents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 p-6 bg-dark-900/50 rounded-lg border border-dark-800"
        >
          <h2 className="text-xl font-bold text-white mb-4">On this page</h2>
          <ul className="space-y-2">
            {sortedMonths.map((month) => {
              const monthNum = parseInt(month) - 1;
              const monthName = monthNames[monthNum];
              const count = postsByMonth[month].length;

              return (
                <li key={month}>
                  <a
                    href={`#${year}-${monthName.toLowerCase()}`}
                    className="text-dark-300 hover:text-primary-300 transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>{year} - {monthName}</span>
                    <span className="text-xs text-dark-500">{count}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* Posts by Month */}
        <div className="space-y-16">
          {sortedMonths.map((month, monthIndex) => {
            const monthNum = parseInt(month) - 1;
            const monthName = monthNames[monthNum];
            const posts = postsByMonth[month];

            return (
              <motion.section
                key={month}
                id={`${year}-${monthName.toLowerCase()}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + monthIndex * 0.1 }}
              >
                <h2 className="text-3xl font-bold text-white mb-8">
                  {year} - {monthName}
                </h2>

                <div className="space-y-6">
                  {posts.map((post, postIndex) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 + monthIndex * 0.1 + postIndex * 0.05 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <article className="card card-hover overflow-hidden cursor-pointer group">
                          <div className="p-6">
                            {/* Author Info */}
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 rounded-full border-2 border-dark-700 bg-dark-800 overflow-hidden relative flex-shrink-0">
                                <Image
                                  src="https://github.com/jadilson12.png"
                                  alt="Jadilson Guedes"
                                  width={40}
                                  height={40}
                                  className="object-cover"
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
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors duration-200">
                              {post.title}
                            </h3>

                            {/* Description */}
                            {post.description && (
                              <p className="text-dark-300 text-sm mb-4 line-clamp-2">
                                {post.description}
                              </p>
                            )}

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2">
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
                          </div>
                        </article>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YearPageClient;
