import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ScrollToTop from './ScrollToTop';

afterEach(cleanup);

describe('ScrollToTop', () => {
  it('renders not visible initially', () => {
    render(<ScrollToTop />);
    const button = screen.getByRole('button', { name: /voltar ao topo/i });
    expect(button.className).toContain('opacity-0');
  });

  it('becomes visible when scrollY > 300', () => {
    render(<ScrollToTop />);
    const button = screen.getByRole('button', { name: /voltar ao topo/i });

    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(button.className).toContain('opacity-100');
  });

  it('becomes invisible again when scrollY <= 300', () => {
    render(<ScrollToTop />);
    const button = screen.getByRole('button', { name: /voltar ao topo/i });

    Object.defineProperty(window, 'scrollY', { value: 400, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(button.className).toContain('opacity-100');

    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(button.className).toContain('opacity-0');
  });

  it('calls window.scrollTo on click', () => {
    render(<ScrollToTop />);
    const button = screen.getByRole('button', { name: /voltar ao topo/i });

    fireEvent.click(button);

    expect(vi.mocked(window.scrollTo)).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('removes the scroll listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<ScrollToTop />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});
