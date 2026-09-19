import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import About from './About';

afterEach(cleanup);

describe('About', () => {
  it('renders the bio content', () => {
    render(<About />);
    expect(screen.getByText('Sobre')).toBeInTheDocument();
    expect(screen.getByText(/mais de/)).toBeInTheDocument();
  });
});
