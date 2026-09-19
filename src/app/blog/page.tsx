import Header from '@/components/Header';
import Layout from '@/components/Layout';
import { getSortedPostsData } from '@/lib/posts';
import { Suspense } from 'react';
import { pageMetadata, webPageSchema, breadcrumbs } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';
import BlogPageClient from './BlogPageClient';

export const metadata = pageMetadata({
  title: 'Blog',
  description:
    'Artigos sobre desenvolvimento web, programação e tecnologia por Jadilson Guedes.',
  path: '/blog',
});

export default function BlogPage() {
  const posts = getSortedPostsData();

  return (
    <Layout>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageSchema('/blog', 'Blog', 'CollectionPage'),
            breadcrumbs([
              { name: 'Início', path: '/' },
              { name: 'Blog', path: '/blog' },
            ]),
          ],
        }}
      />
      <Header />
      <Suspense fallback={<div className="min-h-screen pt-32 pb-20 flex items-center justify-center"><div className="text-dark-400">Carregando...</div></div>}>
        <BlogPageClient posts={posts} />
      </Suspense>
    </Layout>
  );
}
