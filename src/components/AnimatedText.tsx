'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedTextProps {
  children: string;
  className?: string;
  delay?: number;
  variant?: 'fade' | 'slideUp' | 'reveal' | 'shimmer';
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  staggerDelay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  className = '',
  delay = 0,
  variant = 'fade',
  as: Component = 'p',
  staggerDelay = 0.03,
}) => {
  const easing = [0.6, 0.01, 0.05, 0.95];

  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 0.4,
        },
      },
    },
    slideUp: {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
        },
      },
    },
    reveal: {
      hidden: { opacity: 0, y: 50, rotateX: 90 },
      visible: {
        opacity: 1,
        y: 0,
        rotateX: 0,
        transition: {
          duration: 0.6,
        },
      },
    },
  };

  // Para o efeito shimmer, renderizamos o texto completo com um gradiente animado
  if (variant === 'shimmer') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.5 }}
        className="relative inline-block"
      >
        <Component className={className}>
          <span className="relative inline-block">
            {children}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              style={{
                backgroundSize: '200% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 2,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              {children}
            </motion.span>
          </span>
        </Component>
      </motion.div>
    );
  }

  // Para outros variants, animamos caractere por caractere
  const characters = children.split('');
  const selectedVariants = variants[variant];

  return (
    <Component className={className}>
      <span className="inline-block">
        {characters.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            variants={selectedVariants}
            initial="hidden"
            animate="visible"
            transition={{
              delay: delay + index * staggerDelay,
            }}
            className="inline-block"
            style={{
              display: char === ' ' ? 'inline' : 'inline-block',
              whiteSpace: 'pre',
            }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </Component>
  );
};

// Componente para efeito de palavras (mais rápido que caracteres)
export const AnimatedWords: React.FC<AnimatedTextProps> = ({
  children,
  className = '',
  delay = 0,
  as: Component = 'p',
}) => {
  const words = children.split(' ');

  return (
    <Component className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            delay: delay + index * 0.05,
            duration: 0.5,
          }}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ))}
    </Component>
  );
};

// Componente para texto com gradiente animado
export const GradientText: React.FC<{
  children: ReactNode;
  className?: string;
  animate?: boolean;
}> = ({ children, className = '', animate = true }) => {
  return (
    <motion.span
      className={`bg-gradient-to-r from-primary-200 via-primary-300 to-primary-400 bg-clip-text text-transparent ${className}`}
      style={{
        backgroundSize: animate ? '200% 100%' : '100% 100%',
      }}
      animate={
        animate
          ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }
          : {}
      }
      transition={{
        duration: 5,
        ease: 'linear',
        repeat: Infinity,
      }}
    >
      {children}
    </motion.span>
  );
};

export default AnimatedText;
