/* oxlint-disable jsx-a11y/no-noninteractive-tabindex -- Scrollable code, tables and diagrams need keyboard focus for arrow-key scrolling. */
'use client';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import Modal from './Modal';

// --- Types ---

import type { InfographicNode } from '@/lib/infographics';
export type {
  InfographicNode,
  InfographicEdge,
  NodeType,
} from '@/lib/infographics';

export interface InfographicProps {
  data: InfographicNode;
}

// --- Components ---

const Card = ({
  node,
  delay = 0,
}: {
  node: InfographicNode;
  delay?: number;
}) => {
  const colors = {
    start: 'bg-blue-500/20 border-blue-500/50 text-blue-100',
    question: 'bg-purple-500/20 border-purple-500/50 text-purple-100',
    result: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100',
    default: 'bg-dark-800 border-dark-700 text-dark-200',
  };

  // Override colors based on highlight prop if present
  const highlightColors = {
    emerald: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100',
    blue: 'bg-blue-500/20 border-blue-500/50 text-blue-100',
    purple: 'bg-purple-500/20 border-purple-500/50 text-purple-100',
    red: 'bg-red-500/20 border-red-500/50 text-red-100',
    default: colors[node.type] || colors.default,
  };

  const className = node.highlight
    ? highlightColors[node.highlight]
    : colors[node.type] || colors.default;

  return (
    <motion.div
      initial={false}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`p-3 md:p-4 rounded-xl border backdrop-blur-sm shadow-xl ${className} flex flex-col items-center justify-center text-center min-h-[70px] md:min-h-[80px] min-w-[120px] md:min-w-[160px] max-w-[200px] md:max-w-[240px] relative z-10`}
    >
      {node.subLabel && (
        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">
          {node.subLabel}
        </span>
      )}
      {node.icon && (
        <span className="text-xl md:text-2xl mb-1 md:mb-2 block">
          {node.icon}
        </span>
      )}
      <span
        className={`font-bold ${node.type === 'question' ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}
      >
        {node.label}
      </span>
    </motion.div>
  );
};

// Recursive Tree Renderer
const TreeNode = ({
  node,
  edgeLabel,
  depth = 0,
}: {
  node: InfographicNode;
  edgeLabel?: string;
  depth?: number;
}) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Connection Line from Parent (if not root) */}
      {edgeLabel && (
        <div className="flex flex-col items-center">
          <div className="h-4 md:h-6 w-px bg-dark-600" />
          <div className="relative">
            <span className="bg-dark-900 px-1.5 md:px-2 py-0.5 text-[9px] md:text-[10px] uppercase tracking-wider text-dark-400 font-semibold border border-dark-700 rounded-full z-20 relative">
              {edgeLabel}
            </span>
          </div>
          <div className="h-4 md:h-6 w-px bg-dark-600" />
        </div>
      )}

      {/* The Node Card */}
      <Card node={node} delay={depth * 0.1} />

      {/* Children */}
      {hasChildren && (
        <div className="flex flex-col items-center">
          {/* Vertical line from node to children bus */}
          <div className="h-6 md:h-8 w-px bg-dark-600" />

          {/* Children Container */}
          <div className="flex justify-center gap-4 md:gap-8 relative">
            {/* Horizontal Bus Line */}
            {node.children!.length > 1 && (
              <div
                className="absolute top-0 left-0 right-0 h-px bg-dark-600 mx-[25%]"
                style={{
                  // This CSS hack attempts to span the line between the centers of the first and last child.
                  // A more robust solution involves calculating widths, but for a generic component,
                  // we can use a pseudo-element on the children container or just rely on the visual structure.
                  // Let's use a simpler approach:
                  // The horizontal line should be drawn by the children themselves (connect up).
                }}
              />
            )}

            {/* Render Children */}
            {node.children!.map((edge, index) => (
              <div key={index} className="flex flex-col items-center relative">
                {/* Horizontal Connector Logic:
                    We need a horizontal line connecting all children at the top.
                    We can draw a line at the top of each child container that connects to the center.
                */}
                {node.children!.length > 1 && (
                  <>
                    {/* Left half line */}
                    <div
                      className={`absolute top-0 right-1/2 h-px bg-dark-600 ${index === 0 ? 'w-0' : 'w-1/2'}`}
                    />
                    {/* Right half line */}
                    <div
                      className={`absolute top-0 left-1/2 h-px bg-dark-600 ${index === node.children!.length - 1 ? 'w-0' : 'w-1/2'}`}
                    />
                  </>
                )}

                {/* Vertical line down from the horizontal bus */}
                {node.children!.length > 1 && (
                  <div className="h-4 md:h-6 w-px bg-dark-600" />
                )}

                <TreeNode
                  node={edge.node}
                  edgeLabel={edge.label}
                  depth={depth + 1}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GraphContent = ({ data }: { data: InfographicNode }) => (
  <div className="w-full min-w-0 p-4 md:p-8 flex justify-center">
    <TreeNode node={data} />
  </div>
);

function ZoomableContainer({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState(1);
  return (
    <div className="min-w-0 py-4">
      <div className="mb-3 flex flex-wrap items-center gap-2 px-4">
        <button
          type="button"
          aria-label="Diminuir zoom"
          disabled={scale <= 0.5}
          onClick={() => setScale(value => Math.max(0.5, value - 0.25))}
          className="min-h-11 min-w-11 rounded-lg bg-dark-800 disabled:opacity-40"
        >
          −
        </button>
        <button
          type="button"
          aria-label="Restaurar zoom"
          onClick={() => setScale(1)}
          className="min-h-11 rounded-lg bg-dark-800 px-3"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          type="button"
          aria-label="Aumentar zoom"
          disabled={scale >= 2}
          onClick={() => setScale(value => Math.min(2, value + 0.25))}
          className="min-h-11 min-w-11 rounded-lg bg-dark-800 disabled:opacity-40"
        >
          +
        </button>
        <span className="text-xs text-dark-300">
          Role na horizontal para explorar.
        </span>
      </div>
      <section
        aria-label="Diagrama interativo"
        tabIndex={0}
        className="max-h-[70dvh] max-w-full overflow-auto overscroll-x-contain"
      >
        <div className="w-max min-w-full" style={{ zoom: scale }}>
          {children}
        </div>
      </section>
    </div>
  );
}

export default function Infographic({ data }: InfographicProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="my-6 min-w-0 rounded-xl border border-dark-700 bg-dark-900">
        <div className="flex items-center justify-between gap-3 border-b border-dark-700 px-4 py-2">
          <span className="text-sm font-semibold">Infográfico</span>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-haspopup="dialog"
            className="min-h-11 rounded-lg px-3 text-sm text-primary-300 hover:bg-dark-800"
          >
            Expandir infográfico
          </button>
        </div>
        <ZoomableContainer>
          <GraphContent data={data} />
        </ZoomableContainer>
      </div>
      {isOpen && (
        <Modal title="Infográfico" onClose={() => setIsOpen(false)}>
          <ZoomableContainer>
            <GraphContent data={data} />
          </ZoomableContainer>
        </Modal>
      )}
    </>
  );
}
