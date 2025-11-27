import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Layout from '@/components/Layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jadilson Guedes - Engenheiro de Software',
  description: 'Portfólio de Jadilson Guedes, Engenheiro de Software apaixonado por criar experiências digitais com tecnologias modernas',
  keywords: ['desenvolvedor', 'software engineer', 'react', 'typescript', 'nodejs', 'javascript'],
};

export default function Home() {
  return (
    <Layout>
      <Header />
      <Hero />
      <Contact />
      <Footer />
    </Layout>
  );
}
