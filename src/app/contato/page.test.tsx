import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

vi.mock('@/components/Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('@/components/Footer', () => ({ default: () => <div data-testid="footer" /> }));
vi.mock('@/components/Layout', () => ({
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));
vi.mock('./ContatoPageClient', () => ({ default: () => <div data-testid="contato" /> }));

import ContatoPage, { metadata } from './page';

describe('ContatoPage', () => {
  it('renders header, contato client and footer inside layout/main', () => {
    render(<ContatoPage />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('contato')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('exports expected metadata', () => {
    expect(metadata.title).toBe('Contato - Jadilson Guedes');
  });
});
