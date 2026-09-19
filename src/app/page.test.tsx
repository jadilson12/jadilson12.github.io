import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

vi.mock('@/components/Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('@/components/Hero', () => ({ default: () => <div data-testid="hero" /> }));
vi.mock('@/components/About', () => ({ default: () => <div data-testid="about" /> }));
vi.mock('@/app/contato/ContatoPageClient', () => ({
  default: () => <div data-testid="contato" />,
}));
vi.mock('@/components/Footer', () => ({ default: () => <div data-testid="footer" /> }));

import Home from './page';

describe('Home', () => {
  it('renders all sections including lazily-loaded ones', async () => {
    render(<Home />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('about')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('contato')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('footer')).toBeInTheDocument());

    // React 19 renders <title>/<meta> tags by hoisting them into document.head
    // rather than leaving them inside the RTL container.
    const title = document.head.querySelector('title');
    expect(title?.textContent).toBe('Jadilson Guedes - Engenheiro de Software | IA, Cloud & DevOps');

    const description = document.head.querySelector('meta[name="description"]');
    expect(description).toHaveAttribute(
      'content',
      'Engenheiro de Software com 8+ anos desenvolvendo soluções completas do planejamento à implantação. Especialista em on-premise, cloud e integração com IA.'
    );

    const ogTitle = document.head.querySelector('meta[property="og:title"]');
    expect(ogTitle).toHaveAttribute('content', 'Jadilson Guedes - Engenheiro de Software');

    const ogDescription = document.head.querySelector('meta[property="og:description"]');
    expect(ogDescription).toHaveAttribute(
      'content',
      'Do planejamento à implantação | On-Premise, Cloud e IA'
    );
  });
});
