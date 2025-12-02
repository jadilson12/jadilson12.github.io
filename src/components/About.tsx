'use client';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import React, { useRef } from 'react';

const About: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section id="about" className="section relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-dots-pattern opacity-10" />

      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 gap-12 items-start"
        >
          {/* Left side - Image */}
          <motion.div variants={itemVariants} className="relative">
            <div className="relative z-10">
              {/* Profile image */}
              <motion.div
                className="relative aspect-square rounded-2xl overflow-hidden bg-dark-800 border-4 border-dark-700 shadow-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="https://github.com/jadilson12.png"
                  alt="Jadilson Guedes"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent" />
              </motion.div>

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-24 h-24 bg-primary-300/20 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                }}
              />
            </div>
          </motion.div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              className="space-y-4 text-dark-300 leading-relaxed"
            >
              <p>
                Engenheiro de Software com{' '}
                <strong className="text-primary-300">8+ anos</strong> altamente
                qualificado, com uma Pós-graduação em Arquitetura de Full Cycle.
                Possuo um conhecimento aprofundado em diversas linguagens e
                ecossistemas de backend, incluindo proficiência em tecnologias
                estabelecidas como{' '}
                <strong className="text-dark-200">Java</strong> (com frameworks
                avançados como Spring, Hibernate e JPA) e ampla experiência com
                o ecossistema <strong className="text-dark-200">Node.js</strong>{' '}
                (com proficiência em NestJS e TypeORM). Minha expertise inclui
                também o desenvolvimento de aplicações que utilizam frameworks
                de LLMs como{' '}
                <strong className="text-dark-200">LangChain</strong>, para a
                criação de sistemas de IA mais complexos e contextuais.
              </p>

              <p>
                Com expertise consolidada, focada na criação de soluções de
                backend robustas, pautadas em padrões de microsserviços. Minha
                proficiência se estende ao desenvolvimento frontend, onde
                utilizo tecnologias modernas como{' '}
                <strong className="text-dark-200">Angular</strong>,{' '}
                <strong className="text-dark-200">React</strong> e{' '}
                <strong className="text-dark-200">Next.js</strong>.
                Adicionalmente, possuo amplas habilidades na construção e
                otimização de pipelines de{' '}
                <strong className="text-dark-200">CI/CD</strong>, com domínio de
                ferramentas como GitLab e Github.
              </p>

              <p>
                Minhas competências técnicas incluem a implementação e o
                gerenciamento de aplicações containerizadas utilizando{' '}
                <strong className="text-dark-200">Docker</strong>, bem como a
                orquestração de sistemas escaláveis com{' '}
                <strong className="text-dark-200">Kubernetes</strong> e{' '}
                <strong className="text-dark-200">Helm</strong>. Isso assegura
                deployments facilitados e escalabilidade eficiente. Adoto a
                metodologia de desenvolvimento ágil e tenho um compromisso
                sólido com a qualidade do código, implementando rigorosamente
                testes unitários e de integração com ferramentas como JUnit,
                Mockito e Jest, fundamentais para a confiabilidade do software.
              </p>

              <p>
                Sou um profissional proativo e dedicado, busco a excelência na
                aplicação das melhores práticas da indústria. Tenho um foco
                contínuo no aprimoramento de novas tecnologias e metodologias.
                Minha experiência em diversas tecnologias, aliada à capacidade
                de atuar de forma colaborativa em equipes multidisciplinares, me
                torna um membro de grande valor para qualquer time de
                desenvolvimento de software.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <motion.a
                href="/blog"
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Blog
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
