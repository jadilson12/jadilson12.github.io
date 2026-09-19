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
  });
});
