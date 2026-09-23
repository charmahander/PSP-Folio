'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import WaveBackground from './WaveBackground';
import ItemArtwork from './ItemArtwork';
import CategoryBar from './CategoryBar';
import ItemList from './ItemList';
import StatusBar from './StatusBar';
import BootSequence from '../psp/BootSequence';
import StartGate from '../psp/StartGate';

export default function XMBInterface() {
  const { isBooting, hasStarted } = usePortfolioStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isBooting) {
      // Animate in content after boot finishes (add 1s delay for waves to expand)
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isBooting]);

  return (
    <div className="w-full h-full relative overflow-hidden font-rodin">
      {/* Boot sequence inside screen UI */}
      {!hasStarted ? (
        <StartGate />
      ) : isBooting ? (
        <BootSequence />
      ) : (
        <>
          {/* Animated wave background */}
          <WaveBackground />

          {/* Highlighted project's artwork, over the waves and under the menu */}
          <ItemArtwork />
          
          {/* Status bar - fade in with menu */}
          <motion.div
            className="absolute top-0 right-0 left-0"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -6 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.2 }}
          >
            <StatusBar />
          </motion.div>
          
          {/* Both place themselves on the 480x272 grid, so no layout wrapper. */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <CategoryBar />
            <ItemList />
          </motion.div>
        </>
      )}
    </div>
  );
}
