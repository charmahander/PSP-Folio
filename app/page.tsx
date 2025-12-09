'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePortfolioStore } from '@/stores/portfolioStore';
import BootSequence from '@/components/psp/BootSequence';
import CaseStudyModal from '@/components/modals/CaseStudyModal';
import AboutModal from '@/components/modals/AboutModal';

const PSPScene = dynamic(() => import('@/components/psp/PSPScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="text-gray-400 text-lg font-rodin">Loading PSP...</div>
    </div>
  ),
});

export default function Home() {
  const { isBooting, expandedContent, expandedAbout } = usePortfolioStore();
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    // Small delay to ensure smooth transition
    const timer = setTimeout(() => setShowScene(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="w-screen h-screen overflow-hidden relative">
      {/* Light minimal background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-gray-100" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main PSP Scene */}
      {showScene && (
        <div className="absolute inset-0">
          <PSPScene />
        </div>
      )}

      {/* Expanded content modals */}
      {expandedContent && <CaseStudyModal />}
      {expandedAbout && <AboutModal />}

      {/* Navigation hints - desktop */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-6 text-gray-400 text-sm font-rodin">
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">←→</kbd>
          or swipe
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">↑↓</kbd>
          navigate
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Double-click</kbd>
          select
        </span>
        <span className="flex items-center gap-2">
          <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd>
          back
        </span>
      </div>

      {/* Mobile instruction hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:hidden text-gray-400 text-xs font-rodin text-center">
        Swipe screen to navigate · Double-tap to select
      </div>
    </main>
  );
}
