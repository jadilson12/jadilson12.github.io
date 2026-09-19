import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Layout from './Layout';

afterEach(cleanup);

describe('Layout', () => {
  it('renders children and default classes when no className is given', () => {
    render(
      <Layout>
        <p>content</p>
      </Layout>
    );

    const content = screen.getByText('content');
    expect(content).toBeInTheDocument();
    expect(content.parentElement?.className).toContain('min-h-screen');
    expect(content.parentElement?.className.trim().endsWith('w-full')).toBe(true);
  });

  it('merges a custom className when given', () => {
    render(
      <Layout className="custom-class">
        <p>content</p>
      </Layout>
    );

    const content = screen.getByText('content');
    expect(content.parentElement?.className).toContain('custom-class');
  });
});
