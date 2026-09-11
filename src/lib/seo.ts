import type { Metadata } from 'next';
import type { PostData } from './posts';
import { canonicalUrl, site, socialImageUrl } from './site';

export function pageMetadata({
  title,
  description,
  path,
  post,
}: {
  title: string;
  description: string;
  path: string;
  post?: PostData;
}): Metadata {
  const fullTitle = title === site.title ? title : `${title} | ${site.name}`;
  const images = [
    {
      url: socialImageUrl(post?.slug),
      width: 1200,
      height: 630,
      alt: post?.title || site.title,
    },
  ];

  return {
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: canonicalUrl(path),
      ...(post && {
        types: {
          'text/markdown': new URL(`/blog/${post.slug}/index.md`, site.url)
            .href,
        },
      }),
    },
    keywords: post?.tags,
    openGraph: {
      type: post ? 'article' : 'website',
      url: canonicalUrl(path),
      title: fullTitle,
      description,
      siteName: site.name,
      locale: post?.language === 'en' ? 'en_US' : 'pt_BR',
      images,
      ...(post && {
        publishedTime: post.date,
        modifiedTime: post.updated || post.date,
        authors: [canonicalUrl('/sobre')],
        tags: post.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@jadilson',
      title: fullTitle,
      description,
      images,
    },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function webPageSchema(path: string, name: string, type = 'WebPage') {
  return {
    '@type': type,
    '@id': `${canonicalUrl(path)}#webpage`,
    url: canonicalUrl(path),
    name,
    inLanguage: site.language,
    isPartOf: { '@id': `${canonicalUrl()}#website` },
    about: { '@id': `${canonicalUrl()}#person` },
    ...(type === 'ProfilePage' && {
      mainEntity: { '@id': `${canonicalUrl()}#person` },
    }),
  };
}

export function articleSchema(post: PostData) {
  const url = canonicalUrl(`/blog/${post.slug}`);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.description,
    image: [socialImageUrl(post.slug)],
    datePublished: post.date,
    dateModified: post.updated || post.date,
    inLanguage: post.language || site.language,
    keywords: post.tags?.join(', '),
    author: { '@id': `${canonicalUrl()}#person` },
    publisher: { '@id': `${canonicalUrl()}#person` },
    isPartOf: { '@id': `${canonicalUrl()}#website` },
  };
}
