# Conteúdo para LLMs

O site publica arquivos estáticos baseados na proposta
[llms.txt](https://llmstxt.org/). A geração acontece no build do Next.js, usando
os mesmos artigos de `content/blog`, metadados de `src/lib/site.ts` e dados dos
diagramas exibidos nas páginas.

| Endereço                | Conteúdo                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `/llms.txt`             | Índice resumido com links para os artigos em Markdown.                             |
| `/llm.txt`              | Alias com o mesmo conteúdo do índice.                                              |
| `/llms-full.txt`        | Resumo do autor e todos os artigos completos, em uma única leitura.                |
| `/llms.json`            | Catálogo versionado com autor, idiomas, datas, tags, URLs e hashes dos documentos. |
| `/blog/{slug}/index.md` | Artigo completo em Markdown, com fonte canônica e metadados.                       |
| `/sobre/index.md`       | Resumo do perfil e links públicos do autor.                                        |

## Atualização automática

Publique ou edite um artigo normalmente e execute `yarn build`. Não é necessário
manter listas ou cópias manuais. O build regenera todos os formatos, incluindo a
inclusão e a remoção de artigos. As datas vêm do frontmatter (`date` e, quando
presente, `updated`), sem inventar uma data de atualização a cada build.

Os workflows de publicação no GitHub Actions e o build do Netlify executam os
testes de conversão e a validação dos arquivos exportados antes do deploy.

Um consumidor pode baixar `/llms.json`, comparar o conjunto de slugs com sua
cópia anterior e buscar `markdown_url` apenas para artigos cujo `content_sha256`
mudou. O hash usa SHA-256 dos bytes UTF-8 do documento completo, incluindo
metadados. Slugs ausentes do catálogo devem ser removidos da cópia do
consumidor. Os campos `canonical_url`, `author`, `published_at` e `modified_at`
permitem preservar a atribuição e o contexto temporal nas respostas.

O HTML anuncia `/llms.txt` com `rel="describedby"` e cada artigo anuncia seu
Markdown com `rel="alternate" type="text/markdown"`. No Netlify, os headers
também anunciam o índice e definem o MIME dos arquivos `.md`. Em outra
hospedagem, configure `.md` como `text/markdown; charset=utf-8`; os arquivos
continuam legíveis sem JavaScript. Esses mecanismos facilitam a descoberta, mas
o suporte e o uso como fonte dependem de cada ferramenta de IA.

## Conversão de MDX

O conversor analisa a árvore sintática sem executar JavaScript. Preserva links,
imagens, exemplos de código e diagramas Mermaid; converte tabelas JSX para
tabelas Markdown e os componentes `DecisionGraph` e `SpringBootInfographic` para
listas com todos os ramos. Os dados desses diagramas são compartilhados com a
interface.

Imports, exports e comentários MDX não fazem parte do texto público. Componentes
desconhecidos e expressões dinâmicas fazem o build falhar com uma mensagem
explicativa: adicione a representação textual em `src/lib/markdown.ts` ou os
dados em `src/lib/llms.ts` antes de publicar. Isso evita exportar
silenciosamente um artigo incompleto.

## Verificação

```bash
yarn test:llms
yarn build
yarn check:llms
```

`test:llms` verifica a conversão, a não execução de MDX e a preservação dos
blocos de código de todos os artigos atuais. `check:llms` inspeciona os arquivos
exportados, confronta o catálogo com os artigos do repositório e valida links
locais, hashes, conteúdo completo e descoberta no HTML. Para uma pasta de
exportação diferente, use `yarn check:llms .next-validation`.
