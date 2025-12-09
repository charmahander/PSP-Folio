'use client';

import { useEffect, useRef } from 'react';
import { usePortfolioStore } from '@/stores/portfolioStore';

// Color themes for different categories
const categoryColors = [
  { primary: '#0066cc', secondary: '#003366', accent: '#0099ff' }, // Case Studies - Blue
  { primary: '#6633cc', secondary: '#330066', accent: '#9966ff' }, // About - Purple
  { primary: '#006644', secondary: '#003322', accent: '#00cc88' }, // Resume - Green
];

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentCategory } = usePortfolioStore();
  const animationRef = useRef<number>();

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
    const colors = categoryColors[currentCategory] || categoryColors[0];

    const animate = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Draw multiple wave layers - slowed down and more subtle
      for (let layer = 0; layer < 3; layer++) {
        const layerOffset = layer * 0.5;
        const layerAlpha = 0.08 - layer * 0.02; // More subtle opacity
        const layerSpeed = 0.003 - layer * 0.0008; // Much slower animation
        
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        // Create wave path
        for (let x = 0; x <= width; x += 2) {
          const y = height * 0.6 + 
            Math.sin((x * 0.01) + time * layerSpeed + layerOffset) * 20 +
            Math.sin((x * 0.02) + time * layerSpeed * 1.5 + layerOffset) * 15 +
            Math.sin((x * 0.005) + time * layerSpeed * 0.5) * 30;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Complete the shape
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        
        // Create gradient
        const gradient = ctx.createLinearGradient(0, height * 0.4, 0, height);
        gradient.addColorStop(0, `${colors.primary}${Math.round(layerAlpha * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(0.5, `${colors.secondary}${Math.round(layerAlpha * 0.7 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${colors.accent}${Math.round(layerAlpha * 0.3 * 255).toString(16).padStart(2, '0')}`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }
      
      // Draw ribbon/highlight
      ctx.beginPath();
      ctx.moveTo(0, height);
      
      for (let x = 0; x <= width; x += 2) {
        const y = height * 0.5 + 
          Math.sin((x * 0.015) + time * 0.005) * 25 + // Much slower
          Math.sin((x * 0.008) + time * 0.003) * 20; // Much slower
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.strokeStyle = `${colors.accent}22`; // More subtle stroke
      ctx.lineWidth = 1.5; // Thinner line
      ctx.stroke();
      
      time += 0.3; // Much slower time increment
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentCategory]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.4 }}
    />
  );
}
