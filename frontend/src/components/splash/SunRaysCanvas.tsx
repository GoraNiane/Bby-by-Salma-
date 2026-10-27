import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  maxOpacity: number;
  pulseSpeed: number;
  color: string;
}

interface SunRay {
  x1: number;
  y1: number;
  widthTop: number;
  widthBottom: number;
  alpha: number;
  targetAlpha: number;
  pulseSpeed: number;
  phase: number;
}

export const SunRaysCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initRays();
    };
    window.addEventListener('resize', handleResize);

    // Initialize Volumetric Sun Rays
    let rays: SunRay[] = [];
    const initRays = () => {
      rays = [
        { x1: width * 0.05, y1: -50, widthTop: 60, widthBottom: 320, alpha: 0.18, targetAlpha: 0.22, pulseSpeed: 0.008, phase: 0 },
        { x1: width * 0.20, y1: -60, widthTop: 90, widthBottom: 480, alpha: 0.25, targetAlpha: 0.32, pulseSpeed: 0.006, phase: 1.2 },
        { x1: width * 0.38, y1: -40, widthTop: 70, widthBottom: 400, alpha: 0.20, targetAlpha: 0.28, pulseSpeed: 0.007, phase: 2.4 },
        { x1: width * 0.55, y1: -70, widthTop: 110, widthBottom: 550, alpha: 0.16, targetAlpha: 0.24, pulseSpeed: 0.005, phase: 3.6 },
        { x1: width * 0.72, y1: -50, widthTop: 80, widthBottom: 380, alpha: 0.12, targetAlpha: 0.18, pulseSpeed: 0.009, phase: 4.8 },
      ];
    };
    initRays();

    // Initialize Floating Dust / Gold Motes
    const particleColors = [
      'rgba(245, 222, 179, ', // warm gold/wheat
      'rgba(255, 235, 215, ', // champagne peach
      'rgba(232, 197, 200, ', // powder rose
      'rgba(255, 255, 255, '  // pure diamond
    ];

    const particleCount = Math.min(65, Math.floor(width / 20));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        speedX: (Math.random() - 0.35) * 0.4,
        speedY: (Math.random() - 0.7) * 0.35,
        opacity: Math.random() * 0.5 + 0.2,
        maxOpacity: Math.random() * 0.6 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.008,
        color: particleColors[Math.floor(Math.random() * particleColors.length)]
      });
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Sun Window Light Source Core (Top-Left Atrium)
      const sunCore = ctx.createRadialGradient(
        width * 0.15, -40, 10,
        width * 0.25, 120, width * 0.8
      );
      sunCore.addColorStop(0, 'rgba(255, 246, 230, 0.45)');
      sunCore.addColorStop(0.2, 'rgba(235, 195, 160, 0.25)');
      sunCore.addColorStop(0.5, 'rgba(180, 110, 85, 0.12)');
      sunCore.addColorStop(1, 'rgba(35, 18, 11, 0)');
      ctx.fillStyle = sunCore;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Volumetric Diagonal Sun Rays
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      rays.forEach((ray) => {
        ray.phase += ray.pulseSpeed;
        const currentAlpha = ray.alpha + Math.sin(ray.phase) * (ray.targetAlpha - ray.alpha);

        // Ray angle calculation (diagonal stream from window top-left down to bottom-right)
        const angleShift = 0.55; // Diagonal slope
        const topX = ray.x1 + Math.sin(time * 0.2 + ray.phase) * 15;
        const bottomX = topX + height * angleShift;

        const rayGrad = ctx.createLinearGradient(topX, ray.y1, bottomX, height + 100);
        rayGrad.addColorStop(0, `rgba(255, 245, 220, ${currentAlpha * 1.3})`);
        rayGrad.addColorStop(0.25, `rgba(240, 205, 175, ${currentAlpha * 0.9})`);
        rayGrad.addColorStop(0.65, `rgba(215, 160, 135, ${currentAlpha * 0.45})`);
        rayGrad.addColorStop(1, 'rgba(100, 45, 30, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(topX - ray.widthTop / 2, ray.y1);
        ctx.lineTo(topX + ray.widthTop / 2, ray.y1);
        ctx.lineTo(bottomX + ray.widthBottom / 2, height + 100);
        ctx.lineTo(bottomX - ray.widthBottom / 2, height + 100);
        ctx.closePath();
        ctx.fill();
      });

      ctx.restore();

      // 3. Draw Floating Micro Sun Dust & Shimmer Particles
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around boundaries smoothly
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Subtle twinkling opacity
        const dynamicAlpha = p.maxOpacity * (0.6 + 0.4 * Math.sin(time * 2 + p.x));

        // In-ray illumination boost: If particle is near sun rays, it shines brighter!
        const relativeRayX = (p.y * 0.55) + (width * 0.2);
        const distFromRayCenter = Math.abs(p.x - relativeRayX);
        const rayBoost = Math.max(1, 2.2 - (distFromRayCenter / (width * 0.4)));

        const finalAlpha = Math.min(0.9, dynamicAlpha * rayBoost);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${finalAlpha})`;
        ctx.fill();

        // Soft halo for larger particles
        if (p.size > 1.6) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${finalAlpha * 0.25})`;
          ctx.fill();
        }
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
      aria-hidden="true"
    />
  );
};
