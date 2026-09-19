import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

vi.mock('@/components/Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('@/components/About', () => ({ default: () => <div data-testid="about" /> }));
vi.mock('@/components/Footer', () => ({ default: () => <div data-testid="footer" /> }));
vi.mock('@/components/Layout', () => ({
  default: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));

import SobrePage, { metadata } from './page';

describe('SobrePage', () => {
  it('renders header, about and footer inside layout', () => {
    render(<SobrePage />);

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('exports expected metadata', () => {
    expect((metadata.title as { absolute: string }).absolute).toBe(
      'Sobre | Jadilson Guedes'
    );
  });
});
