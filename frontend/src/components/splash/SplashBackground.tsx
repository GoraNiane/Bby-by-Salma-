import React, { useState } from 'react';
import { SunRaysCanvas } from './SunRaysCanvas';

interface SplashBackgroundProps {
  intensity?: number;
}

export const SplashBackground: React.FC<SplashBackgroundProps> = ({ intensity = 1 }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Luxury beauty background video sources (Optimized MP4 & WebM with auto fallbacks)
  const videoDesktopUrl = 'https://assets.mixkit.co/videos/preview/mixkit-slow-motion-of-a-woman-applying-makeup-42999-large.mp4';
  const videoMobileUrl = 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-woman-holding-cosmetic-cream-42998-large.mp4';

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
      {/* COUCHE 1 : DÉGRADÉ ANIMÉ MARRON CHOCOLAT / ROSE POUDRÉ / BEIGE LUXE */}
      <div 
        className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#1b0c07] via-[#2d150d] to-[#451f15]"
        style={{
          background: 'radial-gradient(ellipse at 40% 30%, #4a241a 0%, #29120a 50%, #150804 100%)'
        }}
      />

      {/* Animated Floating Color Blobs for Luxury Ambient Depth */}
      <div 
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[140px] opacity-40 animate-pulse pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(220,157,132,0.6) 0%, rgba(184,93,67,0.2) 60%, transparent 100%)',
          animationDuration: '7s'
        }}
      />
      <div 
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full blur-[160px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(213,165,66,0.45) 0%, rgba(153,71,50,0.2) 60%, transparent 100%)',
          animation: 'floatSlow 11s ease-in-out infinite alternate'
        }}
      />

      {/* COUCHE 2 : VIDÉO BEAUTÉ CINÉMATIQUE HAUT DE GAMME */}
      {!videoError && (
        <div className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${videoLoaded ? 'opacity-35' : 'opacity-0'}`}>
          <video
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover scale-105 filter brightness-[0.85] contrast-[1.1] saturate-[0.95]"
            poster="/assets/hero_banner.jpg"
          >
            <source src={videoDesktopUrl} type="video/mp4" media="(min-width: 768px)" />
            <source src={videoMobileUrl} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Fallback Image with Smooth Parallax Drift when video is loading or offline */}
      {(!videoLoaded || videoError) && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-25 filter blur-[1px] transform scale-110 animate-pulse"
          style={{
            backgroundImage: "url('/assets/hero_banner.jpg')",
            animationDuration: '6s'
          }}
        />
      )}

      {/* COUCHE 3 & 4 : RAYONS DE SOLEIL VOLUMÉTRIQUES & PARTICULES LUMINEUSES */}
      <SunRaysCanvas />

      {/* COUCHE 5 : VOILAGE DE SOIE & VIGNETTAGE CINÉMATIQUE */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 25%, rgba(18, 7, 3, 0.55) 70%, rgba(10, 3, 1, 0.88) 100%)'
        }}
      />

      {/* Subtle Golden Micro-Sheen Filter */}
      <div 
        className="absolute inset-0 w-full h-full opacity-20 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(255,235,200,0.3) 0%, transparent 40%, rgba(220,157,132,0.2) 100%)'
        }}
      />
    </div>
  );
};
