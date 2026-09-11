import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'out');
const origin = 'https://jadilson.dev';
const read = relative => fs.readFileSync(path.join(output, relative), 'utf8');
const attributes = tag =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(match => [match[1], match[2]])
  );
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map(match =>
    attributes(match[0])
  );
const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert(urls.length >= 4, 'Sitemap must contain the public pages');
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs');
const imageUrls = new Set();
const postUrls = urls.filter(url => /\/blog\/\d{4}-/.test(url));

for (const url of urls) {
  assert(
    url.startsWith(`${origin}/`) && url.endsWith('/'),
    `Invalid canonical: ${url}`
  );
  const pathname = new URL(url).pathname;
  const html = read(`${pathname.slice(1)}index.html`);
  const meta = tags(html, 'meta');
  const links = tags(html, 'link');
  assert.equal(
    [...html.matchAll(/<title>/g)].length,
    1,
    `${url}: duplicate title`
  );
  assert.equal(
    meta.filter(item => item.name === 'description').length,
    1,
    `${url}: duplicate description`
  );
  const canonical = links.filter(item => item.rel === 'canonical');
  assert.equal(canonical.length, 1, `${url}: canonical missing or duplicated`);
  assert.equal(canonical[0].href, url);
  for (const property of [
    'og:title',
    'og:description',
    'og:type',
    'og:url',
    'og:image',
  ]) {
    const entries = meta.filter(item => item.property === property);
    assert.equal(
      entries.length,
      1,
      `${url}: ${property} missing or duplicated`
    );
    assert(entries[0].content, `${url}: empty ${property}`);
  }
  assert.equal(meta.find(item => item.property === 'og:url').content, url);
  assert.equal(
    meta.find(item => item.name === 'twitter:card')?.content,
    'summary_large_image'
  );
  const image = meta.find(item => item.property === 'og:image').content;
  assert.equal(
    meta.find(item => item.name === 'twitter:image')?.content,
    image
  );
  imageUrls.add(image);
  const structured = [
    ...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
  ].flatMap(match => JSON.parse(match[1])['@graph'] || []);
  for (const type of [
    'Person',
    'WebSite',
    ...(pathname === '/' ? [] : ['BreadcrumbList']),
  ]) {
    assert(
      structured.some(item => item['@type'] === type),
      `${url}: missing ${type}`
    );
  }
  if (postUrls.includes(url)) {
    assert.equal(
      meta.find(item => item.property === 'og:type').content,
      'article'
    );
    const article = structured.find(item => item['@type'] === 'BlogPosting');
    assert(article, `${url}: missing BlogPosting`);
    assert.equal(article.url, url);
    assert.equal(article.image[0], image);
    assert(
      Number.isFinite(Date.parse(article.datePublished)),
      `${url}: invalid publication date`
    );
    assert(
      Number.isFinite(Date.parse(article.dateModified)),
      `${url}: invalid modification date`
    );
    assert(html.includes('<article'), `${url}: missing rendered article`);
  }
}
for (const url of imageUrls) {
  const png = fs.readFileSync(path.join(output, new URL(url).pathname));
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
}
const blog = read('blog/index.html');
const blogLinks = tags(blog, 'a').map(link => link.href);
assert(
  blogLinks.some(href => href.includes('/blog/20')),
  'Blog links require JavaScript'
);
// All posts remain discoverable in static annual archives even after the first 10 cards.
for (const url of postUrls) {
  const pathname = new URL(url).pathname.replace(/\/$/, '');
  const year = pathname.match(/\/blog\/(\d{4})-/)[1];
  const archiveLinks = tags(read(`blog/year/${year}/index.html`), 'a');
  assert(
    archiveLinks.some(link => link.href.replace(/\/$/, '').endsWith(pathname)),
    `${url}: missing archive link`
  );
}
assert(read('robots.txt').includes(`Sitemap: ${origin}/sitemap.xml`));
assert(
  tags(read('404.html'), 'meta').some(
    meta => meta.name === 'robots' && meta.content.includes('noindex')
  ),
  '404 must be noindex'
);
const manifest = JSON.parse(read('manifest.webmanifest'));
for (const icon of manifest.icons) {
  const relative = icon.src
    .slice(manifest.scope.replace(/\/$/, '').length)
    .replace(/^\//, '');
  assert(
    fs.existsSync(path.join(output, relative)),
    `Missing icon: ${icon.src}`
  );
}
console.log(
  `SEO verificado: ${urls.length} páginas, ${postUrls.length} artigos, ${imageUrls.size} imagens PNG, sitemap, robots, JSON-LD, manifesto e links pré-renderizados.`
);
