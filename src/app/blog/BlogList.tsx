'use client';

import BlogSidebar from '@/components/BlogSidebar';
import Breadcrumb from '@/components/Breadcrumb';
import type { PostData } from '@/lib/posts';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface BlogListProps {
  posts: PostData[];
  query: string;
  selectedDate: string;
  selectedTag: string;
  onSearch: (query: string) => void;
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

export default function BlogList({
  posts,
  query,
  selectedDate,
  selectedTag,
  onSearch,
  onDateClick,
  onTagClick,
  onClear,
  isPending,
}: BlogListProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  const filterKey = JSON.stringify([query, selectedDate, selectedTag]);
  const [pagination, setPagination] = useState({ key: filterKey, count: 10 });
  const displayCount = pagination.key === filterKey ? pagination.count : 10;
  useEffect(() => {
    if (searchRef.current) searchRef.current.value = query;
  }, [query]);
  const filteredPosts = posts.filter(
    post =>
      (!selectedDate || post.date.slice(0, 10) === selectedDate) &&
      (!selectedTag || post.tags?.includes(selectedTag)) &&
      (!query ||
        normalize(
          `${post.title} ${post.description || ''} ${post.tags?.join(' ') || ''}`
        ).includes(normalize(query.trim())))
  );
  const tags = [...new Set(posts.flatMap(post => post.tags || []))].sort();
  const years = [...new Set(posts.map(post => post.date.slice(0, 4)))]
    .sort()
    .reverse();
  const hasFilters = Boolean(query || selectedDate || selectedTag);
  const displayedPosts = filteredPosts.slice(0, displayCount);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen pb-20 pt-24 md:pt-32"
    >
      <div className="container-custom">
        <Breadcrumb
          items={[{ label: 'Início', href: '/' }, { label: 'Blog' }]}
        />
        <h1 className="mb-2 text-3xl font-bold md:text-4xl">Blog</h1>
        <p className="mb-6 text-dark-200">
          Desenvolvimento, arquitetura e tecnologia na prática.
        </p>
        <div className="mb-6 rounded-xl border border-dark-700 bg-dark-900 p-4">
          <search>
            <form
              className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"
              onSubmit={event => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                onSearch(String(data.get('q') || ''));
              }}
            >
              <div className="min-w-0 sm:col-span-2 xl:col-span-1">
                <label
                  htmlFor="blog-search"
                  className="mb-2 block text-sm font-medium"
                >
                  Buscar artigos
                </label>
                <div className="flex gap-2">
                  <input
                    id="blog-search"
                    ref={searchRef}
                    name="q"
                    type="search"
                    defaultValue={query}
                    placeholder="Título, assunto ou tecnologia"
                    className="min-h-11 min-w-0 flex-1 rounded-lg border border-dark-600 bg-dark-800 px-3 text-base text-white"
                  />
                  <button type="submit" className="btn btn-primary min-h-11">
                    Buscar
                  </button>
                </div>
              </div>
              <div className="min-w-0 flex-1 basis-40">
                <label
                  htmlFor="blog-tag"
                  className="mb-2 block text-sm font-medium"
                >
                  Assunto
                </label>
                <select
                  id="blog-tag"
                  value={selectedTag}
                  onChange={event => onTagClick(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-dark-600 bg-dark-800 px-3 text-base"
                >
                  <option value="">Todos os assuntos</option>
                  {tags.map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
              <div className="min-w-0 flex-1 basis-40">
                <label
                  htmlFor="blog-date"
                  className="mb-2 block text-sm font-medium"
                >
                  Data de publicação
                </label>
                <input
                  id="blog-date"
                  type="date"
                  value={selectedDate}
                  onChange={event => onDateClick(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-dark-600 bg-dark-800 px-3 text-base [color-scheme:dark]"
                />
              </div>
            </form>
          </search>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
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
            <div className="grid gap-5">
              {displayedPosts.map(post => (
                <article key={post.id} className="card card-hover">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-2xl p-5 md:p-6"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-dark-300">
                      <span>Jadilson Guedes</span>
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('pt-BR', {
                          timeZone: 'UTC',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </time>
                    </div>
                    <h2 className="mb-3 text-xl font-bold leading-snug text-white">
                      {post.title}
                    </h2>
                    <p className="mb-4 text-sm leading-relaxed text-dark-200">
                      {post.description}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.tags?.slice(0, 4).map(tag => (
                        <span
                          key={tag}
                          className="rounded-md bg-dark-800 px-2 py-1 text-xs text-dark-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-dark-800 pt-3 text-sm">
                      <span className="font-medium text-primary-300">
                        Ler artigo →
                      </span>
                      <span className="text-dark-300">
                        {post.readingMinutes || 1} min de leitura
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            {displayCount < filteredPosts.length && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setPagination({ key: filterKey, count: displayCount + 10 })
                  }
                >
                  Carregar mais artigos ({filteredPosts.length - displayCount})
                </button>
              </div>
            )}
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
