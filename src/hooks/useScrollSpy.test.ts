import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useScrollSpy } from './useScrollSpy';

function mockSection(id: string, top: number, height: number) {
  const el = document.createElement('div');
  el.id = id;
  Object.defineProperty(el, 'offsetTop', { value: top, configurable: true });
  Object.defineProperty(el, 'offsetHeight', { value: height, configurable: true });
  document.body.appendChild(el);
  return el;
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', { value, configurable: true, writable: true });
}

describe('useScrollSpy', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    setScrollY(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sets the first section active when scrolled to the top', () => {
    mockSection('a', 0, 200);
    mockSection('b', 200, 200);

    const { result } = renderHook(() => useScrollSpy(['a', 'b']));

    expect(result.current).toBe('a');
  });

  it('activates the section matching the current scroll position with default offset', () => {
    mockSection('a', 0, 200);
    mockSection('b', 200, 200);
    setScrollY(250);

    const { result } = renderHook(() => useScrollSpy(['a', 'b']));

    // scrollPosition = 250 + 100 (default offset) = 350, within b's [200, 400)
    expect(result.current).toBe('b');
  });

  it('respects a custom offset', () => {
    mockSection('a', 0, 200);
    mockSection('b', 200, 200);
    setScrollY(150);

    const { result } = renderHook(() => useScrollSpy(['a', 'b'], 0));

    // scrollPosition = 150 + 0 = 150, within a's [0, 200)
    expect(result.current).toBe('a');
  });

  it('updates the active section on scroll events, iterating from the last id first', () => {
    mockSection('a', 0, 200);
    mockSection('b', 200, 200);
    mockSection('c', 400, 200);
    setScrollY(0);

    const { result } = renderHook(() => useScrollSpy(['a', 'b', 'c'], 0));
    expect(result.current).toBe('a');

    act(() => {
      setScrollY(450);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe('c');
  });

  it('ignores ids that do not correspond to a rendered element', () => {
    // The loop walks the ids backwards, so put the missing id last so it is
    // checked (and skipped, since getElementById returns null) before 'b'.
    mockSection('b', 200, 200);
    setScrollY(250);

    const { result } = renderHook(() => useScrollSpy(['b', 'missing'], 0));

    expect(result.current).toBe('b');
  });

  it('falls back to empty string when scrolled past all sections and not at the top', () => {
    mockSection('a', 0, 100);
    setScrollY(500);

    const { result } = renderHook(() => useScrollSpy(['a'], 0));

    expect(result.current).toBe('');
  });

  it('defaults to the first section when near the top and no section matches yet', () => {
    // Sections start further down the page; scrollY is small (<100) so we
    // fall through the loop without a match and hit the "near top" fallback.
    mockSection('a', 500, 200);
    mockSection('b', 700, 200);
    setScrollY(0);

    const { result } = renderHook(() => useScrollSpy(['a', 'b']));

    expect(result.current).toBe('a');
  });

  it('removes the scroll listener on unmount', () => {
    mockSection('a', 0, 200);
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useScrollSpy(['a']));
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('re-subscribes when sectionIds or offset change', () => {
    mockSection('a', 0, 200);
    mockSection('b', 200, 200);
    const addSpy = vi.spyOn(window, 'addEventListener');

    const { rerender } = renderHook(
      ({ ids, offset }) => useScrollSpy(ids, offset),
      { initialProps: { ids: ['a'], offset: 100 } }
    );

    const callsBefore = addSpy.mock.calls.filter((c) => c[0] === 'scroll').length;

    rerender({ ids: ['a', 'b'], offset: 0 });

    const callsAfter = addSpy.mock.calls.filter((c) => c[0] === 'scroll').length;
    expect(callsAfter).toBeGreaterThan(callsBefore);
  });
});
