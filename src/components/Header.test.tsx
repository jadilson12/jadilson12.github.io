import React from 'react';
import { vi } from 'vitest';

vi.mock('framer-motion', () => {
  const passthrough = (tag: string) =>
    React.forwardRef(function MockMotionComponent(props: any, ref: any) {
      const {
        initial: _initial, animate: _animate, exit: _exit, whileHover: _whileHover, whileTap: _whileTap, whileInView: _whileInView, viewport: _viewport,
        variants: _variants, transition: _transition, layout: _layout, layoutId: _layoutId, onAnimationComplete: _onAnimationComplete, drag: _drag,
        dragConstraints: _dragConstraints, whileDrag: _whileDrag, custom: _custom, ...rest
      } = props;
      return React.createElement(tag, { ref, ...rest });
    });
  const motion = new Proxy({} as any, { get: (_target, tag: string) => passthrough(tag) });
  return {
    motion,
    AnimatePresence: ({ children }: any) => children,
    useInView: vi.fn(() => true),
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {}, onChange: () => () => {} } }),
    useTransform: () => 0,
  };
});

const { usePathnameMock } = vi.hoisted(() => ({ usePathnameMock: vi.fn(() => '/') }));
vi.mock('next/navigation', () => ({
  usePathname: usePathnameMock,
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), prefetch: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/hooks/useScrollSpy', () => ({ useScrollSpy: vi.fn(() => '') }));

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import Header from './Header';

afterEach(() => {
  cleanup();
  document.body.style.overflow = '';
});

beforeEach(() => {
  usePathnameMock.mockReturnValue('/');
  vi.mocked(useScrollSpy).mockReturnValue('');
});

describe('Header', () => {
  describe('isPostPage', () => {
    it('is true for a real blog post path (mobile back button shown)', () => {
      usePathnameMock.mockReturnValue('/blog/my-post');
      render(<Header />);
      expect(screen.getByLabelText('Voltar para o blog')).toBeInTheDocument();
    });

    it('is false for the /blog listing page itself', () => {
      usePathnameMock.mockReturnValue('/blog');
      render(<Header />);
      expect(screen.queryByLabelText('Voltar para o blog')).not.toBeInTheDocument();
    });

    it('is false for /blog/year/... pages', () => {
      usePathnameMock.mockReturnValue('/blog/year/2024');
      render(<Header />);
      expect(screen.queryByLabelText('Voltar para o blog')).not.toBeInTheDocument();
    });

    it('is false on the home page', () => {
      usePathnameMock.mockReturnValue('/');
      render(<Header />);
      expect(screen.queryByLabelText('Voltar para o blog')).not.toBeInTheDocument();
    });
  });

  describe('isActive', () => {
    it('uses scroll-spy match on home page for items with sectionId', () => {
      usePathnameMock.mockReturnValue('/');
      vi.mocked(useScrollSpy).mockReturnValue('sobre');
      render(<Header />);
      const desktopNav = document.querySelector('.hidden.md\\:flex') as HTMLElement;
      const link = within(desktopNav).getByText('Sobre').closest('a')!;
      expect(link.className).toContain('text-primary-300');
    });

    it('does not mark item active when scroll-spy section does not match', () => {
      usePathnameMock.mockReturnValue('/');
      vi.mocked(useScrollSpy).mockReturnValue('contato');
      render(<Header />);
      const desktopNav = document.querySelector('.hidden.md\\:flex') as HTMLElement;
      const link = within(desktopNav).getByText('Sobre').closest('a')!;
      expect(link.className).not.toContain('text-primary-300');
    });

    it('marks "Início" active when pathname is exactly "/"', () => {
      usePathnameMock.mockReturnValue('/');
      vi.mocked(useScrollSpy).mockReturnValue('home');
      render(<Header />);
      const desktopNav = document.querySelector('.hidden.md\\:flex') as HTMLElement;
      const link = within(desktopNav).getByText('Início').closest('a')!;
      expect(link.className).toContain('text-primary-300');
    });

    it('does not mark "Início" active when pathname is not "/"', () => {
      usePathnameMock.mockReturnValue('/blog');
      render(<Header />);
      const desktopNav = document.querySelector('.hidden.md\\:flex') as HTMLElement;
      const link = within(desktopNav).getByText('Início').closest('a')!;
      expect(link.className).not.toContain('text-primary-300');
    });

    it('marks "Blog" active via startsWith when pathname is /blog', () => {
      usePathnameMock.mockReturnValue('/blog');
      render(<Header />);
      const desktopNav = document.querySelector('.hidden.md\\:flex') as HTMLElement;
      const link = within(desktopNav).getByText('Blog').closest('a')!;
      expect(link.className).toContain('text-primary-300');
    });

    it('does not mark "Blog" active when pathname does not start with /blog', () => {
      usePathnameMock.mockReturnValue('/sobre');
      render(<Header />);
      const desktopNav = document.querySelector('.hidden.md\\:flex') as HTMLElement;
      const link = within(desktopNav).getByText('Blog').closest('a')!;
      expect(link.className).not.toContain('text-primary-300');
    });
  });

  describe('handleNavClick', () => {
    it('scrolls to section and closes mobile menu when on home with matching sectionId and element exists', () => {
      usePathnameMock.mockReturnValue('/');
      const el = document.createElement('div');
      el.id = 'sobre';
      Object.defineProperty(el, 'offsetTop', { value: 300, configurable: true });
      document.body.appendChild(el);

      const scrollToSpy = vi.fn();
      window.scrollTo = scrollToSpy as any;

      render(<Header />);
      const desktopNav = document.querySelector('.hidden.md\\:flex') as HTMLElement;
      const link = within(desktopNav).getByText('Sobre').closest('a')!;

      fireEvent.click(link);

      expect(scrollToSpy).toHaveBeenCalledWith({ top: 300, behavior: 'smooth' });

      document.body.removeChild(el);
    });

    it('does nothing beyond preventDefault when section element is missing', () => {
      usePathnameMock.mockReturnValue('/');
      const scrollToSpy = vi.fn();
      window.scrollTo = scrollToSpy as any;

      render(<Header />);
      const desktopNav = document.querySelector('.hidden.md\\:flex') as HTMLElement;
      const link = within(desktopNav).getByText('Contato').closest('a')!;

      fireEvent.click(link);

      expect(scrollToSpy).not.toHaveBeenCalled();
    });

    it('just closes mobile menu when not applicable (no sectionId match / not on home)', () => {
      usePathnameMock.mockReturnValue('/blog');
      render(<Header />);

      // Open the mobile menu first
      const menuButton = screen.getByLabelText('Abrir menu');
      fireEvent.click(menuButton);
      expect(screen.getByLabelText('Fechar menu')).toBeInTheDocument();

      // Click a mobile nav link, should close the menu
      const mobileLinks = screen.getAllByText('Blog');
      const mobileLink = mobileLinks[mobileLinks.length - 1].closest('a')!;
      fireEvent.click(mobileLink);

      expect(screen.getByLabelText('Abrir menu')).toBeInTheDocument();
    });
  });

  describe('mobile menu', () => {
    it('toggles aria-label and body overflow style when opened and closed', () => {
      usePathnameMock.mockReturnValue('/');
      render(<Header />);

      expect(document.body.style.overflow).toBe('unset');

      const menuButton = screen.getByLabelText('Abrir menu');
      fireEvent.click(menuButton);

      expect(screen.getByLabelText('Fechar menu')).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('hidden');

      fireEvent.click(screen.getByLabelText('Fechar menu'));

      expect(screen.getByLabelText('Abrir menu')).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('unset');
    });

    it('renders an active dot indicator for the active mobile nav item', () => {
      usePathnameMock.mockReturnValue('/');
      vi.mocked(useScrollSpy).mockReturnValue('home');
      render(<Header />);

      fireEvent.click(screen.getByLabelText('Abrir menu'));

      const mobileLinks = screen.getAllByText('Início');
      const mobileLink = mobileLinks[mobileLinks.length - 1].closest('a')!;
      const dot = mobileLink.querySelector('span.w-2.h-2.bg-primary-300.rounded-full');
      expect(dot).not.toBeNull();
    });
  });

  describe('scroll listener', () => {
    it('toggles scrolled state based on window.scrollY', () => {
      usePathnameMock.mockReturnValue('/');
      render(<Header />);

      // Note: re-query the header on each assertion instead of caching the
      // DOM node. The mocked `motion` proxy returns a brand-new component
      // reference on every render, so React fully remounts the <motion.header>
      // subtree whenever `scrolled` state changes and a cached reference
      // would go stale.
      expect(document.querySelector('header')!.className).toContain('bg-transparent');

      Object.defineProperty(window, 'scrollY', { value: 100, configurable: true });
      fireEvent.scroll(window);

      expect(document.querySelector('header')!.className).toContain('bg-dark-900/95');

      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      fireEvent.scroll(window);

      expect(document.querySelector('header')!.className).toContain('bg-transparent');
    });
  });
});
