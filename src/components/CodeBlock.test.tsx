import React from 'react';
import { vi } from 'vitest';

vi.mock('./Mermaid', () => ({
  default: ({ chart }: any) => <div data-testid="mermaid-mock">{chart}</div>,
}));

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import CodeBlock from './CodeBlock';

afterEach(cleanup);

describe('CodeBlock', () => {
  describe('extractText', () => {
    it('extracts a plain string child', () => {
      render(<CodeBlock>const x = 1;</CodeBlock>);
      expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });

    it('extracts text from an array of children', () => {
      render(<CodeBlock>{['foo', 'bar']}</CodeBlock>);
      expect(screen.getByText('foobar')).toBeInTheDocument();
    });

    it('recurses into a React element child that has its own children', () => {
      render(
        <CodeBlock>
          <span>nested text</span>
        </CodeBlock>
      );
      expect(screen.getByText('nested text')).toBeInTheDocument();
    });

    it('falls back to empty string for a non-string/array/element child (number)', () => {
      const { container } = render(<CodeBlock>{123 as any}</CodeBlock>);
      // codeContent becomes '' -> mermaid detection false -> normal pre/code render
      const codeEl = container.querySelector('code');
      expect(codeEl).not.toBeNull();
    });

    it('falls back to empty string for undefined children', () => {
      const { container } = render(<CodeBlock>{undefined}</CodeBlock>);
      const codeEl = container.querySelector('code');
      expect(codeEl).not.toBeNull();
    });

    it('falls back to empty string for a valid React element that has no children of its own', () => {
      const { container } = render(
        <CodeBlock>
          <br />
        </CodeBlock>
      );
      const codeEl = container.querySelector('code');
      expect(codeEl).not.toBeNull();
      expect(screen.queryByTestId('mermaid-mock')).not.toBeInTheDocument();
    });
  });

  describe('language detection via className prop', () => {
    it('detects language from a matching className', () => {
      const { container } = render(
        <CodeBlock className="language-javascript">const x = 1;</CodeBlock>
      );
      const codeEl = container.querySelector('code');
      expect(codeEl).toHaveClass('language-javascript');
    });

    it('leaves language empty when className does not match the pattern', () => {
      const { container } = render(<CodeBlock className="foo">const x = 1;</CodeBlock>);
      const codeEl = container.querySelector('code');
      expect(codeEl?.className).toBe('');
      expect(screen.queryByTestId('mermaid-mock')).not.toBeInTheDocument();
    });
  });

  describe('language detection via child className (no className prop)', () => {
    it('detects language from a single child element className', () => {
      render(
        <CodeBlock>
          <code className="language-python">print("hi")</code>
        </CodeBlock>
      );
      // Not mermaid, so falls through to normal render; ensure code content preserved
      expect(screen.getByText('print("hi")')).toBeInTheDocument();
    });

    it('does not set language when child className does not match pattern', () => {
      render(
        <CodeBlock>
          <span className="foo">plain content</span>
        </CodeBlock>
      );
      expect(screen.getByText('plain content')).toBeInTheDocument();
    });

    it('does not set language when child has no className at all', () => {
      render(
        <CodeBlock>
          <span>no class here</span>
        </CodeBlock>
      );
      expect(screen.getByText('no class here')).toBeInTheDocument();
    });
  });

  describe('mermaid detection', () => {
    it('renders Mermaid when className is language-mermaid', () => {
      render(<CodeBlock className="language-mermaid">graph TD; A--&gt;B</CodeBlock>);
      expect(screen.getByTestId('mermaid-mock')).toBeInTheDocument();
    });

    it('renders Mermaid when content starts with "graph " and no language detected', () => {
      render(<CodeBlock>{'graph TD; A-->B'}</CodeBlock>);
      expect(screen.getByTestId('mermaid-mock')).toBeInTheDocument();
    });

    it('renders Mermaid when content starts with "sequenceDiagram"', () => {
      render(<CodeBlock>{'sequenceDiagram\nA->>B: hi'}</CodeBlock>);
      expect(screen.getByTestId('mermaid-mock')).toBeInTheDocument();
    });

    it('renders Mermaid when content starts with "classDiagram"', () => {
      render(<CodeBlock>{'classDiagram\nClass01 <|-- Class02'}</CodeBlock>);
      expect(screen.getByTestId('mermaid-mock')).toBeInTheDocument();
    });

    it('renders Mermaid when content starts with "stateDiagram"', () => {
      render(<CodeBlock>{'stateDiagram\n[*] --> Still'}</CodeBlock>);
      expect(screen.getByTestId('mermaid-mock')).toBeInTheDocument();
    });

    it('renders Mermaid when content starts with "erDiagram"', () => {
      render(<CodeBlock>{'erDiagram\nCUSTOMER ||--o{ ORDER : places'}</CodeBlock>);
      expect(screen.getByTestId('mermaid-mock')).toBeInTheDocument();
    });

    it('renders Mermaid when content starts with "gantt"', () => {
      render(<CodeBlock>{'gantt\ntitle A Gantt Diagram'}</CodeBlock>);
      expect(screen.getByTestId('mermaid-mock')).toBeInTheDocument();
    });

    it('renders Mermaid when content starts with "pie"', () => {
      render(<CodeBlock>{'pie title Pets\n"Dogs" : 10'}</CodeBlock>);
      expect(screen.getByTestId('mermaid-mock')).toBeInTheDocument();
    });

    it('renders Mermaid when content starts with "flowchart"', () => {
      render(<CodeBlock>{'flowchart TD\nA --> B'}</CodeBlock>);
      expect(screen.getByTestId('mermaid-mock')).toBeInTheDocument();
    });

    it('falls through to normal <pre><code> render when nothing matches', () => {
      const { container } = render(<CodeBlock>{'const x = 1;'}</CodeBlock>);
      expect(screen.queryByTestId('mermaid-mock')).not.toBeInTheDocument();
      expect(container.querySelector('pre')).not.toBeNull();
      expect(container.querySelector('code')).not.toBeNull();
      expect(screen.getByText('const x = 1;')).toBeInTheDocument();
    });
  });
});
