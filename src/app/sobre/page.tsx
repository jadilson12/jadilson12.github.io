import About from '@/components/About';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Layout from '@/components/Layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre - Jadilson Guedes',
  description: 'Conheça mais sobre Jadilson Guedes e sua experiência como Engenheiro de Software',
};

export default function SobrePage() {
  return (
    <Layout>
      <Header />
      <div className="pt-20">
        <About />
      </div>
      <Footer />
    </Layout>
  );
}
