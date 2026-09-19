import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Footer from './Footer';

afterEach(cleanup);

describe('Footer', () => {
  it('renders the current year and copyright text', () => {
    render(<Footer />);

    const year = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${year} Jadilson Guedes`))
    ).toBeInTheDocument();
  });
});
