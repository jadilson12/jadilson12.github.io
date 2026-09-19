import React from 'react';

const About: React.FC = () => {
  return (
    <section id="sobre" className="pb-20 pt-24 md:pt-32">
      <div className="container-custom max-w-2xl">
        <h2 className="mb-6 text-3xl font-bold md:text-4xl">Sobre</h2>
        <div className="space-y-4 text-dark-300 leading-relaxed">
          <p>
            Sou o <strong className="text-white">Jadilson Guedes</strong>,
            Engenheiro de Software apaixonado por tecnologia. Comecei a
            trabalhar na área em{' '}
            <strong className="text-primary-300">2006</strong> e, de lá pra
            cá, já são <strong className="text-primary-300">20+ anos</strong>{' '}
            de estrada na profissão. Sou bacharel em Sistemas de Informação e
            fiz uma Pós-graduação em Arquitetura de Full Cycle. Nesse caminho
            já passei por Programador, Analista de Sistemas, Arquiteto de
            Software e DevOps. Atualmente, toco todo o fluxo de um sistema,
            do zero até colocar em produção.
          </p>

          <p>
            Ao longo desse tempo, construí bastante experiência com backend,
            microsserviços e, mais recentemente, com a integração de modelos
            de linguagem para criar sistemas de IA mais complexos e
            contextuais. Também transito bem pelo frontend e por pipelines de
            integração e entrega contínua — gosto de acompanhar um produto do
            planejamento até a produção.
          </p>

          <p>
            Tenho experiência também com containerização e orquestração de
            sistemas escaláveis, o que facilita deployments e garante
            escalabilidade. Sigo metodologias ágeis e levo a sério a
            qualidade do código, com testes automatizados fazendo parte do
            processo — é o que me dá confiança pra entregar software
            confiável.
          </p>

          <p>
            Sou movido pela vontade de fazer bem feito: gosto de me manter
            atualizado, de aprender coisas novas e de trabalhar em equipe.
            Acredito que essa combinação de experiência técnica com
            colaboração é o que faz a diferença em qualquer time de
            desenvolvimento.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
