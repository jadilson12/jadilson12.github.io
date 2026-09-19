import { vi } from 'vitest';

vi.mock('mermaid', () => ({
  default: {
    initialize: vi.fn(),
    render: vi.fn().mockResolvedValue({ svg: '<svg data-testid="mock-svg"></svg>' }),
  },
}));

import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import mermaid from 'mermaid';
import Mermaid from './Mermaid';

afterEach(cleanup);

beforeEach(() => {
  vi.mocked(mermaid.initialize).mockClear();
  vi.mocked(mermaid.render).mockClear();
  vi.mocked(mermaid.render).mockResolvedValue({ svg: '<svg data-testid="mock-svg"></svg>' } as any);
});

describe('Mermaid', () => {
  it('calls mermaid.initialize on mount with dark theme config', () => {
    render(<Mermaid chart="graph TD; A-->B" />);
    expect(mermaid.initialize).toHaveBeenCalledTimes(1);
    const config = vi.mocked(mermaid.initialize).mock.calls[0][0] as any;
    expect(config).toMatchObject({ theme: 'dark' });
  });

  it('renders the svg returned by mermaid.render into the container on success', async () => {
    const { container } = render(<Mermaid chart="graph TD; A-->B" />);
    await waitFor(() => {
      expect(container.querySelector('.mermaid-container')?.innerHTML).toContain('mock-svg');
    });
    expect(mermaid.render).toHaveBeenCalledTimes(1);
  });

  it('does not call mermaid.render when chart is an empty string', async () => {
    render(<Mermaid chart="" />);
    // Give any potential microtasks a chance to run
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mermaid.render).not.toHaveBeenCalled();
  });

  it('renders a fallback message when mermaid.render rejects with an Error', async () => {
    vi.mocked(mermaid.render).mockRejectedValueOnce(new Error('boom'));
    const { container } = render(<Mermaid chart="graph TD; A-->B" />);

    await waitFor(() => {
      expect(container.querySelector('.mermaid-container')?.textContent).toContain(
        'Não foi possível exibir este diagrama'
      );
    });
  });

  it('renders a fallback message when mermaid.render rejects with a non-Error value', async () => {
    vi.mocked(mermaid.render).mockRejectedValueOnce('oops');
    const { container } = render(<Mermaid chart="graph TD; A-->B" />);

    await waitFor(() => {
      expect(container.querySelector('.mermaid-container')?.textContent).toContain(
        'Não foi possível exibir este diagrama'
      );
    });
  });

  it('does not touch the container when the component unmounts before a successful render resolves', async () => {
    let resolveRender!: (value: { svg: string }) => void;
    vi.mocked(mermaid.render).mockImplementationOnce(
      () => new Promise((resolve) => { resolveRender = resolve as (value: { svg: string }) => void; }) as any
    );

    const { unmount } = render(<Mermaid chart="graph TD; A-->B" />);
    unmount();

    // Resolve after unmount: containerRef.current is now null, so the
    // `if (containerRef.current)` guard inside the success path must skip
    // writing to the DOM instead of throwing.
    await act(async () => {
      resolveRender({ svg: '<svg data-testid="mock-svg"></svg>' });
      await Promise.resolve();
    });
  });

  it('does not touch the container when the component unmounts before a rejected render settles', async () => {
    let rejectRender!: (reason?: unknown) => void;
    vi.mocked(mermaid.render).mockImplementationOnce(
      () => new Promise((_resolve, reject) => { rejectRender = reject; })
    );

    const { unmount } = render(<Mermaid chart="graph TD; A-->B" />);
    unmount();

    // Reject after unmount: containerRef.current is now null, so the
    // `if (containerRef.current)` guard inside the catch path must skip
    // writing the error block instead of throwing.
    await act(async () => {
      rejectRender(new Error('too late'));
      await Promise.resolve();
    });
  });
});
