'use client';

import CopyButton from './CopyButton';

export default function ShareButtons({
  title,
  url,
}: {
  title: string;
  url: string;
  description?: string;
}) {
  const links = [
    {
      name: 'X / Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`,
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
  ];
  return (
    <section
      aria-label="Compartilhar artigo"
      className="mt-10 border-t border-dark-700 pt-6"
    >
      <h2 className="mb-3 text-lg font-semibold">Compartilhe este artigo</h2>
      <div className="flex flex-wrap items-start gap-2">
        {links.map(link => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Compartilhar no ${link.name} (abre em nova aba)`}
            className="flex min-h-11 items-center rounded-lg border border-dark-600 bg-dark-800 px-3 text-sm text-white hover:bg-dark-700"
          >
            {link.name}
          </a>
        ))}
        <CopyButton text={url} label="Copiar link" />
      </div>
    </section>
  );
}
