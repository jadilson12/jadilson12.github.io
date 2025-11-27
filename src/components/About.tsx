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
          className="grid md:grid-cols-2 gap-12 items-center"
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
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-2 mb-4 text-sm font-medium text-primary-300 bg-primary-300/10 rounded-full border border-primary-300/20">
                Sobre Mim
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                Transformando Ideias em{' '}
                <span className="text-gradient-primary">Realidade</span>
              </h2>
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg text-dark-300 leading-relaxed">
              Sou um engenheiro de software apaixonado por Sistemas de Informação, com foco em criar
              experiências digitais excepcionais. Trabalho com uma ampla gama de tecnologias modernas
              e estou sempre aberto a aprender novas ferramentas e ajudar a comunidade com questões técnicas.
            </motion.p>

            <motion.p variants={itemVariants} className="text-lg text-dark-300 leading-relaxed">
              Minha jornada na tecnologia me levou a dominar tecnologias como React, TypeScript,
              NestJS, AdonisJS, Python e PostgreSQL. Com mais de 100 repositórios públicos no GitHub,
              contribuo ativamente para a comunidade open-source e compartilho conhecimento.
            </motion.p>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6 pt-4">
              {[
                { label: 'Repositórios', value: '101' },
                { label: 'Seguidores', value: '147' },
                { label: 'Projetos Open Source', value: '50+' },
                { label: 'Tecnologias', value: '10+' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="card p-6 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-3xl font-bold text-primary-300 mb-2">{stat.value}</div>
                  <div className="text-sm text-dark-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4">
              <motion.a
                href="#contato"
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Vamos Trabalhar Juntos
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
