'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import React, { useRef } from 'react';
import AnimatedText, { AnimatedWords, GradientText } from './AnimatedText';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Simplified parallax effects for better performance
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-24 md:pt-0"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/50 to-dark-900" />

      {/* Simplified gradient orbs - static for better performance */}
      <div className="absolute top-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-primary-300/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-primary-500/10 rounded-full blur-3xl" />

      {/* Content - simplified animations */}
      <motion.div
        className="container-custom relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity }}
      >
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold mb-4 md:mb-6 leading-tight">
            Olá, eu sou <GradientText animate={true}>Jadilson Guedes</GradientText>
          </h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-dark-300 mb-3 md:mb-6 max-w-3xl mx-auto leading-relaxed"
          >
            Engenheiro de Software com <span className="text-primary-300 font-semibold">8+ anos</span> de experiência
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg text-dark-400 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Arquitetando e desenvolvendo <span className="text-primary-300">soluções robustas e escaláveis</span> do código à produção
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4 mb-8 md:mb-12 max-w-md sm:max-w-none mx-auto"
          >
            <Link href="/sobre" className="relative group w-full sm:w-auto">
              <motion.div
                className="btn btn-primary relative overflow-hidden w-full sm:w-auto text-center min-h-[48px] flex items-center justify-center px-6"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(201, 243, 29, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative z-10 text-sm sm:text-base">Saiba Mais Sobre Mim</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-300"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>
            <Link href="/blog" className="relative group w-full sm:w-auto">
              <motion.div
                className="btn btn-secondary backdrop-blur-sm relative overflow-hidden w-full sm:w-auto text-center min-h-[48px] flex items-center justify-center px-6"
                whileHover={{ scale: 1.05, borderColor: 'rgba(201, 243, 29, 0.6)' }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <span className="relative z-10 text-sm sm:text-base">Ver Blog</span>
              </motion.div>
            </Link>
          </motion.div>

          {/* Key Highlights */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 max-w-6xl mx-auto"
          >
            <motion.div
              className="card p-4 md:p-6 text-center"
              whileHover={{ y: -4, borderColor: 'rgba(201, 243, 29, 0.3)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-primary-300 text-xl md:text-3xl font-bold mb-1 md:mb-2">
                Frontend
              </div>
              <p className="text-dark-400 text-xs md:text-sm leading-relaxed">
                Interfaces visuais inovadoras com experiências imersivas e responsivas
              </p>
            </motion.div>

            <motion.div
              className="card p-4 md:p-6 text-center"
              whileHover={{ y: -4, borderColor: 'rgba(201, 243, 29, 0.3)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-primary-300 text-xl md:text-3xl font-bold mb-1 md:mb-2">
                Serviços
              </div>
              <p className="text-dark-400 text-xs md:text-sm leading-relaxed">
                Arquiteturas distribuídas escaláveis com padrões de design robustos
              </p>
            </motion.div>

            <motion.div
              className="card p-4 md:p-6 text-center"
              whileHover={{ y: -4, borderColor: 'rgba(201, 243, 29, 0.3)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-primary-300 text-xl md:text-3xl font-bold mb-1 md:mb-2">
                Integração IA
              </div>
              <p className="text-dark-400 text-xs md:text-sm leading-relaxed">
                Sistemas inteligentes contextuais que transformam dados em decisões
              </p>
            </motion.div>

            <motion.div
              className="card p-4 md:p-6 text-center"
              whileHover={{ y: -4, borderColor: 'rgba(201, 243, 29, 0.3)' }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-primary-300 text-xl md:text-3xl font-bold mb-1 md:mb-2">
                DevOps
              </div>
              <p className="text-dark-400 text-xs md:text-sm leading-relaxed">
                Automação de deploy, containerização e orquestração para entregas ágeis
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator with premium styling */}
      <motion.div
        className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:flex"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]),
        }}
      >
        <motion.div
          className="flex flex-col items-center gap-3 cursor-pointer group"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-xs text-dark-400 uppercase tracking-wider group-hover:text-primary-300 transition-colors duration-300">
            Role para Baixo
          </span>
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-dark-400 group-hover:border-primary-300 flex items-start justify-center p-2 transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-primary-300 rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
