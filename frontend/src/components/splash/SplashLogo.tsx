import React from 'react';
import { motion } from 'framer-motion';

interface SplashLogoProps {
  progress: number;
}

export const SplashLogo: React.FC<SplashLogoProps> = () => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center select-none z-20 px-4">
      {/* 1. Official Emblem Monogram in Gold */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-5"
      >
        {/* Outer Golden Geometric Ring */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-[1.5px] bg-gradient-to-br from-[#E2C078] via-[#F3E5AB] to-[#B8860B] shadow-[0_0_30px_rgba(226,192,120,0.35)]">
          <div className="w-full h-full rounded-[22px] bg-[#0A0705] flex items-center justify-center overflow-hidden relative border border-[#E2C078]/25 shadow-inner">
            
            {/* Shimmer Light Beam Sweep Animation */}
            <motion.div
              initial={{ x: '-150%' }}
              animate={{ x: '180%' }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-25deg] pointer-events-none"
            />

            {/* Central Serif Monogram Letter "B" */}
            <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tighter bg-gradient-to-br from-[#FFF5DC] via-[#E2C078] to-[#C59B27] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(226,192,120,0.6)]">
              B
            </span>

            {/* Corner Diamond Accents */}
            <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-[#E2C078]/70" />
            <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-[#E2C078]/70" />
          </div>
        </div>
      </motion.div>

      {/* 2. Official Brand Typography: BBS BY SALMA */}
      <div className="relative overflow-hidden">
        {/* Main Title "BBS" */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFFFFF] via-[#F5E6D3] to-[#E2C078] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
        >
          BBS
        </motion.h1>

        {/* Sub-Title "by Salma" */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="mt-0.5 font-script text-2xl sm:text-3xl text-[#E2C078] drop-shadow-[0_2px_8px_rgba(226,192,120,0.4)]"
        >
          by Salma
        </motion.div>

        {/* Dynamic Golden Separator Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: 'easeOut' }}
          className="mx-auto mt-3 h-[1px] w-28 sm:w-36 bg-gradient-to-r from-transparent via-[#E2C078]/70 to-transparent"
        />

        {/* Luxury Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: 'easeOut' }}
          className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#D1C3B7] font-medium font-sans"
        >
          Maison de Cosmétiques d'Exception
        </motion.p>
      </div>
    </div>
  );
};
