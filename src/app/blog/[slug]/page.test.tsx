import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PostData } from '@/lib/posts';

afterEach(cleanup);

function makePost(overrides: Partial<PostData> = {}): PostData {
  return {
    id: 'my-post',
    slug: 'my-post',
    title: 'My Post',
    date: '2024-06-15',
    description: 'A sample description',
    tags: ['react', 'nextjs'],
    content: 'Some **markdown** body',
    ...overrides,
  };
}

vi.mock('@/lib/posts', () => ({
  getSortedPostsData: vi.fn(() => []),
  getPostData: vi.fn(() => ({ id: 'x', slug: 'x', title: 'X', date: '2024-01-01' })),
}));

vi.mock('@/components/Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('@/components/Layout', () => ({
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));
vi.mock('./BlogPostContent', () => ({
  default: (props: any) => (
    <div data-testid="blog-post-content" data-title={props.post?.title}>
      {props.children}
    </div>
  ),
}));
let capturedComponents: any;
vi.mock('next-mdx-remote/rsc', () => ({
  MDXRemote: (props: any) => {
    capturedComponents = props.components;
    return <div data-testid="mdx-remote">{props.source}</div>;
  },
}));
vi.mock('@/components/CodeBlock', () => ({ default: (props: any) => <div {...props} /> }));
vi.mock('@/components/DecisionGraph', () => ({ default: (props: any) => <div {...props} /> }));
vi.mock('@/components/Mermaid', () => ({ default: (props: any) => <div {...props} /> }));
vi.mock('@/components/Infographic', () => ({ default: (props: any) => <div {...props} /> }));

import { getPostData, getSortedPostsData } from '@/lib/posts';
import CodeBlock from '@/components/CodeBlock';
import Mermaid from '@/components/Mermaid';
import BlogPost, { generateMetadata, generateStaticParams } from './page';

describe('generateStaticParams', () => {
  it('maps posts to slug params', async () => {
    vi.mocked(getSortedPostsData).mockReturnValue([
      makePost({ id: 'post-a', slug: 'post-a' }),
      makePost({ id: 'post-b', slug: 'post-b' }),
    ]);

    const result = await generateStaticParams();
    expect(result).toEqual([{ slug: 'post-a' }, { slug: 'post-b' }]);
  });
});

describe('generateMetadata', () => {
  it('returns title and description from post data', async () => {
    vi.mocked(getPostData).mockReturnValue(makePost({ title: 'Meta Title', description: 'Meta Desc' }));

    const result = await generateMetadata({ params: Promise.resolve({ slug: 'my-post' }) });
    expect(result).toEqual({
      title: 'Meta Title | Jadilson Guedes',
      description: 'Meta Desc',
    });
  });
});

describe('BlogPost', () => {
  it('renders metadata tags including article:tag for each tag when tags are present', async () => {
    vi.mocked(getPostData).mockReturnValue(makePost({
      title: 'Tagged Post',
      description: 'Tagged description',
      date: '2024-06-15',
      tags: ['react', 'nextjs'],
      content: 'md content',
    }));

    const jsx = await BlogPost({ params: Promise.resolve({ slug: 'my-post' }) });
    const { container } = render(jsx);

    // Note: React 19's native <title> hoisting only reliably sets textContent
    // for a single text child; this title has two children (expression + literal),
    // so jsdom renders an empty <title> element. We only assert it exists.
    const title = document.querySelector('title');
    expect(title).toBeInTheDocument();

    const description = document.querySelector('meta[name="description"]');
    expect(description).toHaveAttribute('content', 'Tagged description');

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle).toHaveAttribute('content', 'Tagged Post');

    const ogDescription = document.querySelector('meta[property="og:description"]');
    expect(ogDescription).toHaveAttribute('content', 'Tagged description');

    const ogType = document.querySelector('meta[property="og:type"]');
    expect(ogType).toHaveAttribute('content', 'article');

    const publishedTime = document.querySelector('meta[property="article:published_time"]');
    expect(publishedTime).toHaveAttribute('content', new Date('2024-06-15').toISOString());

    const tagMetas = document.querySelectorAll('meta[property="article:tag"]');
    expect(tagMetas).toHaveLength(2);
    expect(tagMetas[0]).toHaveAttribute('content', 'react');
    expect(tagMetas[1]).toHaveAttribute('content', 'nextjs');

    expect(container.querySelector('[data-testid="header"]')).toBeInTheDocument();
    const content = container.querySelector('[data-testid="blog-post-content"]');
    expect(content).toHaveAttribute('data-title', 'Tagged Post');
    expect(container.querySelector('[data-testid="mdx-remote"]')).toHaveTextContent('md content');
  });

  it('does not render any article:tag meta when tags are absent', async () => {
    vi.mocked(getPostData).mockReturnValue(makePost({
      title: 'No Tags Post',
      description: 'No tags description',
      date: '2024-01-01',
      tags: undefined,
      content: 'other content',
    }));

    const jsx = await BlogPost({ params: Promise.resolve({ slug: 'no-tags-post' }) });
    render(jsx);

    const tagMetas = document.querySelectorAll('meta[property="article:tag"]');
    expect(tagMetas).toHaveLength(0);
  });

  it('defaults MDXRemote source to an empty string when post.content is falsy', async () => {
    vi.mocked(getPostData).mockReturnValue(makePost({ content: undefined }));

    const jsx = await BlogPost({ params: Promise.resolve({ slug: 'no-content-post' }) });
    const { container } = render(jsx);

    expect(container.querySelector('[data-testid="mdx-remote"]')).toHaveTextContent('');
  });
});

describe('MDX components map (pre/code renderers)', () => {
  it('captures the components map passed to MDXRemote', async () => {
    vi.mocked(getPostData).mockReturnValue(makePost());
    await BlogPost({ params: Promise.resolve({ slug: 'my-post' }) });
    expect(capturedComponents).toBeDefined();
    expect(typeof capturedComponents.pre).toBe('function');
    expect(typeof capturedComponents.code).toBe('function');
  });

  it('code renderer passes props through to a native <code> element', () => {
    const result = capturedComponents.code({ className: 'foo', children: 'bar' });
    expect(result.type).toBe('code');
    expect(result.props.className).toBe('foo');
    expect(result.props.children).toBe('bar');
  });

  it('pre renderer renders a Mermaid diagram for language-mermaid code blocks with string content', () => {
    const codeElement = React.createElement('code', { className: 'language-mermaid' }, 'graph TD');
    const result = capturedComponents.pre({ children: codeElement });
    expect(result.type).toBe(Mermaid);
    expect(result.props.chart).toBe('graph TD');
  });

  it('pre renderer renders an empty chart when mermaid code children is not a string', () => {
    const codeElement = React.createElement('code', { className: 'language-mermaid' }, ['a', 'b']);
    const result = capturedComponents.pre({ children: codeElement });
    expect(result.type).toBe(Mermaid);
    expect(result.props.chart).toBe('');
  });

  it('pre renderer renders CodeBlock for non-mermaid code blocks, defaulting missing className/children', () => {
    const codeElementNoClassName = React.createElement('code', {}, 'const x = 1;');
    const resultNoClassName = capturedComponents.pre({ children: codeElementNoClassName });
    expect(resultNoClassName.type).toBe(CodeBlock);
    expect(resultNoClassName.props.className).toBe('');
    expect(resultNoClassName.props.children).toBe('const x = 1;');

    const codeElementNoChildren = React.createElement('code', { className: 'language-js' });
    const resultNoChildren = capturedComponents.pre({ children: codeElementNoChildren });
    expect(resultNoChildren.type).toBe(CodeBlock);
    expect(resultNoChildren.props.className).toBe('language-js');
    expect(resultNoChildren.props.children).toBe('');
  });

  it('pre renderer falls back to a native <pre> when children is not a valid element', () => {
    const result = capturedComponents.pre({ children: 'just text' });
    expect(result.type).toBe('pre');
    expect(result.props.children).toBe('just text');
  });

  it('pre renderer falls back to a native <pre> when children is a valid element but not of type code', () => {
    const spanElement = React.createElement('span', {}, 'hi');
    const result = capturedComponents.pre({ children: spanElement, someProp: 'val' });
    expect(result.type).toBe('pre');
    expect(result.props.someProp).toBe('val');
    expect(result.props.children).toBe(spanElement);
  });
});
