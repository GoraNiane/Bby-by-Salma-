import React from 'react';
import { motion } from 'framer-motion';

interface SplashLoaderProps {
  progress: number;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({ progress }) => {
  const boundedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="relative flex flex-col items-center justify-center text-center select-none z-20 mt-8 space-y-4 px-4 w-full max-w-xs sm:max-w-sm">
      {/* 1. Slogan Poétique */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="font-serif italic text-xs sm:text-sm text-[#E2C078]/90 tracking-wide font-normal"
      >
        « Votre rituel beauté commence ici »
      </motion.div>

      {/* 2. Barre de chargement dorée sans aucun % */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="w-full space-y-2.5"
      >
        {/* Conteneur de la barre de progression */}
        <div className="relative w-full h-1.5 sm:h-2 bg-white/10 rounded-full p-[2px] border border-[#E2C078]/35 shadow-inner backdrop-blur-md overflow-hidden">
          {/* Remplissage animé fluide de la barre */}
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C59B27] via-[#F3E5AB] to-[#E2C078] transition-all duration-150 ease-out relative shadow-[0_0_12px_rgba(226,192,120,0.85)]"
            style={{ width: `${boundedProgress}%` }}
          >
            {/* Tête lumineuse étincelante */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
          </div>
        </div>

        {/* 3. Mention discrète "Chargement..." centrée (SANS AUCUN POURCENTAGE %) */}
        <div className="flex items-center justify-center text-xs font-sans">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#D1C3B7]/90 font-medium flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E2C078] animate-pulse" />
            <span>Chargement...</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
};
