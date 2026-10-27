import React from 'react';
import { motion } from 'framer-motion';

interface SplashLogoProps {
  progress: number;
}

export const SplashLogo: React.FC<SplashLogoProps> = ({ progress }) => {
  return (
    <div className="relative flex flex-col items-center justify-center text-center select-none z-20 px-4">
      {/* 1. Warm Golden/Rose Back-Glow Halo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0.2, 0.55, 0.4],
          scale: [0.9, 1.15, 1.05],
        }}
        transition={{
          duration: 3.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse'
        }}
        className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-[70px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(220, 157, 132, 0.55) 0%, rgba(213, 165, 66, 0.3) 50%, transparent 75%)'
        }}
      />

      {/* 2. Official Emblem Monogram with Royal Crest Detailing */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 15, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="relative mb-5 group"
      >
        {/* Outer Golden Geometric Ring */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-[1.5px] bg-gradient-to-br from-gold-300 via-bbs-300 to-gold-600 shadow-2xl">
          <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-[#241109] via-[#1a0c06] to-[#0d0503] flex items-center justify-center overflow-hidden relative border border-gold-400/20 shadow-inner">
            
            {/* Shimmer Light Beam Sweep Animation */}
            <motion.div
              initial={{ x: '-150%' }}
              animate={{ x: '180%' }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut'
              }}
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] pointer-events-none"
            />

            {/* Central Serif Monogram Letter "B" */}
            <span className="font-serif text-3xl sm:text-4xl font-bold tracking-tighter bg-gradient-to-br from-gold-200 via-gold-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(213,165,66,0.6)]">
              B
            </span>

            {/* Subtle Diamond Corner Accents */}
            <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-gold-300/60" />
            <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-gold-300/60" />
          </div>
        </div>
      </motion.div>

      {/* 3. Official Brand Typography: BBS BY SALMA */}
      <div className="relative overflow-hidden">
        {/* Main Title "BBS" */}
        <motion.h1
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#faf5f0] via-[#f5ded5] to-[#ebd7a1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
        >
          BBS
        </motion.h1>

        {/* Sub-Title "by Salma" */}
        <motion.div
          initial={{ opacity: 0, y: 12, letterSpacing: '0.15em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.28em' }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="mt-1 font-serif italic text-lg sm:text-2xl text-gold-200/90 font-medium"
        >
          by Salma
        </motion.div>

        {/* Dynamic Light Sweep Bar across the text */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1, ease: 'easeOut' }}
          className="mx-auto mt-3 h-[1px] w-24 sm:w-36 bg-gradient-to-r from-transparent via-gold-300/70 to-transparent"
        />

        {/* 4. Luxury Sub-Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 1.2, delay: 1.3, ease: 'easeOut' }}
          className="mt-2 text-[10px] sm:text-xs uppercase tracking-[0.35em] text-bbs-200/90 font-medium font-sans"
        >
          Maison de Cosmétiques d'Exception
        </motion.p>
      </div>
    </div>
  );
};
