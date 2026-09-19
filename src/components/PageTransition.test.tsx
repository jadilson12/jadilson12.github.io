import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PageTransition from './PageTransition';

afterEach(cleanup);

describe('PageTransition', () => {
  it('renders children inside a wrapping div', () => {
    render(
      <PageTransition>
        <p>hello world</p>
      </PageTransition>
    );

    expect(screen.getByText('hello world')).toBeInTheDocument();
  });
});
