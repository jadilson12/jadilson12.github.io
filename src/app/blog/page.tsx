import Header from '@/components/Header';
import Layout from '@/components/Layout';
import { getSortedPostsData } from '@/lib/posts';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: 'Blog | Jadilson Guedes',
  description: 'Artigos sobre desenvolvimento web, programação e tecnologia por Jadilson Guedes',
};

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <Layout>
      {/* React 19: Native document metadata support */}
      <title>Blog | Jadilson Guedes</title>
      <meta name="description" content="Artigos sobre desenvolvimento web, programação e tecnologia por Jadilson Guedes" />
      <meta property="og:title" content="Blog | Jadilson Guedes" />
      <meta property="og:description" content="Artigos sobre desenvolvimento web, programação e tecnologia" />

      <Header />
      <Suspense fallback={<div className="min-h-screen pt-32 pb-20 flex items-center justify-center"><div className="text-dark-400">Carregando...</div></div>}>
        <BlogPageClient posts={posts} />
      </Suspense>
    </Layout>
  );
}
