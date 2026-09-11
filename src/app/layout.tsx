import type { Metadata, Viewport } from 'next';
import JsonLd from '@/components/JsonLd';
import { assetPath, canonicalUrl, site } from '@/lib/site';
import PageTransition from '@/components/PageTransition';
import ClientLayout from '@/components/ClientLayout';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: canonicalUrl('/sobre') }],
  creator: site.name,
  publisher: site.name,
  applicationName: site.name,
  manifest: assetPath('/manifest.webmanifest'),
  icons: {
    icon: [
      { url: assetPath('/icons/icon.svg'), type: 'image/svg+xml' },
      {
        url: assetPath('/icons/icon-48x48.png'),
        sizes: '48x48',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: assetPath('/icons/apple-touch-icon.png'),
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'J.Guedes' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#c9f31d',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-950 text-dark-50`}
      >
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Person',
                '@id': `${canonicalUrl()}#person`,
                name: site.name,
                url: canonicalUrl('/sobre'),
                image: 'https://github.com/jadilson12.png',
                jobTitle: 'Engenheiro de Software',
                sameAs: site.socialProfiles,
              },
              {
                '@type': 'WebSite',
                '@id': `${canonicalUrl()}#website`,
                url: canonicalUrl(),
                name: site.name,
                description: site.description,
                inLanguage: site.language,
                publisher: { '@id': `${canonicalUrl()}#person` },
              },
            ],
          }}
        />
        <a
          href="#main-content"
          className="fixed left-4 top-2 z-50 -translate-y-24 rounded-lg bg-primary-300 px-4 py-3 text-dark-950 focus:translate-y-0"
        >
          Pular para o conteúdo
        </a>
        <ClientLayout>
          <PageTransition>{children}</PageTransition>
        </ClientLayout>
      </body>
    </html>
  );
}
