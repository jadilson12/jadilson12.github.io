'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import Modal from './Modal';

const sections = ['home', 'sobre', 'contato'];
const navItems = [
  { name: 'Início', href: '/', sectionId: 'home' },
  { name: 'Sobre', href: '/sobre', sectionId: 'sobre' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contato', href: '/contato', sectionId: 'contato' },
];

export default function Header() {
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const pathname = usePathname().replace(/\/$/, '') || '/';
  const activeSection = useScrollSpy(sections, 100);
  const menuOpen = menuPath === pathname;
  const isPostPage = /^\/blog\/[^/]+$/.test(pathname);

  useEffect(() => {
    const close = () => setMenuPath(null);
    window.addEventListener('popstate', close);
    return () => window.removeEventListener('popstate', close);
  }, []);

  function links(mobile = false) {
    return navItems.map(item => {
      const active =
        pathname === '/' && item.sectionId
          ? activeSection === item.sectionId
          : item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);
      return (
        <Link
          key={item.name}
          href={
            pathname === '/' && item.sectionId
              ? `/#${item.sectionId}`
              : item.href
          }
          aria-current={
            active ? (pathname === '/' ? 'location' : 'page') : undefined
          }
          onClick={() => setMenuPath(null)}
          className={`flex min-h-11 items-center rounded-lg px-4 py-3 transition-colors ${mobile ? 'w-full' : ''} ${active ? 'bg-dark-800 text-primary-300 font-medium' : 'text-dark-200 hover:bg-dark-800 hover:text-white'}`}
        >
          {item.name}
        </Link>
      );
    });
  }

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-40 border-b border-dark-800 bg-dark-900/95 backdrop-blur-xl">
        <nav
          aria-label="Navegação principal"
          className="container-custom flex h-16 items-center justify-between gap-3 md:h-20"
        >
          {isPostPage && (
            <Link
              href="/blog"
              className="md:hidden flex min-h-11 min-w-11 items-center justify-center rounded-lg text-2xl hover:bg-dark-800"
              aria-label="Voltar para o blog"
            >
              ←
            </Link>
          )}
          <Link
            href="/"
            className="mr-auto flex min-h-11 items-center text-xl font-bold md:text-2xl"
            onClick={() => setMenuPath(null)}
          >
            <span>jadilson</span>
            <span className="text-primary-300">.dev</span>
          </Link>
          <div className="hidden items-center gap-1 md:flex">{links()}</div>
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            onClick={() => setMenuPath(pathname)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-dark-100 hover:bg-dark-800 md:hidden"
          >
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>
      {menuOpen && (
        <Modal
          title="Menu"
          side="right"
          closeAt={768}
          onClose={() => setMenuPath(null)}
        >
          <nav aria-label="Navegação móvel" className="space-y-2">
            {links(true)}
          </nav>
        </Modal>
      )}
    </>
  );
}
