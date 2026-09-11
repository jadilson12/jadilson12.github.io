import { site } from '@/lib/site';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Layout from '@/components/Layout';
import { pageMetadata, webPageSchema } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

// Lazy load non-critical components for better performance
const About = dynamic(() => import('@/components/About'), {
  loading: () => <div className="min-h-[400px]" />,
});
const ContatoPageClient = dynamic(
  () => import('@/app/contato/ContatoPageClient'),
  {
    loading: () => <div className="min-h-[400px]" />,
  }
);
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="min-h-[200px]" />,
});

export const metadata = pageMetadata({
  title: site.title,
  description: site.description,
  path: '/',
});

export default function Home() {
  return (
    <Layout>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [webPageSchema('/', site.title, 'WebPage')],
        }}
      />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <ContatoPageClient headingLevel="h2" />
      </main>
      <Footer />
    </Layout>
  );
}
