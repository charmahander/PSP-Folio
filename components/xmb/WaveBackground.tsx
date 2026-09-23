'use client';

import { useEffect, useRef, useState } from 'react';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { THEMES, resolveWaves, type WavePalette } from './themes';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
};

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isBooting, themeIndex } = usePortfolioStore();
  const animationRef = useRef<number>();
  const expansionRef = useRef(0); // 0 = compressed, 1 = fully expanded
  const targetExpansionRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const [now, setNow] = useState<Date>(() => new Date());

  // Update palette over time (minute-level is enough for subtle shifts)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  // Read through a ref so switching theme repaints on the next frame instead of
  // restarting the animation, which would reset the particles and expansion.
  const paletteRef = useRef<WavePalette>(
    resolveWaves(THEMES[0], new Date())
  );
  useEffect(() => {
    paletteRef.current = resolveWaves(THEMES[themeIndex] ?? THEMES[0], now);
  }, [themeIndex, now]);

  useEffect(() => {
    targetExpansionRef.current = isBooting ? 0 : 1;
  }, [isBooting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    let time = 0;

    // Initialize subtle particles concentrated toward the left
    const initParticles = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      particlesRef.current = [];
      const count = 40;
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x: Math.random() * width * 0.45, // left side bias
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.08,
          size: 0.8 + Math.random() * 1.2,
          alpha: 0.05 + Math.random() * 0.08,
        });
      }
    };
    initParticles();

    const hexAlpha = (a: number) =>
      Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const colors = paletteRef.current;

      // Smoothly interpolate expansion with eased curve (gentler start)
      const lerpFactor = 0.035;
      const maxStep = 0.008;
      const delta = targetExpansionRef.current - expansionRef.current;
      expansionRef.current += Math.max(-maxStep, Math.min(maxStep, delta * lerpFactor));

      const rawExpansion = expansionRef.current;
      const expansion = 1 - Math.pow(1 - Math.max(0, Math.min(1, rawExpansion)), 2.5);

      ctx.clearRect(0, 0, width, height);

      const waveCount = 3;

      for (let w = 0; w < waveCount; w++) {
        const compressedY = height * 0.5;
        const expandedY = height * (0.4 + w * 0.18);
        const baseY = compressedY + (expandedY - compressedY) * expansion;

        const compressedAmplitude = 10 + w * 3;
        const expandedAmplitude = 30 + w * 10;
        const waveAmplitude =
          compressedAmplitude + (expandedAmplitude - compressedAmplitude) * expansion;

        const baseFrequency = 0.004 - w * 0.0006;
        const waveFrequency = baseFrequency + Math.sin(time * 0.0003 + w) * (expansion * 0.002);

        const baseSpeed = 0.001 + w * 0.0003;
        const waveSpeed = baseSpeed + Math.cos(time * 0.0002 + w * 1.2) * (expansion * 0.0005);

        const verticalDrift = expansion * Math.sin(time * 0.0004 + w * 0.7) * 8;

        const compressedAlpha = 0.2 - w * 0.03;
        const expandedAlpha = 0.3 - w * 0.04;
        const alpha = compressedAlpha + (expandedAlpha - compressedAlpha) * expansion;

        const waveY = (x: number) =>
          baseY +
          verticalDrift +
          Math.sin(x * waveFrequency + time * waveSpeed + w * 0.8) * waveAmplitude +
          Math.sin(x * waveFrequency * 2.3 + time * waveSpeed * 1.4 + w * 1.1) *
            (waveAmplitude * 0.4) +
          Math.sin(x * waveFrequency * 0.6 + time * waveSpeed * 0.7 + w * 0.5) *
            (waveAmplitude * 0.25) +
          expansion * Math.sin(x * 0.003 + time * 0.0008 + w) * 5;

        const gradient = ctx.createLinearGradient(0, baseY - waveAmplitude, 0, height);
        gradient.addColorStop(0, `${colors.accent}${hexAlpha(alpha)}`);
        gradient.addColorStop(0.3, `${colors.primary}${hexAlpha(alpha * 0.8)}`);
        gradient.addColorStop(0.7, `${colors.secondary}${hexAlpha(alpha * 0.5)}`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 2) {
          const y = waveY(x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const y = waveY(x);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `${colors.accent}${hexAlpha(alpha * 3.0 * expansion)}`;
        ctx.lineWidth = 2.0;
        ctx.stroke();
      }

      // Highlight ribbon - only visible when expanded, with flowing motion
      if (expansion > 0.3) {
        const ribbonAlpha = ((expansion - 0.3) / 0.7) * 0.12;
        const ribbonY = height * (0.5 - expansion * 0.15);
        const ribbonDrift = expansion * Math.sin(time * 0.0005) * 3;

        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const y =
            ribbonY +
            ribbonDrift +
            Math.sin(x * 0.007 + time * 0.0018) * (15 * expansion) +
            Math.sin(x * 0.0035 + time * 0.0009) * (10 * expansion) +
            Math.sin(x * 0.012 + time * 0.0025) * (5 * expansion);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `${colors.accent}${hexAlpha(ribbonAlpha)}`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Subtle particle overlay (left-biased)
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy + 0.02;

        const leftBound = width * 0.45;
        if (p.x < 0) p.x = leftBound;
        if (p.x > leftBound) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.accent}${hexAlpha(p.alpha * (0.4 + 0.6 * expansion))}`;
        ctx.fill();
      });

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}
