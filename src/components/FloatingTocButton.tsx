'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const FloatingTocButton: React.FC = () => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Extract all h2 and h3 headings from the article
    const article = document.querySelector('article');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const items: TocItem[] = Array.from(elements).map((element) => {
      // Create ID if it doesn't exist
      if (!element.id) {
        element.id = element.textContent?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || '';
      }

      return {
        id: element.id,
        text: element.textContent || '',
        level: parseInt(element.tagName.substring(1)),
      };
    });

    setHeadings(items);

    // Intersection Observer to track active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -80% 0px',
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when drawer is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Update URL with hash
      window.history.pushState(null, '', `#${id}`);

      // Update active ID and close drawer
      setActiveId(id);
      setIsOpen(false);
    }
  };

  // Don't show button if no headings
  if (headings.length === 0) return null;

  return (
    <>
      {/* Floating Button - Hidden on XL screens where sidebar TOC is visible */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        onClick={() => setIsOpen(true)}
        className="xl:hidden fixed bottom-6 left-4 z-40 w-12 h-12 bg-primary-300 hover:bg-primary-400 text-dark-950 rounded-full shadow-lg shadow-primary-300/30 flex items-center justify-center transition-all duration-200"
        aria-label="Abrir índice do artigo"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </motion.button>

      {/* Drawer Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-dark-950/95 backdrop-blur-md z-50 xl:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 w-full max-w-sm bg-dark-900/95 backdrop-blur-xl border-r border-dark-800/50 z-50 xl:hidden overflow-y-auto shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-dark-800">
                  <h2 className="text-lg font-semibold text-white">
                    Neste Artigo
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-dark-300 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Fechar índice"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Table of Contents */}
                <nav className="flex-1 p-4 overflow-y-auto">
                  <ul className="space-y-1">
                    {headings.map((heading, index) => (
                      <motion.li
                        key={heading.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={heading.level === 3 ? 'ml-4' : ''}
                      >
                        <a
                          href={`#${heading.id}`}
                          onClick={(e) => handleClick(e, heading.id)}
                          className={`
                            block text-sm py-3 px-4 rounded-lg border-l-2 transition-all duration-200 min-h-[52px] flex items-center
                            ${activeId === heading.id
                              ? 'border-primary-300 bg-dark-800/80 text-primary-300 font-medium shadow-lg shadow-primary-300/10'
                              : 'border-transparent bg-dark-800/30 text-dark-300 hover:text-white hover:bg-dark-800/50 hover:border-dark-700'
                            }
                          `}
                        >
                          {heading.text}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingTocButton;
