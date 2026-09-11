import About from '@/components/About';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Layout from '@/components/Layout';
import { pageMetadata, webPageSchema, breadcrumbs } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

export const metadata = pageMetadata({
  title: 'Sobre',
  description:
    'Conheça Jadilson Guedes, Engenheiro de Software, e sua experiência com desenvolvimento, arquitetura, cloud e inteligência artificial.',
  path: '/sobre',
});

export default function SobrePage() {
  return (
    <Layout>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            webPageSchema('/sobre', 'Sobre', 'ProfilePage'),
            breadcrumbs([
              { name: 'Início', path: '/' },
              { name: 'Sobre', path: '/sobre' },
            ]),
          ],
        }}
      />
      <Header />
      <main id="main-content" tabIndex={-1}>
        <h1 className="sr-only">Sobre Jadilson Guedes</h1>
        <About />
      </main>
      <Footer />
    </Layout>
  );
}
