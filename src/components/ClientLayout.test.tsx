import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ClientLayout from './ClientLayout';

afterEach(cleanup);

describe('ClientLayout', () => {
  it('renders children and the ScrollToTop button', () => {
    render(
      <ClientLayout>
        <p>page content</p>
      </ClientLayout>
    );

    expect(screen.getByText('page content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /voltar ao topo/i })).toBeInTheDocument();
  });

  describe('window error handler', () => {
    it('prevents default when message includes "ethereum"', () => {
      render(<ClientLayout>{null}</ClientLayout>);

      const evt = new ErrorEvent('error', { message: 'ethereum provider injected', cancelable: true } as any);
      window.dispatchEvent(evt);

      expect(evt.defaultPrevented).toBe(true);
    });

    it('prevents default when message includes "selectedAddress"', () => {
      render(<ClientLayout>{null}</ClientLayout>);

      const evt = new ErrorEvent('error', { message: 'cannot read selectedAddress of undefined', cancelable: true } as any);
      window.dispatchEvent(evt);

      expect(evt.defaultPrevented).toBe(true);
    });

    it('does nothing when message matches neither keyword', () => {
      render(<ClientLayout>{null}</ClientLayout>);

      const evt = new ErrorEvent('error', { message: 'some unrelated error', cancelable: true } as any);
      window.dispatchEvent(evt);

      expect(evt.defaultPrevented).toBe(false);
    });
  });

  describe('window unhandledrejection handler', () => {
    it('prevents default when reason.message includes "ethereum"', () => {
      render(<ClientLayout>{null}</ClientLayout>);

      const evt: any = new Event('unhandledrejection', { cancelable: true });
      evt.reason = { message: 'ethereum is not defined' };
      window.dispatchEvent(evt);

      expect(evt.defaultPrevented).toBe(true);
    });

    it('prevents default when reason.message includes "selectedAddress"', () => {
      render(<ClientLayout>{null}</ClientLayout>);

      const evt: any = new Event('unhandledrejection', { cancelable: true });
      evt.reason = { message: 'selectedAddress access failed' };
      window.dispatchEvent(evt);

      expect(evt.defaultPrevented).toBe(true);
    });

    it('falls back to String(reason) when reason has no message property, and matches keyword', () => {
      render(<ClientLayout>{null}</ClientLayout>);

      const evt: any = new Event('unhandledrejection', { cancelable: true });
      evt.reason = 'plain string mentioning ethereum';
      window.dispatchEvent(evt);

      expect(evt.defaultPrevented).toBe(true);
    });

    it('does nothing when neither reason.message nor String(reason) match', () => {
      render(<ClientLayout>{null}</ClientLayout>);

      const evt: any = new Event('unhandledrejection', { cancelable: true });
      evt.reason = 'totally unrelated rejection';
      window.dispatchEvent(evt);

      expect(evt.defaultPrevented).toBe(false);
    });
  });

  it('removes the error and unhandledrejection listeners on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ClientLayout>{null}</ClientLayout>);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
    expect(removeEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });
});
