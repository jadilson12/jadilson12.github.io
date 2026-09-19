/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable code, tables and diagrams need keyboard focus for arrow-key scrolling. */
import CodeBlock from '@/components/CodeBlock';
import DecisionGraph from '@/components/DecisionGraph';
import Header from '@/components/Header';
import Infographic from '@/components/Infographic';
import Layout from '@/components/Layout';
import Mermaid from '@/components/Mermaid';
import SpringBootInfographic from '@/components/SpringBootInfographic';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { pageMetadata, articleSchema, breadcrumbs } from '@/lib/seo';
import { compileMDX } from 'next-mdx-remote/rsc';
import { collectHeadings, type TocItem } from '@/lib/headings';
import BlogPostContent from './BlogPostContent';

import React from 'react';

const components = {
  table: (props: React.ComponentProps<'table'>) => (
    <section
      aria-label="Tabela do artigo"
      tabIndex={0}
      className="my-6 max-w-full overflow-x-auto rounded-lg border border-dark-700"
    >
      <table {...props} />
    </section>
  ),
  pre: ({ children, ...props }: React.ComponentProps<'pre'>) => {
    // Check if this is a code block with language-* className
    // MDX can supply the custom Code component instead of the literal 'code' tag.
    if (React.isValidElement<React.ComponentProps<'code'>>(children)) {
      const codeElement = children;
      const className = codeElement.props?.className || '';
      const codeChildren = codeElement.props?.children || '';

      // Check if it's a mermaid diagram
      if (className?.includes('language-mermaid')) {
        return (
          <Mermaid
            chart={typeof codeChildren === 'string' ? codeChildren : ''}
          />
        );
      }

      // For other code blocks, pass to CodeBlock component
      return <CodeBlock className={className}>{codeChildren}</CodeBlock>;
    }
    return <pre {...props}>{children}</pre>;
  },
  code: (props: React.ComponentProps<'code'>) => <code {...props} />,
  Mermaid,
  Infographic,
  DecisionGraph,
  SpringBootInfographic,
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map(post => ({
    slug: post.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostData(slug);
  return pageMetadata({
    title: post.title,
    description: post.description || post.title,
    path: `/blog/${post.slug}`,
    post,
  });
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostData(slug);
  const headings: TocItem[] = [];
  const { content } = await compileMDX({
    source: post.content || '',
    components,
    options: { mdxOptions: { remarkPlugins: [collectHeadings(headings)] } },
  });

  return (
    <Layout>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            articleSchema(post),
            breadcrumbs([
              { name: 'Início', path: '/' },
              { name: 'Blog', path: '/blog' },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ],
        }}
      />
      <Header />
      <BlogPostContent key={post.slug} post={post} headings={headings}>
        {content}
      </BlogPostContent>
    </Layout>
  );
}
