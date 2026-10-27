import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplashBackground } from './SplashBackground';
import { SplashLogo } from './SplashLogo';
import { SplashLoader } from './SplashLoader';
import { Sparkles } from 'lucide-react';

interface PremiumSplashScreenProps {
  onComplete: () => void;
  minDuration?: number; // in milliseconds (default: 2400ms)
}

export const PremiumSplashScreen: React.FC<PremiumSplashScreenProps> = ({
  onComplete,
  minDuration = 2400
}) => {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Smooth realistic easing counter from 0 to 100
  useEffect(() => {
    const startTime = performance.now();
    let animationFrameId: number;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const linearRatio = Math.min(1, elapsed / minDuration);

      // Luxury cubic bezier easing for realistic progress bar fill
      const easeProgress = Math.pow(linearRatio, 0.9);
      const calculatedProgress = Math.min(100, easeProgress * 100);

      setProgress(calculatedProgress);

      if (linearRatio < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setIsCompleted(true);

        // Hold briefly at 100% before smooth fade-out into the store
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 700); // 700ms smooth transition to store
        }, 250);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [minDuration, onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02,
            transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-white overflow-hidden select-none"
          role="dialog"
          aria-label="Écran de démarrage BBS by Salma"
        >
          {/* 1. Pure Black Background with Subtle Gold Ambient Light */}
          <SplashBackground />

          {/* 2. Skip Button (Discreet Luxury Glass Top-Right) */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 1, scale: 1.03 }}
            onClick={handleSkip}
            className="absolute top-6 right-6 z-30 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md border border-[#E2C078]/25 text-[10px] font-sans font-medium text-[#E2C078] tracking-widest uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-[#E2C078]" />
            <span>Passer</span>
          </motion.button>

          {/* 3. Center Luxury Content (Emblem, BBS by Salma Logo, Loading Progress Bar) */}
          <div className="relative z-20 flex flex-col items-center justify-center max-w-md w-full px-6">
            <SplashLogo progress={progress} />
            <SplashLoader progress={progress} />
          </div>

          {/* 4. Cinematic Light Bloom Flash on Arrival at 100% */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="absolute inset-0 z-40 bg-gradient-to-r from-[#E2C078]/20 via-white/40 to-[#E2C078]/20 pointer-events-none mix-blend-screen"
            />
          )}

          {/* 5. Bottom Copyright Notice */}
          <div className="absolute bottom-6 z-20 text-[10px] tracking-[0.25em] text-[#A59485]/60 uppercase font-sans">
            © BBS BY SALMA • MAISON DE COSMÉTIQUES
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
