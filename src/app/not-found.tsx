import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Layout>
      <Header />
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-6xl font-display font-bold text-primary-300 mb-4">404</h1>
          <h2 className="text-2xl text-white mb-6">Página não encontrada</h2>
          <p className="text-dark-300 mb-8">
            Desculpe, a página que você está procurando não existe.
          </p>
          <Link href="/" className="btn btn-primary inline-block">
            Voltar para o Início
          </Link>
        </div>
      </div>
      <Footer />
    </Layout>
  );
}
