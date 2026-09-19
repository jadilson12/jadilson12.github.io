import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// jsdom does not implement IntersectionObserver / ResizeObserver. Several
// components (FloatingTocButton, TableOfContents, BlogList) instantiate them
// directly, so we provide minimal stand-ins here instead of duplicating this
// boilerplate in every test file. Individual tests may still override
// `global.IntersectionObserver` with `vi.fn()` when they need to control or
// assert on the observer callback.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  readonly scrollMargin: string = '';
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

class ResizeObserverStub implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
vi.stubGlobal('ResizeObserver', ResizeObserverStub);

// jsdom's window.scrollTo throws a "Not implemented" console error when
// invoked; stub it out so components can call it freely.
window.scrollTo = vi.fn();
window.HTMLElement.prototype.scrollIntoView = vi.fn();

if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
