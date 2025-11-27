import CodeBlock from '@/components/CodeBlock';
import DecisionGraph from '@/components/DecisionGraph';
import Header from '@/components/Header';
import Infographic from '@/components/Infographic';
import Layout from '@/components/Layout';
import Mermaid from '@/components/Mermaid';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import BlogPostContent from './BlogPostContent';

import React from 'react';

const components = {
  pre: ({ children, ...props }: any) => {
    // Check if this is a code block with language-* className
    if (React.isValidElement(children) && (children as React.ReactElement<any>).type === 'code') {
      const codeElement = children as React.ReactElement<any>;
      const className = codeElement.props?.className || '';
      const codeChildren = codeElement.props?.children || '';

      // Check if it's a mermaid diagram
      if (className?.includes('language-mermaid')) {
        console.log('🎨 Detected Mermaid code block, rendering diagram');
        return <Mermaid chart={typeof codeChildren === 'string' ? codeChildren : ''} />;
      }

      // For other code blocks, pass to CodeBlock component
      return <CodeBlock className={className}>{codeChildren}</CodeBlock>;
    }
    return <pre {...props}>{children}</pre>;
  },
  code: (props: any) => <code {...props} />,
  Mermaid,
  Infographic,
  DecisionGraph,
};

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostData(slug);
  return {
    title: `${post.title} | Jadilson Guedes`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);

  return (
    <Layout>
      <Header />
      <BlogPostContent post={post}>
        <MDXRemote source={post.content || ''} components={components} />
      </BlogPostContent>
    </Layout>
  );
}
