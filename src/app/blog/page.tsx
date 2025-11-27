import Header from '@/components/Header';
import Layout from '@/components/Layout';
import { getSortedPostsData } from '@/lib/posts';
import type { Metadata } from 'next';
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
      <BlogPageClient posts={posts} />
    </Layout>
  );
}
