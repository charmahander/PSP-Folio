'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePortfolioStore } from '@/stores/portfolioStore';

type ThemePalette = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const interpolateColor = (c1: string, c2: string, t: number) => {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return rgbToHex(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
  );
};

const adjustBrightness = (hex: string, factor: number) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * factor, g * factor, b * factor);
};

// PSP-inspired monthly hues (approx from reference image)
const monthColors = [
  '#d0b000', // Jan
  '#a0002e', // Feb
  '#b0007a', // Mar
  '#2f8a3d', // Apr
  '#28b5a6', // May
  '#63a3d8', // Jun
  '#c22626', // Jul
  '#c66812', // Aug
  '#7c7c7c', // Sep
  '#b58b32', // Oct
  '#7a5bd1', // Nov
  '#d45b9c', // Dec
];

// Brightness curve across the day (midnight low, noon peak)
const brightnessByHour = [
  0.18, 0.2, 0.22, 0.24, 0.28, 0.35, 0.45, 0.6,
  0.7, 0.8, 0.9, 1.0, 1.0, 0.95, 0.85, 0.75,
  0.65, 0.55, 0.45, 0.35, 0.3, 0.26, 0.22, 0.2,
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const getDynamicPalette = (now: Date): ThemePalette => {
  const month = now.getMonth();
  const year = now.getFullYear();
  const day = now.getDate();
  const daysInMonth = getDaysInMonth(year, month);
  const nextMonth = (month + 1) % 12;
  const blend = clamp(day / daysInMonth, 0, 1);

  const base = interpolateColor(monthColors[month], monthColors[nextMonth], blend);
  const brightness = brightnessByHour[now.getHours()] ?? 1;

  // Derive a small set of tones from the base + brightness curve
  const primary = adjustBrightness(base, clamp(brightness * 0.9, 0.15, 1.1));
  const secondary = adjustBrightness(base, clamp(brightness * 0.7, 0.12, 0.9));
  const accent = adjustBrightness(base, clamp(brightness * 1.15, 0.2, 1.2));

  return {
    name: `psp-${month}-${now.getHours()}`,
    primary,
    secondary,
    accent,
  };
};

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
  const { isBooting } = usePortfolioStore();
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

  const activePalette = useMemo(() => getDynamicPalette(now), [now]);
  const paletteKey = `${activePalette.name}-${activePalette.primary}-${activePalette.secondary}-${activePalette.accent}`;

  useEffect(() => {
    // Set target expansion based on boot state
    targetExpansionRef.current = isBooting ? 0 : 1;
  }, [isBooting]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    let time = 0;
    const colors = activePalette;

    // Initialize subtle particles concentrated toward the left
    const initParticles = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      particlesRef.current = [];
      const count = 40;
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width * 0.45; // left side bias
        const y = Math.random() * height;
        particlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.08,
          size: 0.8 + Math.random() * 1.2,
          alpha: 0.05 + Math.random() * 0.08,
        });
      }
    };
    initParticles();

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Smoothly interpolate expansion with eased curve (gentler start)
      const lerpFactor = 0.035; // smaller = smoother/softer
      const maxStep = 0.008; // avoid sudden jumps
      const delta = targetExpansionRef.current - expansionRef.current;
      const step = Math.max(-maxStep, Math.min(maxStep, delta * lerpFactor));
      expansionRef.current += step;

      // Eased expansion for visual parameters (ease-out cubic with smoother curve)
      const rawExpansion = expansionRef.current;
      const expansion = 1 - Math.pow(1 - Math.max(0, Math.min(1, rawExpansion)), 2.5);
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Calculate wave parameters based on expansion
      // When compressed (0): waves are close together near center
      // When expanded (1): waves spread across the screen
      const waveCount = 3; // Reduced to 2-3 waves
      
      for (let w = 0; w < waveCount; w++) {
        // Base Y position interpolates from center to spread position
        const compressedY = height * 0.5; // All waves near center when compressed
        const expandedY = height * (0.4 + w * 0.18); // Spread out when expanded (more spacing for 3 waves)
        const baseY = compressedY + (expandedY - compressedY) * expansion;
        
        // Amplitude grows as waves expand
        const compressedAmplitude = 10 + w * 3;
        const expandedAmplitude = 30 + w * 10;
        const waveAmplitude = compressedAmplitude + (expandedAmplitude - compressedAmplitude) * expansion;
        
        // Dynamic frequency and speed - more organic when expanded
        const baseFrequency = 0.004 - w * 0.0006;
        const frequencyVariation = expansion * 0.002; // More variation when expanded
        const waveFrequency = baseFrequency + Math.sin(time * 0.0003 + w) * frequencyVariation;
        
        const baseSpeed = 0.001 + w * 0.0003;
        const speedVariation = expansion * 0.0005; // Varying speeds when expanded
        const waveSpeed = baseSpeed + Math.cos(time * 0.0002 + w * 1.2) * speedVariation;
        
        // Vertical drift - waves move up/down slightly when expanded
        const verticalDrift = expansion * Math.sin(time * 0.0004 + w * 0.7) * 8;
        
        // Alpha fades in as waves expand
        const compressedAlpha = 0.2 - w * 0.03;   // stronger base opacity
        const expandedAlpha = 0.3 - w * 0.04;     // stronger when fully expanded
        const alpha = compressedAlpha + (expandedAlpha - compressedAlpha) * expansion;
        
        // Create gradient for wave fill
        const gradient = ctx.createLinearGradient(0, baseY - waveAmplitude, 0, height);
        gradient.addColorStop(0, `${colors.accent}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.3, `${colors.primary}${Math.round(alpha * 0.8 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.7, `${colors.secondary}${Math.round(alpha * 0.5 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'transparent');
        
        // Draw filled wave shape with more complex, flowing motion
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 2) {
          // Multi-layered wave with varying frequencies for organic flow
          const primaryWave = Math.sin((x * waveFrequency) + time * waveSpeed + w * 0.8) * waveAmplitude;
          const secondaryWave = Math.sin((x * waveFrequency * 2.3) + time * waveSpeed * 1.4 + w * 1.1) * (waveAmplitude * 0.4);
          const tertiaryWave = Math.sin((x * waveFrequency * 0.6) + time * waveSpeed * 0.7 + w * 0.5) * (waveAmplitude * 0.25);
          
          // Add subtle vertical undulation when expanded
          const verticalWave = expansion * Math.sin((x * 0.003) + time * 0.0008 + w) * 5;
          
          const y = baseY + verticalDrift + primaryWave + secondaryWave + tertiaryWave + verticalWave;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw wave line on top for definition with smoother motion
        ctx.beginPath();
        for (let x = 0; x <= width; x += 2) {
          const primaryWave = Math.sin((x * waveFrequency) + time * waveSpeed + w * 0.8) * waveAmplitude;
          const secondaryWave = Math.sin((x * waveFrequency * 2.3) + time * waveSpeed * 1.4 + w * 1.1) * (waveAmplitude * 0.4);
          const tertiaryWave = Math.sin((x * waveFrequency * 0.6) + time * waveSpeed * 0.7 + w * 0.5) * (waveAmplitude * 0.25);
          const verticalWave = expansion * Math.sin((x * 0.003) + time * 0.0008 + w) * 5;
          
          const y = baseY + verticalDrift + primaryWave + secondaryWave + tertiaryWave + verticalWave;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        const lineAlpha = alpha * 3.0 * expansion; // Even stronger contrast for line waves
        ctx.strokeStyle = `${colors.accent}${Math.round(Math.min(lineAlpha, 1) * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2.0;
        ctx.stroke();
      }
      
      // Highlight ribbon - only visible when expanded, with flowing motion
      if (expansion > 0.3) {
        const ribbonAlpha = (expansion - 0.3) / 0.7 * 0.12; // Fade in after 30% expansion
        ctx.beginPath();
        const ribbonY = height * (0.5 - expansion * 0.15); // Ribbon rises as waves expand
        const ribbonDrift = expansion * Math.sin(time * 0.0005) * 3; // Subtle vertical drift
        
        for (let x = 0; x <= width; x += 2) {
          // More organic ribbon motion
          const y = ribbonY + ribbonDrift +
            Math.sin((x * 0.007) + time * 0.0018) * (15 * expansion) +
            Math.sin((x * 0.0035) + time * 0.0009) * (10 * expansion) +
            Math.sin((x * 0.012) + time * 0.0025) * (5 * expansion);
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = `${colors.accent}${Math.round(ribbonAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Subtle particle overlay (left-biased)
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.y += 0.02; // gentle drift down

        const leftBound = width * 0.45;
        if (p.x < 0) p.x = leftBound;
        if (p.x > leftBound) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const alpha = p.alpha * (0.4 + 0.6 * expansion); // brighten slightly as expansion completes
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${colors.accent}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      });

      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paletteKey, activePalette, isBooting]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}
