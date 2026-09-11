import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ProfileCard from '@/components/og/ProfileCard';
import { getPostData, getSortedPostsData } from '@/lib/posts';
import { site } from '@/lib/site';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { slug: 'site' },
    { slug: 'profile-card' },
    ...getSortedPostsData().map(post => ({ slug: post.slug })),
  ];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (slug === 'site' || slug === 'profile-card') {
    const photo = await readFile(
      path.join(process.cwd(), 'public', site.portrait)
    );
    return new ImageResponse(
      <ProfileCard
        photo={`data:image/jpeg;base64,${photo.toString('base64')}`}
      />,
      { width: 1200, height: 630 }
    );
  }
  const post = getPostData(slug);

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: '64px 72px',
        background: '#0a0a0a',
        color: '#fafafa',
        borderTop: '12px solid #c9f31d',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 28,
          color: '#c9f31d',
        }}
      >
        <span>{site.name}</span>
        <span>{post ? 'Blog / Tecnologia' : 'Engenharia de Software'}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontSize: post && post.title.length > 65 ? 52 : 64,
            fontWeight: 700,
            lineHeight: 1.12,
          }}
        >
          {post?.title || 'Do planejamento à implantação.'}
        </div>
        <div style={{ fontSize: 28, color: '#a3a3a3' }}>
          {post?.tags?.slice(0, 4).join(' · ') ||
            'On-Premise · Cloud · Inteligência Artificial'}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 24,
          color: '#a3a3a3',
        }}
      >
        <span>jadilson.dev</span>
        <span>{post?.date || 'IA, Cloud & DevOps'}</span>
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
