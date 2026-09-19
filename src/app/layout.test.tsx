import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

vi.mock('next/font/google', () => ({
  Geist: () => ({ variable: '--font-geist-sans' }),
  Geist_Mono: () => ({ variable: '--font-geist-mono' }),
}));

vi.mock('@/components/ClientLayout', () => ({
  default: ({ children }: any) => <div data-testid="client-layout">{children}</div>,
}));
vi.mock('@/components/PageTransition', () => ({
  default: ({ children }: any) => <div data-testid="page-transition">{children}</div>,
}));

import RootLayout, { metadata, viewport } from './layout';

describe('RootLayout', () => {
  it('renders html/head/body structure with children', () => {
    const { container } = render(
      <RootLayout>
        <p>hi</p>
      </RootLayout>
    );

    expect(screen.getByText('hi')).toBeInTheDocument();
    expect(screen.getByTestId('client-layout')).toBeInTheDocument();
    expect(screen.getByTestId('page-transition')).toBeInTheDocument();

    // React 19 renders the <html>/<head>/<body> tags by reconciling them onto
    // the real document, not by nesting a literal <html> node inside the RTL
    // container (jsdom tolerates this without erroring).
    expect(document.documentElement).toHaveAttribute('lang', 'pt-BR');
    void container;
  });
});

describe('metadata and viewport', () => {
  it('exports expected metadata fields', () => {
    expect(metadata.title).toBe('Jadilson Guedes - Engenheiro de Software | IA, Cloud & DevOps');
  });

  it('exports expected viewport fields', () => {
    expect(viewport.themeColor).toBe('#c9f31d');
  });
});
