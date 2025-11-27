'use client';

import type { PostData } from '@/lib/posts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

interface BlogSidebarProps {
  posts: PostData[];
  selectedDate?: string;
  selectedTag?: string;
  onDateClick: (date: string) => void;
  onTagClick: (tag: string) => void;
}

interface DateGroup {
  year: string;
  months: {
    [key: string]: {
      days: Set<string>;
      count: number;
    };
  };
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({
  posts,
  selectedDate,
  selectedTag,
  onDateClick,
  onTagClick,
}) => {
  const [expandedYears, setExpandedYears] = React.useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = React.useState<Set<string>>(new Set());

  // Organize posts by date
  const dateGroups = React.useMemo(() => {
    const groups: { [key: string]: DateGroup } = {};

    posts.forEach((post) => {
      const date = new Date(post.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      if (!groups[year]) {
        groups[year] = { year, months: {} };
      }

      if (!groups[year].months[month]) {
        groups[year].months[month] = { days: new Set(), count: 0 };
      }

      groups[year].months[month].days.add(day);
      groups[year].months[month].count++;
    });

    return Object.values(groups).sort((a, b) => b.year.localeCompare(a.year));
  }, [posts]);

  const toggleYear = (year: string) => {
    setExpandedYears(prev => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  };

  const toggleMonth = (yearMonth: string) => {
    setExpandedMonths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(yearMonth)) {
        newSet.delete(yearMonth);
      } else {
        newSet.add(yearMonth);
      }
      return newSet;
    });
  };

  // Get all unique tags with counts
  const tagCounts = React.useMemo(() => {
    const counts: { [key: string]: number } = {};

    posts.forEach((post) => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [posts]);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Posts by Date */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="card p-4 md:p-6"
      >
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Posts por Data
        </h3>

        <div className="space-y-3">
          {/* Clear filter button */}
          {selectedDate && (
            <button
              onClick={() => onDateClick('')}
              className="w-full text-left px-3 py-2 text-sm bg-primary-300/10 text-primary-300 rounded-lg hover:bg-primary-300/20 transition-colors duration-200"
            >
              ✕ Limpar filtro
            </button>
          )}

          {dateGroups.map((yearGroup) => {
            const isYearExpanded = expandedYears.has(yearGroup.year);
            const totalPosts = Object.values(yearGroup.months).reduce((sum, m) => sum + m.count, 0);

            return (
              <div key={yearGroup.year} className="space-y-2">
                {/* Year */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/blog/year/${yearGroup.year}`}
                    className="flex-1 flex items-center justify-between text-white font-semibold text-sm hover:text-primary-300 transition-colors duration-200 py-1"
                  >
                    <span>{yearGroup.year}</span>
                    <span className="text-xs text-dark-400 font-normal">
                      {totalPosts} {totalPosts === 1 ? 'post' : 'posts'}
                    </span>
                  </Link>
                  <button
                    onClick={() => toggleYear(yearGroup.year)}
                    className="p-1 hover:text-primary-300 transition-colors duration-200"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isYearExpanded ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Months */}
                {isYearExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-3 space-y-1"
                  >
                    {Object.entries(yearGroup.months)
                      .sort((a, b) => b[0].localeCompare(a[0]))
                      .map(([month, data]) => {
                        const monthNum = parseInt(month) - 1;
                        const monthName = monthNames[monthNum];
                        const yearMonthKey = `${yearGroup.year}-${month}`;
                        const isMonthExpanded = expandedMonths.has(yearMonthKey);

                        return (
                          <div key={month} className="space-y-1">
                            <button
                              onClick={() => toggleMonth(yearMonthKey)}
                              className="w-full flex items-center justify-between text-dark-300 text-xs font-medium hover:text-white transition-colors duration-200 py-1"
                            >
                              <span>{monthName}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-dark-400 font-normal">
                                  {data.count}
                                </span>
                                <svg
                                  className={`w-3 h-3 transition-transform duration-200 ${isMonthExpanded ? 'rotate-180' : ''}`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {/* Days */}
                            {isMonthExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="ml-3 flex flex-wrap gap-1"
                              >
                                {Array.from(data.days)
                                  .sort((a, b) => b.localeCompare(a))
                                  .map((day) => {
                                    const dateKey = `${yearGroup.year}-${month}-${day}`;
                                    const isSelected = selectedDate === dateKey;

                                    return (
                                      <button
                                        key={day}
                                        onClick={() => onDateClick(dateKey)}
                                        className={`
                                          px-2 py-1 text-xs rounded transition-all duration-200
                                          ${isSelected
                                            ? 'bg-primary-300 text-dark-950 font-semibold'
                                            : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                                          }
                                        `}
                                      >
                                        {day}
                                      </button>
                                    );
                                  })}
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="card p-4 md:p-6"
      >
        <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Tags
        </h3>

        <div className="space-y-2">
          {/* Clear filter button */}
          {selectedTag && (
            <button
              onClick={() => onTagClick('')}
              className="w-full text-left px-3 py-2 text-sm bg-primary-300/10 text-primary-300 rounded-lg hover:bg-primary-300/20 transition-colors duration-200"
            >
              ✕ Limpar filtro
            </button>
          )}

          {tagCounts.map(({ tag, count }) => {
            const isSelected = selectedTag === tag;

            return (
              <button
                key={tag}
                onClick={() => onTagClick(tag)}
                className={`
                  w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between gap-2
                  ${isSelected
                    ? 'bg-primary-300 text-dark-950'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
                  }
                `}
              >
                <span className="text-sm">#{tag}</span>
                <span className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${isSelected
                    ? 'bg-dark-950/20 text-dark-950'
                    : 'bg-dark-950/50 text-dark-400'
                  }
                `}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {tagCounts.length === 0 && (
          <p className="text-dark-400 text-sm">Nenhuma tag disponível</p>
        )}
      </motion.div>
    </div>
  );
};

export default BlogSidebar;
