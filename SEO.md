# SEO do site

O domínio canônico é `https://jadilson.dev`, definido em `src/lib/site.ts`.
Espelhos, incluindo GitHub Pages, apontam para esse domínio. O `basePath` do
Next.js é aplicado aos ícones e ao manifesto do deploy.

- A Metadata API gera título, descrição, canonical, Open Graph e Twitter por
  página, sem tags duplicadas no JSX.
- `src/app/sitemap.ts` inclui páginas públicas, arquivos anuais e todos os
  posts. `lastModified` usa `updated` ou `date` do post, nunca a data artificial
  do build.
- `src/app/robots.ts` publica as regras de rastreamento e o endereço do sitemap.
- `src/app/og/[slug]/image.png/route.tsx` usa `ImageResponse` de `next/og` para
  gerar imagens PNG 1200 × 630 durante o build, inclusive uma por artigo.
- JSON-LD descreve `Person`, `WebSite`, páginas, `BlogPosting` e
  `BreadcrumbList`.
- A listagem do blog é pré-renderizada; somente a sincronização dos filtros com
  a URL depende de JavaScript. URLs filtradas apontam para `/blog/` como
  canonical.
- O manifesto nativo e os ícones locais são exportados com o site.
- O Netlify responde com a página 404 e status 404 para URLs inexistentes.

## Conteúdo

Os posts usam `title`, `description`, `date` e `tags` no frontmatter. Campos
opcionais: `updated` (data da última alteração editorial, `YYYY-MM-DD`) e
`language` (por exemplo, `en`; o padrão é `pt-BR`). Datas precisam ser válidas.
Ao adicionar um artigo, sitemap, metadados, dados estruturados e imagem são
gerados automaticamente no próximo build.

## Verificação

Execute `yarn build` e `yarn check:seo`. O segundo comando verifica os arquivos
exportados em `out/`: metadados únicos, URLs canônicas, referências às imagens,
JSON-LD, sitemap, robots, ícones, manifesto e links do blog no HTML inicial.

Após publicar, envie `https://jadilson.dev/sitemap.xml` ao Google Search
Console. A confirmação de propriedade depende da conta/DNS do domínio; não há
códigos de verificação fictícios no projeto. Indexação e posição nas buscas
dependem também do conteúdo e dos buscadores.

O projeto usa `output: 'export'`. A geração é estática: SSR por requisição, ISR
e o otimizador de imagens em servidor exigiriam outro modelo de hospedagem.
`next/font` continua hospedando as fontes no próprio build.

Para validar enquanto `yarn dev` está rodando, use
`NEXT_DIST_DIR=.next-validation yarn build`. Com a exportação estática, essa
pasta recebe o site exportado. Confira essa versão com
`node scripts/check-seo.mjs .next-validation`.

O índice dos artigos recebe âncoras únicas durante a compilação do MDX. Para
verificar os casos de acentuação, títulos repetidos e formatação dos títulos,
execute `node --test scripts/headings.test.mjs`.
