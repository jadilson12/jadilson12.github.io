import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

import Infographic, { InfographicNode } from './Infographic';

// A tree crafted to exercise every Card/TreeNode branch in a single render:
// - root: no edgeLabel (is root), 3 children (length > 1 -> bus line + first/last/middle index branches),
//   type 'start' (colors[node.type] truthy, no highlight), has subLabel, no icon.
// - child0 ("Question Node"): edgeLabel present, type 'question' (font-size branch), icon present,
//   no subLabel, no highlight, no children (leaf).
// - child1 ("Unknown Type Node"): type cast to an invalid key to force colors[node.type] undefined
//   -> falls back to colors.default. No subLabel/icon/highlight. Has exactly 1 child (length>1 false).
//   - grandchild ("Result Leaf"): edgeLabel present, highlight 'purple' (highlightColors branch),
//     subLabel + icon present, no children.
// - child2 ("Third Child"): edgeLabel present, highlight 'red', no subLabel/icon, no children.
const tree: InfographicNode = {
  id: 'root',
  type: 'start',
  label: 'Root Label',
  subLabel: 'Root Sub',
  children: [
    {
      label: 'Edge0',
      node: {
        id: 'c0',
        type: 'question',
        label: 'Question Node',
        icon: '❓',
      },
    },
    {
      label: 'Edge1',
      node: {
        id: 'c1',
        type: 'weird-type' as unknown as InfographicNode['type'],
        label: 'Unknown Type Node',
        children: [
          {
            label: 'Edge1a',
            node: {
              id: 'c1a',
              type: 'result',
              label: 'Result Leaf',
              subLabel: 'Leaf Sub',
              icon: '✅',
              highlight: 'purple',
            },
          },
        ],
      },
    },
    {
      label: 'Edge2',
      node: {
        id: 'c2',
        type: 'result',
        label: 'Third Child',
        highlight: 'red',
      },
    },
  ],
};

afterEach(cleanup);

describe('Infographic', () => {
  it('renders the full tree with all card/edge/branch variations', () => {
    render(<Infographic data={tree} />);

    expect(screen.getByText('Root Label')).toBeInTheDocument();
    expect(screen.getByText('Root Sub')).toBeInTheDocument();
    expect(screen.getByText('Question Node')).toBeInTheDocument();
    expect(screen.getByText('❓')).toBeInTheDocument();
    expect(screen.getByText('Unknown Type Node')).toBeInTheDocument();
    expect(screen.getByText('Result Leaf')).toBeInTheDocument();
    expect(screen.getByText('Leaf Sub')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
    expect(screen.getByText('Third Child')).toBeInTheDocument();
    expect(screen.getByText('Edge0')).toBeInTheDocument();
    expect(screen.getByText('Edge1')).toBeInTheDocument();
    expect(screen.getByText('Edge1a')).toBeInTheDocument();
    expect(screen.getByText('Edge2')).toBeInTheDocument();
  });

  it('hits the touchmove pinch false-branch when no prior touchstart set a distance', () => {
    const { container } = render(<Infographic data={tree} />);
    const el = container.querySelector('.overflow-hidden.select-none') as HTMLElement;
    // Fire a 2-touch move with no preceding touchstart: touchStartDistance.current is
    // still 0, so the `if (touchStartDistance.current > 0)` guard is false.
    fireEvent.touchMove(el, {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 50, clientY: 0 },
      ],
    });
    fireEvent.touchEnd(el, {});
    // No crash, no visible change expected.
    expect(screen.getByText('Root Label')).toBeInTheDocument();
  });

  it('exercises the ZoomableContainer zoom/pan/drag interactions and clamping', () => {
    const { container } = render(<Infographic data={tree} />);
    const el = container.querySelector('.overflow-hidden.select-none') as HTMLElement;
    const zoomIn = screen.getByTitle('Aumentar Zoom');
    const zoomOut = screen.getByTitle('Diminuir Zoom');
    const zoomReset = screen.getByTitle('Resetar Zoom');

    expect(zoomReset.textContent).toBe('100%');

    // mouseDown while scale === 1 (no-op branch: `if (scale > 1)` false)
    fireEvent.mouseDown(el, { clientX: 0, clientY: 0 });
    // mouseMove while isDragging is false (no-op branch)
    fireEvent.mouseMove(el, { clientX: 10, clientY: 10 });
    fireEvent.mouseUp(el);
    fireEvent.mouseLeave(el);

    // Single-touch touchstart/touchmove while scale is still 1 (false branches of
    // `scale > 1` in both handleTouchStart and handleTouchMove).
    fireEvent.touchStart(el, { touches: [{ clientX: 5, clientY: 5 }] });
    fireEvent.touchMove(el, { touches: [{ clientX: 15, clientY: 15 }] });
    fireEvent.touchEnd(el, {});
    expect(zoomReset.textContent).toBe('100%');

    // Pinch zoom start/move/end (2 touches), growing distance -> scale increases.
    fireEvent.touchStart(el, {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 100, clientY: 0 },
      ],
    });
    fireEvent.touchMove(el, {
      touches: [
        { clientX: 0, clientY: 0 },
        { clientX: 150, clientY: 0 },
      ],
    });
    fireEvent.touchEnd(el, {});
    expect(zoomReset.textContent).not.toBe('100%');

    // Reset zoom via button.
    fireEvent.click(zoomReset);
    expect(zoomReset.textContent).toBe('100%');

    // Zoom in 3 times -> scale 1.75.
    fireEvent.click(zoomIn);
    fireEvent.click(zoomIn);
    fireEvent.click(zoomIn);
    expect(zoomReset.textContent).toBe('175%');

    // mouseMove while isDragging is false but scale > 1 (still a no-op branch).
    fireEvent.mouseMove(el, { clientX: 40, clientY: 40 });

    // Single-touch pan now that scale > 1 (isDragging gets set true, then pans).
    fireEvent.touchStart(el, { touches: [{ clientX: 10, clientY: 10 }] });
    fireEvent.touchMove(el, { touches: [{ clientX: 20, clientY: 20 }] });
    fireEvent.touchEnd(el, {});

    // Mouse drag now that scale > 1.
    fireEvent.mouseDown(el, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(el, { clientX: 30, clientY: 30 });
    fireEvent.mouseUp(el);
    fireEvent.mouseLeave(el);

    // Zoom in ceiling clamp (many clicks -> caps at 3.0).
    for (let i = 0; i < 10; i += 1) {
      fireEvent.click(zoomIn);
    }
    expect(zoomReset.textContent).toBe('300%');

    // Zoom out floor clamp (many clicks -> caps at 0.5).
    for (let i = 0; i < 20; i += 1) {
      fireEvent.click(zoomOut);
    }
    expect(zoomReset.textContent).toBe('50%');
  });

  it('opens the expand modal, keeps it open on inner click, and closes on backdrop click', () => {
    render(<Infographic data={tree} />);

    fireEvent.click(screen.getByTitle('Expandir Infográfico'));
    const heading = screen.getByText('Infográfico');
    expect(heading).toBeInTheDocument();

    const innerBox = heading.closest('[class*="bg-dark-900"]') as HTMLElement;
    expect(innerBox).toBeTruthy();
    const backdrop = innerBox.parentElement as HTMLElement;

    // Clicking inside the modal box should stopPropagation and keep it open.
    fireEvent.click(innerBox);
    expect(screen.getByText('Infográfico')).toBeInTheDocument();

    // Clicking the backdrop itself should close it.
    fireEvent.click(backdrop);
    expect(screen.queryByText('Infográfico')).not.toBeInTheDocument();
  });

  it('closes the expand modal via the explicit close (X) button', () => {
    render(<Infographic data={tree} />);

    fireEvent.click(screen.getByTitle('Expandir Infográfico'));
    expect(screen.getByText('Infográfico')).toBeInTheDocument();

    const closeBtn = document
      .querySelector('path[d="M6 18L18 6M6 6l12 12"]')
      ?.closest('button') as HTMLElement;
    expect(closeBtn).toBeTruthy();
    fireEvent.click(closeBtn);

    expect(screen.queryByText('Infográfico')).not.toBeInTheDocument();
  });
});
