'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const ContatoPageClient = () => {
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

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/jadilson12',
      icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
      color: 'hover:bg-[#333] hover:text-white',
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/jadilson12/',
      icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
      color: 'hover:bg-[#0077b5] hover:text-white',
    },
    {
      name: 'Twitter/X',
      href: 'https://x.com/jadilson',
      icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
      color: 'hover:bg-[#000000] hover:text-white',
    },
  ];

  return (
    <section id="contato" className="snap-section relative overflow-hidden bg-dark-950 flex items-center justify-center">
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />

        <div className="container-custom relative z-10">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="max-w-4xl mx-auto"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Vamos <span className="text-primary-300">Conversar</span>?
              </h1>
              <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto leading-relaxed">
                Tem um projeto em mente? Quer discutir sobre tecnologia? Estou sempre
                aberto para novas conversas e oportunidades!
              </p>
            </motion.div>

            {/* Email Card */}
            <motion.div variants={itemVariants} className="mb-12">
              <div className="card p-8 md:p-10 text-center card-hover">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-primary-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  E-mail
                </h2>
                <a
                  href="mailto:contato@jadilson.dev"
                  className="text-xl md:text-2xl text-primary-300 hover:text-primary-400 transition-colors duration-200 break-all"
                >
                  contato@jadilson.dev
                </a>
                <p className="text-dark-400 mt-4">
                  Respondo geralmente em até 24 horas
                </p>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
                Me Siga nas Redes Sociais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`card p-8 text-center card-hover ${social.color} transition-all duration-300`}
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  >
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-primary-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {social.name}
                    </h3>
                    <p className="text-dark-400 text-sm">@jadilson12</p>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* CTA Bottom */}
            <motion.div
              variants={itemVariants}
              className="mt-12 text-center"
            >
              <p className="text-lg text-dark-300 mb-6">
                Prefere uma conversa rápida? Me chame em qualquer rede social!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="https://www.linkedin.com/in/jadilson12/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Conectar no LinkedIn
                </motion.a>
                <motion.a
                  href="https://github.com/jadilson12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ver GitHub
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
  );
};

export default ContatoPageClient;
