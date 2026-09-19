import React from 'react';
import Mermaid from './Mermaid';
import CodeSnippet from './CodeSnippet';

interface CodeBlockProps {
  children?: React.ReactNode;
  className?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  // Helper to extract text from React children (handles strings, arrays, and elements)
  const extractText = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (Array.isArray(node)) return node.map(extractText).join('');
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{
        children?: React.ReactNode;
        className?: string;
      }>;
      if (element.props.children) return extractText(element.props.children);
    }
    return '';
  };

  // Extract the code content
  const codeContent = extractText(children);

  // Determine language - check className directly first
  let language = '';

  if (className) {
    const match = className.match(/language-(\w+)/);
    if (match) {
      language = match[1];
    }
  }

  // If not found in className prop, check children's className
  if (!language && React.isValidElement(children)) {
    const element = children as React.ReactElement<{
      children?: React.ReactNode;
      className?: string;
    }>;
    if (element.props?.className) {
      const match = element.props.className.match(/language-(\w+)/);
      if (match) {
        language = match[1];
      }
    }
  }

  // Check if it's Mermaid
  if (
    language === 'mermaid' ||
    (!language &&
      (codeContent.trim().startsWith('graph ') ||
        codeContent.trim().startsWith('sequenceDiagram') ||
        codeContent.trim().startsWith('classDiagram') ||
        codeContent.trim().startsWith('stateDiagram') ||
        codeContent.trim().startsWith('erDiagram') ||
        codeContent.trim().startsWith('gantt') ||
        codeContent.trim().startsWith('pie') ||
        codeContent.trim().startsWith('flowchart')))
  ) {
    return <Mermaid chart={codeContent.trim()} />;
  }

  // Return normal code block
  return <CodeSnippet code={codeContent} language={language} />;
};

export default CodeBlock;
