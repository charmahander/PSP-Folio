'use client';

import { Html } from '@react-three/drei';
import { usePortfolioStore } from '@/stores/portfolioStore';
import XMBInterface from '../xmb/XMBInterface';

interface ScreenOverlayProps {
  isMobile?: boolean;
}

export default function ScreenOverlay({ isMobile = false }: ScreenOverlayProps) {
  const { isBooting } = usePortfolioStore();

  // PSP screen dimensions and position
  // These values need to be calibrated based on the actual GLB model
  const screenPosition: [number, number, number] = isMobile 
    ? [0, 0.1, 0.15] 
    : [0, 0.05, 0.15];
  const screenScale = isMobile ? 0.32 : 0.38;

  return (
    <Html
      position={screenPosition}
      transform
      occlude
      scale={screenScale}
      style={{
        width: '480px',
        height: '272px',
        overflow: 'hidden',
        borderRadius: '4px',
        pointerEvents: 'auto',
      }}
      className="psp-screen-glow"
    >
      <div 
        className="w-full h-full relative"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        {!isBooting && <XMBInterface />}
      </div>
    </Html>
  );
}












