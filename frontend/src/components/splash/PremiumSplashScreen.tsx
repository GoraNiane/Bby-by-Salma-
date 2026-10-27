import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplashBackground } from './SplashBackground';
import { SplashLogo } from './SplashLogo';
import { SplashLoader } from './SplashLoader';
import { Sparkles } from 'lucide-react';

interface PremiumSplashScreenProps {
  onComplete: () => void;
  minDuration?: number; // in milliseconds (default: 3200ms)
}

export const PremiumSplashScreen: React.FC<PremiumSplashScreenProps> = ({
  onComplete,
  minDuration = 3200
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

      // Custom luxury cubic bezier easing: cubic-bezier(0.25, 0.1, 0.25, 1)
      const easeProgress = Math.pow(linearRatio, 0.85);
      const calculatedProgress = Math.min(100, easeProgress * 100);

      setProgress(calculatedProgress);

      if (linearRatio < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        setIsCompleted(true);

        // Hold at 100% briefly before cinematic light bloom dissipation
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(() => {
            onComplete();
          }, 1000); // 1s transition
        }, 350);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [minDuration, onComplete]);

  const handleSkip = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(16px)',
            transition: { duration: 0.95, ease: [0.4, 0, 0.2, 1] }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#150804] text-white overflow-hidden"
          role="dialog"
          aria-label="Écran de démarrage BBS by Salma"
        >
          {/* 1. Multi-Layer Background (Video, Volumetric Sun Rays, Silk Veil, Gradient) */}
          <SplashBackground />

          {/* 2. Skip Button (Discreet Luxury Glass Top-Right) */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.03 }}
            onClick={handleSkip}
            className="absolute top-6 right-6 z-30 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-gold-300/30 text-[11px] font-sans font-medium text-gold-200 tracking-wider uppercase flex items-center gap-1.5 transition-all cursor-pointer shadow-lg active:scale-95"
          >
            <Sparkles className="w-3 h-3 text-gold-400" />
            <span>Passer</span>
          </motion.button>

          {/* 3. Center Luxury Content (Emblem, BBS by Salma Logo, Taglines) */}
          <div className="relative z-20 flex flex-col items-center justify-center max-w-lg w-full">
            <SplashLogo progress={progress} />
            <SplashLoader progress={progress} />
          </div>

          {/* 4. Cinematic Light Bloom Flash on Arrival at 100% */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              className="absolute inset-0 z-40 bg-gradient-to-r from-amber-100/40 via-white/60 to-amber-100/40 pointer-events-none mix-blend-screen"
            />
          )}

          {/* 5. Bottom Copyright Notice */}
          <div className="absolute bottom-6 z-20 text-[10px] tracking-[0.25em] text-bbs-300/60 uppercase font-sans">
            © BBS BY SALMA • TOUS DROITS RÉSERVÉS
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};
