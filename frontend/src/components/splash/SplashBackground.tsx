import React from 'react';
import { motion } from 'framer-motion';

export const SplashBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none bg-black">
      {/* 1. Deep Black Base with Subtle Radial Gold Spotlight behind Logo */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(226, 192, 120, 0.08) 0%, rgba(20, 14, 8, 0.4) 45%, #000000 75%)'
        }}
      />

      {/* 2. Soft Ambient Golden Glow Pulsing Behind Monogram */}
      <motion.div
        initial={{ opacity: 0.3, scale: 0.9 }}
        animate={{ 
          opacity: [0.25, 0.5, 0.25],
          scale: [0.95, 1.1, 0.95]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.18) 0%, rgba(184, 134, 11, 0.08) 50%, transparent 70%)'
        }}
      />
    </div>
  );
};
