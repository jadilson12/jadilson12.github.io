'use client';

import { useEffect, useState } from 'react';
import type { TocItem } from '@/lib/headings';
import Modal from './Modal';

export default function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries)
          if (entry.isIntersecting) setActiveId(entry.target.id);
      },
      { rootMargin: '-96px 0px -65% 0px' }
    );
    for (const heading of headings) {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;
  function items() {
    return (
      <ul className="space-y-1">
        {headings.map(heading => (
          <li key={heading.id} className={heading.level === 3 ? 'ml-3' : ''}>
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? 'location' : undefined}
              onClick={event => {
                if (
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                setOpen(false);
                setActiveId(heading.id);
                // Wait for the modal to release the scroll lock before navigating.
                requestAnimationFrame(() => {
                  window.history.pushState(null, '', `#${heading.id}`);
                  const element = document.getElementById(heading.id);
                  element?.focus({ preventScroll: true });
                  element?.scrollIntoView({
                    behavior: window.matchMedia(
                      '(prefers-reduced-motion: reduce)'
                    ).matches
                      ? 'instant'
                      : 'smooth',
                  });
                });
              }}
              className={`block rounded-md border-l-2 px-3 py-2 text-sm ${activeId === heading.id ? 'border-primary-300 bg-dark-800 text-primary-300' : 'border-dark-700 text-dark-200 hover:bg-dark-800'}`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <nav
        aria-label="Índice do artigo"
        className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] w-64 shrink-0 overflow-y-auto rounded-xl border border-dark-700 bg-dark-900 p-4 xl:block"
      >
        <p className="mb-3 font-semibold">Neste artigo</p>
        {items()}
      </nav>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed bottom-5 left-4 z-30 rounded-full bg-primary-300 px-4 py-3 text-sm font-semibold text-dark-950 shadow-lg xl:hidden"
      >
        Índice do artigo
      </button>
      {open && (
        <Modal
          title="Índice do artigo"
          side="left"
          closeAt={1280}
          onClose={() => setOpen(false)}
        >
          <nav aria-label="Seções do artigo">{items()}</nav>
        </Modal>
      )}
    </>
  );
}
