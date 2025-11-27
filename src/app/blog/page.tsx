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
      <Header />
      <BlogPageClient posts={posts} />
    </Layout>
  );
}
