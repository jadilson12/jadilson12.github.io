import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Layout from '@/components/Layout';
import ContatoPageClient from './ContatoPageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contato - Jadilson Guedes',
  description: 'Entre em contato com Jadilson Guedes. Vamos conversar sobre seu próximo projeto!',
};

export default function ContatoPage() {
  return (
    <Layout>
      <Header />
      <main className="min-h-screen pt-20 pb-12">
        <ContatoPageClient />
      </main>
      <Footer />
    </Layout>
  );
}
