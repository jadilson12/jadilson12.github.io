'use client';
import mermaid from 'mermaid';
import React, { useEffect, useRef } from 'react';

interface MermaidProps {
  chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        themeVariables: {
          primaryColor: '#c9f31d',
          primaryTextColor: '#0a0a0a',
          primaryBorderColor: '#c9f31d',
          lineColor: '#c9f31d',
          secondaryColor: '#1a1a1a',
          tertiaryColor: '#0a0a0a',
          background: '#0a0a0a',
          mainBkg: '#1a1a1a',
          secondBkg: '#262626',
          tertiaryBkg: '#0a0a0a',
          edgeLabelBackground: '#1a1a1a',
          textColor: '#f5f5f5',
          fontSize: '16px',
          nodeBorder: '#c9f31d',
          clusterBkg: '#262626',
          clusterBorder: '#404040',
          defaultLinkColor: '#c9f31d',
          titleColor: '#f5f5f5',
          nodeTextColor: '#f5f5f5',
        },
        fontFamily: 'var(--font-sans), Inter, system-ui, sans-serif',
      });
    }
  }, []);

  useEffect(() => {
    if (containerRef.current && chart) {
      const renderChart = async () => {
        try {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
          }
        } catch (error) {
          console.error('Error rendering mermaid chart:', error);
          if (containerRef.current) {
            containerRef.current.textContent =
              'Não foi possível exibir este diagrama. Recarregue a página para tentar novamente.';
          }
        }
      };

      renderChart();
    }
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="mermaid-container my-8 p-6 bg-dark-800 rounded-xl border border-dark-700 overflow-x-auto"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    />
  );
};

export default Mermaid;
