import assert from 'node:assert/strict';
import test from 'node:test';
import { collectHeadings } from '../src/lib/headings.ts';

const heading = (text, depth = 2) => ({
  type: 'heading',
  depth,
  children: [{ type: 'text', value: text }],
});

test('anchors preserve accented words and avoid collisions with numbered headings', () => {
  const tree = {
    type: 'root',
    children: [
      heading('Introdução'),
      heading('Introdução'),
      heading('Introdução 2'),
      heading('✨'),
      heading('✨'),
    ],
  };
  const toc = [];
  collectHeadings(toc)()(tree);
  assert.deepEqual(
    toc.map(item => item.id),
    ['introducao', 'introducao-2', 'introducao-2-2', 'secao', 'secao-2']
  );
  assert.equal(new Set(toc.map(item => item.id)).size, toc.length);
  for (const [index, node] of tree.children.entries()) {
    assert.equal(node.data.hProperties.id, toc[index].id);
    assert.equal(node.data.hProperties.tabIndex, -1);
  }
});

test('TOC collects article sections and nested inline text, excluding title and code', () => {
  const tree = {
    type: 'root',
    children: [
      heading('Título', 1),
      { type: 'code', value: '## Exemplo' },
      {
        type: 'heading',
        depth: 3,
        children: [
          { type: 'strong', children: [{ type: 'text', value: 'Usando ' }] },
          { type: 'inlineCode', value: 'Next.js' },
        ],
      },
    ],
  };
  const toc = [];
  collectHeadings(toc)()(tree);
  assert.deepEqual(toc, [
    { id: 'usando-next-js', text: 'Usando Next.js', level: 3 },
  ]);
});
