import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashLoaderProps {
  progress: number;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ progress }) => {
  const [dots, setDots] = useState('');

  // Animated progressive dots (. -> .. -> ...)
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 450);
    return () => clearInterval(dotInterval);
  }, []);

  const chargementLetters = 'Chargement'.split('');

  return (
    <div className="relative flex flex-col items-center justify-center text-center select-none z-20 mt-8 space-y-4 px-4">
      {/* 1. Slogan Poétique & Sensuel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.0 }}
        className="font-serif italic text-sm sm:text-base text-gold-200/90 tracking-wide font-normal"
      >
        « Votre beauté commence ici »
      </motion.div>

      {/* 2. Indicateur de statut textuel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="flex items-center gap-1 text-xs sm:text-sm font-sans font-medium text-bbs-200/80 tracking-widest uppercase"
      >
        <span>Préparation de votre expérience beauté</span>
      </motion.div>

      {/* 3. Chargement typographique avec illumination par lettre + points animés */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.3 }}
        className="flex items-center justify-center space-x-1 py-1"
      >
        <div className="flex space-x-[2px] sm:space-x-1 text-xs tracking-[0.25em] font-sans uppercase text-bbs-300/75">
          {chargementLetters.map((char, index) => (
            <motion.span
              key={index}
              animate={{
                opacity: [0.35, 1, 0.35],
                color: ['#dc9d84', '#f5edd2', '#dc9d84']
              }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: index * 0.12,
                ease: 'easeInOut'
              }}
              className="inline-block font-semibold"
            >
              {char}
            </motion.span>
          ))}
        </div>

        {/* Dynamic Trailing Dots */}
        <span className="w-5 text-left text-xs font-bold text-gold-300 font-sans tracking-widest inline-block">
          {dots}
        </span>
      </motion.div>

      {/* 4. Compteur numérique luxueux (sans barre classique) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="pt-1 flex items-baseline justify-center gap-0.5"
      >
        <span className="font-serif text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gold-200 via-gold-300 to-amber-400 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(213,165,66,0.4)]">
          {Math.round(progress)}
        </span>
        <span className="font-sans text-xs font-bold text-gold-400/80 tracking-wider">
          %
        </span>
      </motion.div>
    </div>
  );
};
