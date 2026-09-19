import { llmsCatalog, textResponse } from '@/lib/llms';

export const dynamic = 'force-static';

export function GET() {
  return textResponse(
    JSON.stringify(llmsCatalog(), null, 2) + '\n',
    'application/json'
  );
}
