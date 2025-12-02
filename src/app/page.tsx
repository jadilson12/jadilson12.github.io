import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Layout from '@/components/Layout';
import type { Metadata } from 'next';

// Lazy load non-critical components for better performance
const About = dynamic(() => import('@/components/About'), {
  loading: () => <div className="min-h-[400px]" />,
});
const ContatoPageClient = dynamic(() => import('@/app/contato/ContatoPageClient'), {
  loading: () => <div className="min-h-[400px]" />,
});
const Footer = dynamic(() => import('@/components/Footer'), {
  loading: () => <div className="min-h-[200px]" />,
});

export const metadata: Metadata = {
  title: 'Jadilson Guedes - Engenheiro de Software | IA, Cloud & DevOps',
  description: 'Engenheiro de Software com 8+ anos desenvolvendo soluções completas do planejamento à implantação. Especialista em on-premise, cloud e integração com IA.',
  keywords: ['engenheiro de software', 'desenvolvedor', 'inteligência artificial', 'kubernetes', 'devops', 'azure', 'nodejs', 'java', 'python'],
};

export default function Home() {
  return (
    <Layout>
      {/* React 19: Native document metadata support */}
      <title>Jadilson Guedes - Engenheiro de Software | IA, Cloud & DevOps</title>
      <meta name="description" content="Engenheiro de Software com 8+ anos desenvolvendo soluções completas do planejamento à implantação. Especialista em on-premise, cloud e integração com IA." />
      <meta property="og:title" content="Jadilson Guedes - Engenheiro de Software" />
      <meta property="og:description" content="Do planejamento à implantação | On-Premise, Cloud e IA" />

      <Header />
      <Hero />
      <About />
      <ContatoPageClient />
      <Footer />
    </Layout>
  );
}
