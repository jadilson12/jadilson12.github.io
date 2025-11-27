'use client';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

// --- Types ---

export type NodeType = 'start' | 'question' | 'result' | 'default';

export interface InfographicNode {
  id: string;
  type: NodeType;
  label: string;
  icon?: string;
  subLabel?: string;
  highlight?: 'emerald' | 'blue' | 'purple' | 'red' | 'default';
  children?: InfographicEdge[];
}

export interface InfographicEdge {
  label?: string; // e.g. "Sim", "Não"
  node: InfographicNode;
}

export interface InfographicProps {
  data: InfographicNode;
}

// --- Components ---

const Card = ({
  node,
  delay = 0
}: {
  node: InfographicNode;
  delay?: number
}) => {
  const colors = {
    start: 'bg-blue-500/20 border-blue-500/50 text-blue-100',
    question: 'bg-purple-500/20 border-purple-500/50 text-purple-100',
    result: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100',
    default: 'bg-dark-800 border-dark-700 text-dark-200'
  };

  // Override colors based on highlight prop if present
  const highlightColors = {
    emerald: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-100',
    blue: 'bg-blue-500/20 border-blue-500/50 text-blue-100',
    purple: 'bg-purple-500/20 border-purple-500/50 text-purple-100',
    red: 'bg-red-500/20 border-red-500/50 text-red-100',
    default: colors[node.type] || colors.default
  };

  const className = node.highlight ? highlightColors[node.highlight] : (colors[node.type] || colors.default);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={`p-4 rounded-xl border backdrop-blur-sm shadow-xl ${className} flex flex-col items-center justify-center text-center min-h-[80px] min-w-[160px] max-w-[240px] relative z-10`}
    >
      {node.subLabel && (
        <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">
          {node.subLabel}
        </span>
      )}
      {node.icon && <span className="text-2xl mb-2 block">{node.icon}</span>}
      <span className={`font-bold ${node.type === 'question' ? 'text-base' : 'text-sm'}`}>
        {node.label}
      </span>
    </motion.div>
  );
};

// Recursive Tree Renderer
const TreeNode = ({
  node,
  edgeLabel,
  depth = 0
}: {
  node: InfographicNode;
  edgeLabel?: string;
  depth?: number
}) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Connection Line from Parent (if not root) */}
      {edgeLabel && (
        <div className="flex flex-col items-center">
          <div className="h-6 w-px bg-dark-600" />
          <div className="relative">
            <span className="bg-dark-900 px-2 py-0.5 text-[10px] uppercase tracking-wider text-dark-400 font-semibold border border-dark-700 rounded-full z-20 relative">
              {edgeLabel}
            </span>
          </div>
          <div className="h-6 w-px bg-dark-600" />
        </div>
      )}

      {/* The Node Card */}
      <Card node={node} delay={depth * 0.1} />

      {/* Children */}
      {hasChildren && (
        <div className="flex flex-col items-center">
          {/* Vertical line from node to children bus */}
          <div className="h-8 w-px bg-dark-600" />

          {/* Children Container */}
          <div className="flex justify-center gap-8 relative">
            {/* Horizontal Bus Line */}
            {node.children!.length > 1 && (
              <div className="absolute top-0 left-0 right-0 h-px bg-dark-600 mx-[25%]"
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
                    <div className={`absolute top-0 right-1/2 h-px bg-dark-600 ${index === 0 ? 'w-0' : 'w-1/2'}`} />
                    {/* Right half line */}
                    <div className={`absolute top-0 left-1/2 h-px bg-dark-600 ${index === node.children!.length - 1 ? 'w-0' : 'w-1/2'}`} />
                  </>
                )}

                {/* Vertical line down from the horizontal bus */}
                {node.children!.length > 1 && <div className="h-6 w-px bg-dark-600" />}

                <TreeNode node={edge.node} edgeLabel={edge.label} depth={depth + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GraphContent = ({ data }: { data: InfographicNode }) => (
  <div className="min-w-[800px] p-8 flex justify-center">
    <TreeNode node={data} />
  </div>
);

const Infographic = ({ data }: InfographicProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to render portal safely
  const Portal = ({ children }: { children: React.ReactNode }) => {
    if (typeof document === 'undefined') return null;
    return createPortal(children, document.body);
  };

  return (
    <>
      <div className="w-full relative group">
        <div className="w-full overflow-x-auto py-12 px-4 bg-dark-900/50 rounded-2xl border border-dark-800 my-8 scrollbar-thin scrollbar-thumb-dark-700 scrollbar-track-transparent">
          <GraphContent data={data} />
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-4 right-4 p-2 bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white rounded-lg border border-dark-700 transition-colors shadow-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Expandir Infográfico"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      <Portal>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-dark-950/90 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 md:p-8"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-dark-900 rounded-2xl border border-dark-700 shadow-2xl p-8 md:p-12 max-w-[95vw] max-h-[90vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 p-2 text-dark-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="min-w-[1000px] flex justify-center">
                  <GraphContent data={data} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
};

export default Infographic;
