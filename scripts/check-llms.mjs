import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { getSortedPostsData } from '../src/lib/posts.ts';
import { site, canonicalUrl } from '../src/lib/site.ts';

const output = path.resolve(process.argv[2] || 'out');
const read = relative => fs.readFileSync(path.join(output, relative), 'utf8');
const readUrl = url => {
  const parsed = new URL(url);
  assert.equal(parsed.origin, site.url);
  return read(parsed.pathname.slice(1));
};
const links = html =>
  [...html.matchAll(/<link\b[^>]*>/g)].map(match =>
    Object.fromEntries(
      [...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(attr => [
        attr[1],
        attr[2],
      ])
    )
  );

const index = read('llms.txt');
const full = read('llms-full.txt');
const catalog = JSON.parse(read('llms.json'));
const posts = getSortedPostsData();
assert.equal(
  index,
  read('llm.txt'),
  'O alias llm.txt deve corresponder ao índice'
);
assert(index.startsWith(`# ${site.name}\n\n> `));
assert.equal(catalog.schema_version, 1);
assert.equal(catalog.article_count, posts.length);
assert.equal(catalog.articles.length, posts.length);
assert.equal(
  new Set(catalog.articles.map(post => post.slug)).size,
  posts.length
);
assert(full.includes(readUrl(catalog.profile_url)));
assert.equal(readUrl(catalog.index_url), index);
assert.equal(readUrl(catalog.full_content_url), full);
for (const match of index.matchAll(/\]\((https:\/\/[^)]+)\)/g))
  assert(readUrl(match[1]).length > 0);

for (const post of posts) {
  const item = catalog.articles.find(item => item.slug === post.slug);
  assert(item, `Artigo ausente do catálogo: ${post.slug}`);
  assert.equal(item.title, post.title);
  assert.equal(item.published_at, post.date);
  assert.equal(item.modified_at, post.updated || post.date);
  assert.deepEqual(item.tags, post.tags || []);
  assert.equal(item.language, post.language || site.language);
  assert.equal(item.canonical_url, canonicalUrl(`/blog/${post.slug}`));
  const markdown = readUrl(item.markdown_url);
  assert(markdown.startsWith(`# ${post.title}\n`), post.slug);
  assert(markdown.includes(`Fonte canônica: ${item.canonical_url}`));
  assert(
    full.includes(markdown),
    `Artigo incompleto em llms-full.txt: ${post.slug}`
  );
  assert(index.includes(`](${item.markdown_url})`));
  assert.equal(
    createHash('sha256').update(markdown).digest('hex'),
    item.content_sha256
  );
  const htmlLinks = links(read(`blog/${post.slug}/index.html`));
  assert(
    htmlLinks.some(
      link =>
        link.rel === 'alternate' &&
        link.type === 'text/markdown' &&
        link.href === item.markdown_url
    ),
    `Descoberta Markdown ausente: ${post.slug}`
  );
  assert(
    htmlLinks.some(
      link => link.rel === 'describedby' && link.href.endsWith('/llms.txt')
    ),
    `Descoberta LLM ausente: ${post.slug}`
  );
}
assert(
  links(read('index.html')).some(
    link => link.rel === 'describedby' && link.href.endsWith('/llms.txt')
  )
);
console.log(
  `LLM verificado: ${posts.length} artigos em Markdown, índice e alias, conteúdo completo, catálogo, hashes SHA-256, fontes canônicas e descoberta no HTML.`
);
