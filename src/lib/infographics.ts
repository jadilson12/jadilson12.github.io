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

export const decisionData: InfographicNode = {
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
                          highlight: 'emerald',
                        },
                      },
                      {
                        label: 'Não',
                        node: {
                          id: 'next-fullstack',
                          type: 'result',
                          label: 'Next.js Fullstack (Server Actions)',
                          highlight: 'emerald',
                        },
                      },
                    ],
                  },
                },
              ],
            },
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
                    highlight: 'emerald',
                  },
                },
                {
                  label: 'Não',
                  node: {
                    id: 'angular-vue',
                    type: 'result',
                    label: 'Considerar Angular / Vue',
                    highlight: 'red',
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

export const springBootData: InfographicNode = {
  id: 'root',
  type: 'start',
  label: 'Novo Projeto Backend',
  subLabel: 'Escolha da tecnologia',
  children: [
    {
      node: {
        id: 'cpu-performance',
        type: 'question',
        label: 'Requisito de Alta Performance CPU?',
        icon: '⚡',
        children: [
          {
            label: 'Sim',
            node: {
              id: 'java-kotlin',
              type: 'question',
              label: 'Ecossistema Java/Kotlin?',
              icon: '☕',
              children: [
                {
                  label: 'Sim',
                  node: {
                    id: 'enterprise-patterns',
                    type: 'question',
                    label: 'Necessita Padrões Enterprise?',
                    icon: '🏢',
                    children: [
                      {
                        label: 'Sim - Segurança/Transações',
                        node: {
                          id: 'spring-boot-ideal',
                          type: 'result',
                          label: 'Spring Boot é Ideal',
                          subLabel:
                            'Benefícios: Estabilidade, Segurança, Multi-threading',
                          highlight: 'emerald',
                        },
                      },
                      {
                        label: 'Não - Microsserviço Simples',
                        node: {
                          id: 'spring-or-alternatives',
                          type: 'result',
                          label: 'Spring Boot ou Quarkus/Micronaut',
                          highlight: 'blue',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            label: 'Não',
            node: {
              id: 'consider-alternatives',
              type: 'result',
              label: 'Considerar Node.js/Go',
              highlight: 'purple',
            },
          },
        ],
      },
    },
  ],
};
