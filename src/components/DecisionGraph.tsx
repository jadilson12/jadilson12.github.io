import React from 'react';
import Infographic, { InfographicNode } from './Infographic';

const decisionData: InfographicNode = {
  id: 'root',
  type: 'start',
  label: 'Novo Projeto Web',
  subLabel: 'Início',
  children: [
    {
      node: {
        id: 'seo',
        type: 'question',
        label: 'SEO é Crítico?',
        icon: '🔍',
        children: [
          {
            label: 'Sim',
            node: {
              id: 'next-mandatory',
              type: 'result',
              label: 'Next.js é Mandatório',
              highlight: 'emerald',
              children: [
                {
                  node: {
                    id: 'backend',
                    type: 'question',
                    label: 'Backend Complexo?',
                    icon: '⚙️',
                    children: [
                      {
                        label: 'Sim',
                        node: {
                          id: 'next-nest',
                          type: 'result',
                          label: 'Next.js (Front) + NestJS/Spring',
                          highlight: 'emerald'
                        }
                      },
                      {
                        label: 'Não',
                        node: {
                          id: 'next-fullstack',
                          type: 'result',
                          label: 'Next.js Fullstack (Server Actions)',
                          highlight: 'emerald'
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            label: 'Não (App Interno)',
            node: {
              id: 'team-react',
              type: 'question',
              label: 'Time conhece React?',
              icon: '👥',
              children: [
                {
                  label: 'Sim',
                  node: {
                    id: 'vite-react',
                    type: 'result',
                    label: 'Next.js ou Vite + React',
                    highlight: 'emerald'
                  }
                },
                {
                  label: 'Não',
                  node: {
                    id: 'angular-vue',
                    type: 'result',
                    label: 'Considerar Angular / Vue',
                    highlight: 'red'
                  }
                }
              ]
            }
          }
        ]
      }
    }
  ]
};

const DecisionGraph = () => {
  return <Infographic data={decisionData} />;
};

export default DecisionGraph;
