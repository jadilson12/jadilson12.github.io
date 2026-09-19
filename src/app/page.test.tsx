import React from 'react';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

vi.mock('@/components/Header', () => ({ default: () => <div data-testid="header" /> }));
vi.mock('@/components/About', () => ({ default: () => <div data-testid="about" /> }));
vi.mock('@/components/Footer', () => ({ default: () => <div data-testid="footer" /> }));

import Home from './page';

describe('Home', () => {
  it('renders all sections including lazily-loaded ones', async () => {
    render(<Home />);

    expect(screen.getByTestId('header')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('about')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByTestId('footer')).toBeInTheDocument());
  });
});
