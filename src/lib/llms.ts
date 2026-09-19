import { createHash } from 'node:crypto';
import { getPostData, getSortedPostsData } from './posts';
import { canonicalUrl, site } from './site';
import { mdxToMarkdown } from './markdown';
import { decisionData, springBootData } from './infographics';

const absolute = (path: string) => new URL(path, site.url).href;
const diagrams = {
  DecisionGraph: decisionData,
  SpringBootInfographic: springBootData,
};
const line = (value: string) => value.replace(/\s+/g, ' ').trim();
const linkText = (value: string) => line(value).replace(/[\\[\]]/g, '\\$&');

export function markdownUrl(slug: string) {
  return absolute(`/blog/${slug}/index.md`);
}

export function articleMarkdown(slug: string) {
  const post = getPostData(slug);
  const canonical = canonicalUrl(`/blog/${post.slug}`);
  return (
    [
      `# ${post.title}`,
      `> ${line(post.description || post.title)}`,
      `- Autor: ${site.name}\n- Publicado em: ${post.date}\n- Atualizado em: ${post.updated || post.date}\n- Idioma: ${post.language || site.language}\n- Fonte canônica: ${canonical}\n- Versão Markdown: ${markdownUrl(post.slug)}${post.tags?.length ? `\n- Assuntos: ${post.tags.join(', ')}` : ''}`,
      mdxToMarkdown(post.content || '', canonical, diagrams),
    ]
      .join('\n\n')
      .trim() + '\n'
  );
}

export function profileMarkdown() {
  return `# ${site.name}\n\n> ${site.description}\n\nResumo do perfil publicado em ${canonicalUrl('/sobre')}.\n\n- Site: ${canonicalUrl()}\n- Perfil completo: ${canonicalUrl('/sobre')}\n\n## Perfis públicos\n\n${site.socialProfiles.map(url => `- ${url}`).join('\n')}\n`;
}

export function llmsIndex() {
  const posts = getSortedPostsData();
  return (
    [
      `# ${site.name}`,
      `> ${site.description}`,
      'Portfólio pessoal e blog de engenharia de software. Os artigos são conteúdo autoral e refletem a data de publicação indicada; os links de referência apontam para fontes externas. O idioma principal é pt-BR, com alguns artigos em inglês.',
      'As versões Markdown preservam o texto, os exemplos de código, as tabelas e os diagramas em formato textual. Cada documento informa autor, datas e URL canônica para atribuição da fonte. Novos artigos e alterações entram nestes arquivos a cada build do site.',
      `## Autor\n\n- [Sobre ${site.name} (resumo)](${absolute('/sobre/index.md')}): Perfil, site e canais públicos de contato.`,
      `## Artigos\n\n${posts.map(post => `- [${linkText(post.title)}](${markdownUrl(post.slug)}): ${post.date.slice(0, 10)}; ${post.language || site.language}. ${line(post.description || '')}`).join('\n')}`,
      `## Optional\n\n- [Conteúdo completo dos artigos](${absolute('/llms-full.txt')}): Todos os artigos em uma única leitura, além do resumo do autor.\n- [Catálogo JSON](${absolute('/llms.json')}): Metadados, links Markdown e hashes SHA-256 para sincronização incremental.\n- [Sitemap](${absolute('/sitemap.xml')}): Páginas públicas do site.`,
    ].join('\n\n') + '\n'
  );
}

export function llmsFull() {
  return [
    profileMarkdown(),
    ...getSortedPostsData().map(post => articleMarkdown(post.slug)),
  ].join('\n---\n\n');
}

export function llmsCatalog() {
  const posts = getSortedPostsData();
  return {
    schema_version: 1,
    site: {
      name: site.name,
      url: canonicalUrl(),
      description: site.description,
      language: site.language,
      author: {
        name: site.name,
        url: canonicalUrl('/sobre'),
        same_as: site.socialProfiles,
      },
    },
    index_url: absolute('/llms.txt'),
    full_content_url: absolute('/llms-full.txt'),
    profile_url: absolute('/sobre/index.md'),
    article_count: posts.length,
    articles: posts.map(post => ({
      slug: post.slug,
      title: post.title,
      description: post.description || '',
      author: site.name,
      language: post.language || site.language,
      published_at: post.date,
      modified_at: post.updated || post.date,
      tags: post.tags || [],
      canonical_url: canonicalUrl(`/blog/${post.slug}`),
      markdown_url: markdownUrl(post.slug),
      content_sha256: createHash('sha256')
        .update(articleMarkdown(post.slug))
        .digest('hex'),
    })),
  };
}

export function textResponse(content: string, type = 'text/plain') {
  return new Response(content, {
    headers: {
      'Content-Type': `${type}; charset=utf-8`,
      Link: `<${absolute('/llms.txt')}>; rel="describedby"`,
    },
  });
}
