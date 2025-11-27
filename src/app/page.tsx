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
      <Header />
      <Hero />
      <Contact />
      <Footer />
    </Layout>
  );
}
