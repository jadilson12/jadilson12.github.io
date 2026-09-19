import { createProcessor } from '@mdx-js/mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import type { Nodes } from 'mdast';
import type { InfographicNode } from './infographics';

type JsxNode = Extract<
  Nodes,
  { type: 'mdxJsxFlowElement' | 'mdxJsxTextElement' }
>;

export function infographicMarkdown(
  node: InfographicNode,
  depth = 0,
  edge = ''
): string {
  const text = `${edge ? `${edge}: ` : ''}${node.label}${node.subLabel ? ` — ${node.subLabel}` : ''}`;
  return `${'  '.repeat(depth)}- ${toMarkdown({ type: 'text', value: text }).trim()}\n${node.children?.map(child => infographicMarkdown(child.node, depth + 1, child.label)).join('') || ''}`;
}

// Parse the document tree only. No MDX JavaScript is compiled or evaluated.
export function mdxToMarkdown(
  source: string,
  canonical: string,
  diagrams: Record<string, InfographicNode> = {}
): string {
  const tree = createProcessor({ format: 'mdx' }).parse(source);
  const absolute = (url: string) => new URL(url, canonical).href;
  const isJsx = (node: Nodes): node is JsxNode =>
    node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement';

  function visit(node: Nodes) {
    if (
      node.type === 'link' ||
      node.type === 'image' ||
      node.type === 'definition'
    )
      node.url = absolute(node.url);
    if ('children' in node) node.children.forEach(visit);
  }
  visit(tree);

  function descendants(node: Nodes, ...names: string[]): JsxNode[] {
    if (isJsx(node) && node.name && names.includes(node.name)) return [node];
    return 'children' in node
      ? node.children.flatMap(child => descendants(child, ...names))
      : [];
  }

  function attribute(node: JsxNode, name: string) {
    const attr = node.attributes.find(
      item => item.type === 'mdxJsxAttribute' && item.name === name
    );
    if (!attr) return '';
    if (attr.type !== 'mdxJsxAttribute' || typeof attr.value !== 'string')
      throw new Error(`Atributo dinâmico não suportado no Markdown: ${name}`);
    return attr.value;
  }

  function inline(node: JsxNode) {
    return node.children
      .map(child => serialize(child).replace(/\n$/, ''))
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function jsx(node: Nodes): string {
    if (!isJsx(node)) throw new Error('Nó MDX inesperado');
    if (node.name && diagrams[node.name]) {
      if (node.attributes.length)
        throw new Error(
          `Crie um adaptador de texto para as propriedades de ${node.name}`
        );
      return infographicMarkdown(diagrams[node.name]);
    }
    if (node.name === 'table') {
      const rows = descendants(node, 'tr').map(row =>
        descendants(row, 'td', 'th').map(cell => {
          if (attribute(cell, 'colSpan') || attribute(cell, 'rowSpan'))
            throw new Error(
              'Tabelas com células mescladas precisam de um adaptador de texto'
            );
          return inline(cell).replace(/\|/g, '\\|');
        })
      );
      if (!rows.length) return '';
      if (rows.some(row => row.length !== rows[0].length))
        throw new Error('Tabela com número inconsistente de colunas');
      const caption = descendants(node, 'caption').map(inline).join('\n');
      const row = (cells: string[]) => `| ${cells.join(' | ')} |`;
      return `${caption ? `${caption}\n\n` : ''}${row(rows[0])}\n${row(rows[0].map(() => '---'))}\n${rows.slice(1).map(row).join('\n')}\n`;
    }
    if (node.name === 'a')
      return `[${inline(node)}](${absolute(attribute(node, 'href'))})`;
    if (node.name === 'img')
      return `![${attribute(node, 'alt')}](${absolute(attribute(node, 'src'))})`;
    if (node.name === 'strong' || node.name === 'b')
      return `**${inline(node)}**`;
    if (node.name === 'em' || node.name === 'i') return `*${inline(node)}*`;
    if (node.name === 'code')
      return toMarkdown({ type: 'inlineCode', value: inline(node) }).trimEnd();
    if (node.name === 'br') return '\n';
    if (
      node.name === null ||
      ['div', 'section', 'article', 'span', 'p'].includes(node.name)
    ) {
      return node.children
        .map(child => serialize(child).replace(/\n$/, ''))
        .join(node.type === 'mdxJsxTextElement' ? '' : '\n\n');
    }
    throw new Error(
      `Componente sem versão textual: ${node.name}. Adicione um adaptador antes de publicar.`
    );
  }

  function expression(node: Nodes) {
    if ('value' in node && /^\s*\/\*[\s\S]*\*\/\s*$/.test(node.value))
      return '';
    throw new Error(
      'Expressão MDX dinâmica não pode ser exportada como conteúdo estático'
    );
  }

  function serialize(node: Nodes): string {
    return toMarkdown(node, {
      bullet: '-',
      fences: true,
      handlers: {
        mdxJsxFlowElement: jsx,
        mdxJsxTextElement: jsx,
        mdxjsEsm: () => '',
        mdxFlowExpression: expression,
        mdxTextExpression: expression,
      },
    });
  }
  return serialize(tree).trim() + '\n';
}
