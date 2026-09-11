import { profileMarkdown, textResponse } from '@/lib/llms';

export const dynamic = 'force-static';

export function GET() {
  return textResponse(profileMarkdown(), 'text/markdown');
}
