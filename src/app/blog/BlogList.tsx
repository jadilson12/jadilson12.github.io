'use client';

import BlogSidebar from '@/components/BlogSidebar';
import type { PostData } from '@/lib/posts';
import Link from 'next/link';

interface BlogListProps {
  posts: PostData[];
  query: string;
  selectedDate: string;
  selectedTag: string;
  onDateClick: (date: string) => void;
  onTagClick: (tag: string) => void;
  onClear: () => void;
  isPending?: boolean;
}
const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const monthNames = [
  'Janeiro', 'Fevereiro', 'Mar\u00e7o', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function groupByMonth(posts: PostData[]) {
  const groups = new Map<string, PostData[]>();
  for (const post of posts) {
    const date = new Date(post.date);
    const key = `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;
    const group = groups.get(key);
    if (group) {
      group.push(post);
    } else {
      groups.set(key, [post]);
    }
  }
  return [...groups.entries()]
    .toSorted((a, b) => b[0].localeCompare(a[0]))
    .map(([key, groupPosts]) => {
      const [year, month] = key.split('-');
      return {
        key,
        year,
        monthName: monthNames[Number.parseInt(month, 10) - 1],
        posts: groupPosts,
      };
    });
}

export default function BlogList({
  posts,
  query,
  selectedDate,
  selectedTag,
  onDateClick,
  onTagClick,
  onClear,
  isPending,
}: BlogListProps) {
  const filteredPosts = posts.filter(
    post =>
      (!selectedDate || post.date.slice(0, 10) === selectedDate) &&
      (!selectedTag || post.tags?.includes(selectedTag)) &&
      (!query ||
        normalize(
          `${post.title} ${post.description || ''} ${post.tags?.join(' ') || ''}`
        ).includes(normalize(query.trim())))
  );
  const years = [...new Set(posts.map(post => post.date.slice(0, 4)))]
    .sort()
    .reverse();
  const hasFilters = Boolean(query || selectedDate || selectedTag);
  const groupedPosts = groupByMonth(filteredPosts);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen pb-20 pt-24 md:pt-32"
    >
      <div className="container-custom">
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Blog</h1>
        <p className="mb-6 text-dark-200">
          Desenvolvimento, arquitetura e tecnologia na prática.
        </p>
        <div className="mb-6 rounded-xl border border-dark-700 bg-dark-900 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <output aria-live="polite" className="text-sm text-dark-200">
              {isPending
                ? 'Atualizando…'
                : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}`}
            </output>
            {hasFilters && (
              <button
                type="button"
                onClick={onClear}
                className="min-h-11 rounded-lg px-3 text-sm text-primary-300 hover:bg-dark-800"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>
        <details className="mb-6 rounded-lg border border-dark-700 p-3 lg:hidden">
          <summary className="cursor-pointer py-2 font-medium">
            Arquivo por ano
          </summary>
          <nav
            aria-label="Arquivo por ano"
            className="mt-2 flex flex-wrap gap-2"
          >
            {years.map(year => (
              <Link
                key={year}
                href={`/blog/year/${year}`}
                className="rounded-lg bg-dark-800 px-4 py-3 text-primary-300"
              >
                {year}
              </Link>
            ))}
          </nav>
        </details>
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8" aria-busy={isPending}>
            {groupedPosts.map(group => (
              <section key={group.key} className="mb-10">
                <h2 className="mb-4 flex items-baseline gap-2 text-lg font-semibold text-dark-200">
                  {group.year} — {group.monthName}
                  <span className="text-sm font-normal text-dark-400">
                    ({group.posts.length}{' '}
                    {group.posts.length === 1 ? 'post' : 'posts'})
                  </span>
                </h2>
                <ul className="space-y-6">
                  {group.posts.map(post => (
                    <li
                      key={post.id}
                      className="border-b border-dark-800 pb-6 last:border-0 last:pb-0"
                    >
                      <time
                        dateTime={post.date}
                        className="text-sm text-dark-400"
                      >
                        {new Date(post.date).toLocaleDateString('pt-BR', {
                          timeZone: 'UTC',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </time>
                      <h3 className="mt-1 text-lg font-bold leading-snug text-white">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-primary-300"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      {post.tags && post.tags.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-primary-300">
                          {post.tags.map(tag => (
                            <span key={tag}>#{tag}</span>
                          ))}
                        </div>
                      )}
                      <p className="mt-2 text-sm leading-relaxed text-dark-200">
                        {post.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {filteredPosts.length === 0 && (
              <div className="rounded-xl border border-dark-700 px-4 py-12 text-center">
                <h2 className="mb-2 text-xl font-semibold">
                  Nenhum artigo encontrado
                </h2>
                <p className="mb-4 text-dark-200">
                  Tente outro termo ou remova os filtros.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClear}
                >
                  Ver todos os artigos
                </button>
              </div>
            )}
          </div>
          <aside className="hidden min-w-0 lg:col-span-4 lg:block">
            <BlogSidebar
              posts={posts}
              selectedDate={selectedDate}
              selectedTag={selectedTag}
              onDateClick={onDateClick}
              onTagClick={onTagClick}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
