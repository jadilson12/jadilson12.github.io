import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Layout from '@/components/Layout';
import ContatoPageClient from './ContatoPageClient';
import { pageMetadata, webPageSchema, breadcrumbs } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata({
  title: 'Contato',
  description:
    'Entre em contato com Jadilson Guedes. Vamos conversar sobre desenvolvimento de software, tecnologia e seu próximo projeto!',
  path: '/contato',
});

export default function ContatoPage() {
  return (
    <Layout>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageSchema('/contato', 'Contato', 'ContactPage'),
            breadcrumbs([
              { name: 'Início', path: '/' },
              { name: 'Contato', path: '/contato' },
            ]),
          ],
        }}
      />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-screen pt-20 pb-12"
      >
        <ContatoPageClient />
      </main>
      <Footer />
    </Layout>
  );
}
