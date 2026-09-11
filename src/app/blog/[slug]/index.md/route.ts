import { articleMarkdown, textResponse } from '@/lib/llms';
import { getSortedPostsData } from '@/lib/posts';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return getSortedPostsData().map(post => ({ slug: post.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return textResponse(articleMarkdown(slug), 'text/markdown');
}
