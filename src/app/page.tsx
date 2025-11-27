import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Layout from '@/components/Layout';
import type { Metadata } from 'next';

// Lazy load non-critical components for better performance
const Contact = dynamic(() => import('@/components/Contact'), {
  loading: () => <div className="min-h-[400px]" />,
});
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="min-h-[200px]" />,
});

export const metadata: Metadata = {
  title: 'Jadilson Guedes - Engenheiro de Software',
  description: 'Portfólio de Jadilson Guedes, Engenheiro de Software apaixonado por criar experiências digitais com tecnologias modernas',
  keywords: ['desenvolvedor', 'software engineer', 'react', 'typescript', 'nodejs', 'javascript'],
};

export default function Home() {
  return (
    <Layout>
      {/* React 19: Native document metadata support */}
      <title>Jadilson Guedes - Engenheiro de Software</title>
      <meta name="description" content="Portfólio de Jadilson Guedes, Engenheiro de Software apaixonado por criar experiências digitais com tecnologias modernas" />
      <meta property="og:title" content="Jadilson Guedes - Engenheiro de Software" />
      <meta property="og:description" content="Portfólio de Jadilson Guedes, Engenheiro de Software" />

      <Header />
      <Hero />
      <Contact />
      <Footer />
    </Layout>
  );
}
