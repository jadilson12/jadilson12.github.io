import assert from 'node:assert/strict';
import test from 'node:test';
import { createProcessor } from '@mdx-js/mdx';
import { mdxToMarkdown } from '../src/lib/markdown.ts';
import { decisionData, springBootData } from '../src/lib/infographics.ts';
import { getPostData, getSortedPostsData } from '../src/lib/posts.ts';

const canonical = 'https://jadilson.dev/blog/exemplo/';
const processor = createProcessor({ format: 'mdx' });
const diagrams = {
  DecisionGraph: decisionData,
  SpringBootInfographic: springBootData,
};

function codeBlocks(node) {
  return node.type === 'code'
    ? [{ lang: node.lang, value: node.value }]
    : (node.children || []).flatMap(codeBlocks);
}

test('remove imports e comentários MDX sem executar JavaScript nem alterar exemplos', () => {
  const code =
    'import { teste } from "pacote";\nexport const exemplo = "<Widget />";';
  const source = `import Widget from './Widget';\n\nexport const unused = (() => { throw new Error('não executar'); })();\n\n{/* nota interna */}\n\nTexto público.\n\n\`\`\`ts\n${code}\n\`\`\``;
  const result = mdxToMarkdown(source, canonical);
  assert(result.includes('Texto público.'));
  assert(!result.includes('nota interna'));
  assert(!result.includes('unused'));
  assert.deepEqual(codeBlocks(processor.parse(result)), [
    { lang: 'ts', value: code },
  ]);
});

test('converte tabelas JSX preservando legenda, espaços, formatação e referências', () => {
  const source =
    '<div className="scroll"><table><caption>Comparação</caption><thead><tr><th>Opção</th><th>Descrição</th></tr></thead><tbody><tr><td>Um</td><td>Antes <strong>forte</strong> depois <a href="/sobre/">autor</a></td></tr></tbody></table></div>';
  const result = mdxToMarkdown(source, canonical);
  assert(result.includes('Comparação'));
  assert(result.includes('| Opção | Descrição |\n| --- | --- |'));
  assert(
    result.includes(
      '| Um | Antes **forte** depois [autor](https://jadilson.dev/sobre/) |'
    )
  );
});

test('torna links e imagens relativos absolutos, incluindo referências e âncoras', () => {
  const source =
    '[Sobre](/sobre/) e [Seção](#exemplo) e [Referência][ref].\n\n![Diagrama](./imagem.png)\n\n[ref]: ../outro/';
  const result = mdxToMarkdown(source, canonical);
  for (const url of [
    'https://jadilson.dev/sobre/',
    `${canonical}#exemplo`,
    `${canonical}imagem.png`,
    'https://jadilson.dev/blog/outro/',
  ])
    assert(result.includes(url));
});

test('reutiliza todos os ramos e rótulos dos diagramas publicados', () => {
  const flatten = node => [
    node.label,
    ...(node.children || []).flatMap(child => flatten(child.node)),
  ];
  for (const [name, data] of Object.entries(diagrams)) {
    const result = mdxToMarkdown(`<${name} />`, canonical, diagrams);
    for (const label of flatten(data)) assert(result.includes(label), label);
    assert(!result.includes(`<${name}`));
    assert.match(result, /^\s+- Sim/m);
  }
});

test('falha explicitamente para conteúdo dinâmico ou componentes sem representação textual', () => {
  assert.throws(
    () => mdxToMarkdown('<Unknown />', canonical),
    /Componente sem versão textual/
  );
  assert.throws(
    () =>
      mdxToMarkdown(
        '{(() => { throw new Error("não executar"); })()}',
        canonical
      ),
    /Expressão MDX dinâmica/
  );
  assert.throws(
    () =>
      mdxToMarkdown('<DecisionGraph custom="value" />', canonical, diagrams),
    /adaptador de texto/
  );
});

test('todos os artigos atuais podem ser exportados sem perder blocos de código', () => {
  for (const post of getSortedPostsData()) {
    const source = getPostData(post.slug).content;
    const result = mdxToMarkdown(source, canonical, diagrams);
    assert(result.trim().length > 0, post.slug);
    assert.deepEqual(
      codeBlocks(processor.parse(result)),
      codeBlocks(processor.parse(source)),
      post.slug
    );
    assert(
      !/<(?:DecisionGraph|SpringBootInfographic|table|div)\b/.test(result),
      post.slug
    );
  }
});
