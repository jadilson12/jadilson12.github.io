export const site = {
  url: 'https://jadilson.dev',
  name: 'Jadilson Guedes',
  title: 'Jadilson Guedes - Engenheiro de Software | IA, Cloud & DevOps',
  description:
    'Engenheiro de Software com 8+ anos desenvolvendo soluções completas do planejamento à implantação. Especialista em on-premise, cloud e integração com IA.',
  language: 'pt-BR',
  socialProfiles: [
    'https://github.com/jadilson12',
    'https://www.linkedin.com/in/jadilson12/',
    'https://x.com/jadilson',
  ],
};

// Canonicals always identify the primary domain, including mirror deployments.
export function canonicalUrl(path = '/') {
  return new URL(`${path.replace(/\/$/, '')}/`, site.url).href;
}

// Public assets must also work in the GitHub Pages deployment under a basePath.
export function assetPath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH || ''}${path}`;
}

export function socialImageUrl(slug = 'site') {
  return new URL(`/og/${slug}/image.png`, site.url).href;
}
