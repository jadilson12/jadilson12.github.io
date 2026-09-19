import type { MetadataRoute } from 'next';
import { assetPath, site } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: 'J.Guedes',
    description: site.description,
    id: assetPath('/'),
    start_url: assetPath('/'),
    scope: assetPath('/'),
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#c9f31d',
    lang: site.language,
    icons: [
      {
        src: assetPath('/icons/icon.svg'),
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      ...[192, 512].map(size => ({
        src: assetPath(`/icons/icon-${size}x${size}.png`),
        sizes: `${size}x${size}`,
        type: 'image/png',
        purpose: 'any' as const,
      })),
    ],
  };
}
