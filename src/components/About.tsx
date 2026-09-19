import React from 'react';

const About: React.FC = () => {
  return (
    <section id="sobre" className="pb-20 pt-24 md:pt-32">
      <div className="container-custom max-w-2xl">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">Sobre</h2>
        <div className="space-y-4 text-dark-300 leading-relaxed">
          <p>
            Sou o <strong className="text-white">Jadilson Guedes</strong>,
            Engenheiro de Software apaixonado por transformar ideias em
            sistemas que funcionam de verdade. Comecei na área em{' '}
            <strong className="text-primary-300">2006</strong> e, ao longo de
            mais de <strong className="text-primary-300">20 anos</strong>,
            passei por praticamente todos os papéis do ciclo de
            desenvolvimento: Programador, Analista de Sistemas, Arquiteto de
            Software e DevOps. Essa vivência me deu uma visão completa de como
            um produto nasce, cresce e se mantém saudável em produção.
          </p>

          <p>
            Hoje, acompanho um sistema de ponta a ponta: entendo o problema,
            desenho a solução, construo, entrego e sigo cuidando dela depois
            que está no ar. Para mim, o trabalho só termina quando o usuário
            está bem atendido, e não quando o código é entregue.
          </p>

          <p>
            Minha base é sólida em backend e microsserviços, com bom trânsito
            pelo frontend e pelas esteiras de integração e entrega contínua.
            Tenho também experiência com containerização e orquestração, o
            que permite construir sistemas escaláveis, com deploys previsíveis
            e menos sustos.
          </p>

          <p>
            Nos últimos anos, tenho me dedicado a integrar modelos de
            linguagem a sistemas reais, criando soluções de IA mais
            contextuais e úteis no dia a dia. Me interessa menos a novidade
            pela novidade e mais o que a IA resolve na prática: melhorar
            atendimento, ganhar eficiência e abrir possibilidades que antes
            não existiam.
          </p>

          <p>
            Trabalho com metodologias ágeis e levo a qualidade a sério. Testes
            automatizados fazem parte do processo desde o início, porque é
            isso que me dá confiança para entregar software confiável e
            evoluir sem medo de quebrar o que já funciona.
          </p>

          <p>
            Sou movido pela vontade de fazer bem feito. Gosto de aprender
            coisas novas, de me manter atualizado e, principalmente, de
            trabalhar em equipe: acredito que experiência técnica somada a
            colaboração é o que separa um time que apenas entrega de um time
            que entrega bem.
          </p>

          <p>
            Sou bacharel em Sistemas de Informação, com pós-graduação em
            Arquitetura de Full Cycle.
          </p>

          <p>
            Estou sempre aberto a conversar sobre arquitetura, IA aplicada e
            projetos desafiadores.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
