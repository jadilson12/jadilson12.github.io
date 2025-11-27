'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // Animação de entrada do logo
      await controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] },
      });

      // Hold
      await new Promise(resolve => setTimeout(resolve, 800));

      // Animação de saída
      await controls.start({
        opacity: 0,
        scale: 1.2,
        filter: 'blur(20px)',
        transition: { duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] },
      });

      setIsComplete(true);
      onComplete();
    };

    sequence();
  }, [controls, onComplete]);

  if (isComplete) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isComplete ? 0 : 1 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-dark-950"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -inset-[100px] opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(201, 243, 29, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(201, 243, 29, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(201, 243, 29, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(201, 243, 29, 0.3) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </div>

      {/* Logo/Initial Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={controls}
        className="relative z-10"
      >
        <div className="relative">
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 blur-3xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <div className="w-32 h-32 bg-primary-300 rounded-full" />
          </motion.div>

          {/* Main content */}
          <div className="relative flex flex-col items-center justify-center">
            <motion.div
              className="text-7xl font-display font-bold mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span className="text-gradient-primary">JG</span>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-48 h-1 bg-dark-800 rounded-full overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary-300 to-primary-500"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SplashScreen;
