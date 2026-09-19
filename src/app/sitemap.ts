import type { MetadataRoute } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { canonicalUrl } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedPostsData();
  const years = [...new Set(posts.map(post => post.date.slice(0, 4)))];

  return [
    ...['/', '/sobre', '/contato', '/blog'].map(path => ({
      url: canonicalUrl(path),
    })),
    ...years.map(year => ({ url: canonicalUrl(`/blog/year/${year}`) })),
    ...posts.map(post => ({
      url: canonicalUrl(`/blog/${post.slug}`),
      lastModified: post.updated || post.date,
    })),
  ];
}
