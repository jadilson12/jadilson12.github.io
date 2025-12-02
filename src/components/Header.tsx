'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useScrollSpy } from '@/hooks/useScrollSpy';

interface NavItem {
  name: string;
  href: string;
  external?: boolean;
  sectionId?: string; // ID da seção para scroll spy (apenas para página inicial)
}

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useScrollSpy(['home', 'sobre', 'contato'], 150);

  // Detectar se está em uma página de post individual
  const isPostPage = pathname.startsWith('/blog/') && pathname !== '/blog' && !pathname.startsWith('/blog/year/');

  useEffect(() => {
    const handleScroll = () => {
      // Usar window.scrollY diretamente
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navItems: NavItem[] = [
    { name: 'Início', href: '/', sectionId: 'home' },
    { name: 'Sobre', href: '/sobre', sectionId: 'sobre' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contato', href: '/contato', sectionId: 'contato' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (item: NavItem) => {
    // Se estiver na home e o item tem sectionId, verifica pelo scroll spy
    if (pathname === '/' && item.sectionId) {
      return activeSection === item.sectionId;
    }

    // Caso contrário, verifica pela URL
    if (item.href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(item.href);
  };

  const handleNavClick = (e: React.MouseEvent, item: NavItem) => {
    // Se estiver na home e o item tem sectionId, faz scroll suave
    if (pathname === '/' && item.sectionId) {
      e.preventDefault();
      const element = document.getElementById(item.sectionId);

      if (element) {
        const headerOffset = 0; // Com scroll-snap não precisamos de offset
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        closeMobileMenu();
      }
    } else {
      closeMobileMenu();
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-dark-900/95 backdrop-blur-xl shadow-dark-950/50 border-b border-dark-900/95'
          : 'bg-transparent'
          }`}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Back Button (only on mobile and post pages) */}
            {isPostPage && (
              <Link
                href="/blog"
                className="md:hidden mr-3 p-2 text-dark-300 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Voltar para o blog"
              >
                <motion.svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </motion.svg>
              </Link>
            )}

            {/* Logo */}
            <Link href="/" className="text-xl md:text-2xl font-display font-bold" onClick={closeMobileMenu}>
              <motion.span
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white">jadilson</span>
                <span className="text-primary-300">.dev</span>
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const active = isActive(item);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`px-4 py-2 transition-colors duration-200 rounded-lg ${
                      active
                        ? 'text-primary-300 bg-dark-800 font-medium'
                        : 'text-dark-300 hover:text-white hover:bg-dark-800'
                    }`}
                    {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                  >
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ y: -2 }}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-dark-300 hover:text-white relative z-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              <svg
                className="w-6 h-6 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-dark-950/95 backdrop-blur-md z-40 md:hidden"
              onClick={closeMobileMenu}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xs sm:max-w-sm bg-dark-900/95 backdrop-blur-xl border-l border-dark-800/50 z-40 md:hidden overflow-y-auto shadow-2xl"
            >
              <div className="flex flex-col h-full pt-20 px-4 sm:px-6 pb-6">
                {/* Navigation Links */}
                <nav className="flex-1 space-y-2">
                  {navItems.map((item, index) => {
                    const active = isActive(item);
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05, duration: 0.2 }}
                      >
                        <Link
                          href={item.href}
                          onClick={(e) => handleNavClick(e, item)}
                          className={`flex items-center px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 min-h-[52px] ${
                            active
                              ? 'text-primary-300 bg-dark-800/80 border border-primary-300/20 shadow-lg shadow-primary-300/10'
                              : 'text-dark-300 hover:text-white hover:bg-dark-800/50 border border-transparent'
                          }`}
                          {...(item.external && { target: "_blank", rel: "noopener noreferrer" })}
                        >
                          <span className="flex-1">{item.name}</span>
                          {active && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-primary-300 rounded-full"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Footer info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-auto pt-6 border-t border-dark-800/50"
                >
                  <p className="text-xs text-dark-400 text-center">
                    © 2024 Jadilson Guedes
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
