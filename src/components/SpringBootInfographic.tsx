import Infographic, { type InfographicNode } from './Infographic';

// Keep structured data in code so MDX can retain its default JavaScript blocking.
const springBootData: InfographicNode = {
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
                          subLabel: 'Benefícios: Estabilidade, Segurança, Multi-threading',
                          highlight: 'emerald'
                        }
                      },
                      {
                        label: 'Não - Microsserviço Simples',
                        node: {
                          id: 'spring-or-alternatives',
                          type: 'result',
                          label: 'Spring Boot ou Quarkus/Micronaut',
                          highlight: 'blue'
                        }
                      }
                    ]
                  }
                }
              ]
            }
          },
          {
            label: 'Não',
            node: {
              id: 'consider-alternatives',
              type: 'result',
              label: 'Considerar Node.js/Go',
              highlight: 'purple'
            }
          }
        ]
      }
    }
  ]
};

export default function SpringBootInfographic() {
  return <Infographic data={springBootData} />;
}
