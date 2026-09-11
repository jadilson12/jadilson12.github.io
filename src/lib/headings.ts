export interface TocItem {
  id: string;
  text: string;
  level: number;
}
interface MarkdownNode {
  type: string;
  depth?: number;
  value?: string;
  children?: MarkdownNode[];
  data?: { hProperties?: Record<string, unknown> };
}

function nodeText(node: MarkdownNode): string {
  return node.value || (node.children || []).map(nodeText).join('');
}

// Stable anchors are emitted in the HTML, so links also work on direct visits.
export function collectHeadings(headings: TocItem[]) {
  return function remarkHeadings() {
    return function transform(tree: MarkdownNode) {
      const used = new Set<string>();
      function visit(node: MarkdownNode) {
        if (node.type === 'heading' && (node.depth === 2 || node.depth === 3)) {
          const text = nodeText(node);
          const base =
            text
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '') || 'secao';
          let id = base;
          let suffix = 2;
          while (used.has(id)) id = `${base}-${suffix++}`;
          used.add(id);
          node.data = {
            ...node.data,
            hProperties: { ...node.data?.hProperties, id, tabIndex: -1 },
          };
          headings.push({ id, text, level: node.depth });
        }
        node.children?.forEach(visit);
      }
      visit(tree);
    };
  };
}
