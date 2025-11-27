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
          console.log('Rendering mermaid chart:', chart);
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            console.log('Mermaid chart rendered successfully');
          }
        } catch (error) {
          console.error('Error rendering mermaid chart:', error);
          console.log('Failed chart content:', chart);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="mermaid-error" style="color: #ef4444; background: #1a1a1a; padding: 1rem; border-radius: 0.5rem; border: 1px solid #404040;">
<strong>Erro ao renderizar diagrama Mermaid:</strong><br />
${error instanceof Error ? error.message : 'Erro desconhecido'}
</div>`;
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
