'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import WaveBackground from './WaveBackground';
import CategoryBar from './CategoryBar';
import ItemList from './ItemList';
import StatusBar from './StatusBar';
import BootSequence from '../psp/BootSequence';

export default function XMBInterface() {
  const { isBooting } = usePortfolioStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isBooting) {
      // Animate in content 1 second after boot finishes
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isBooting]);

  return (
    <div className="w-full h-full relative overflow-hidden font-rodin">
      {/* Boot sequence inside screen UI */}
      {isBooting ? (
        <BootSequence />
      ) : (
        <>
          {/* Animated wave background */}
          <WaveBackground />
          
          {/* Status bar - top right */}
          <StatusBar />
          
          {/* Main XMB content - PSP style: categories on left, items on right */}
          <motion.div 
            className="absolute inset-0 flex"
            style={{ paddingTop: '3em' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Category icons - left side, vertical */}
            <motion.div
              className="flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <CategoryBar />
            </motion.div>
            
            {/* Spacer between categories and items */}
            <div className="flex-shrink-0" style={{ width: '2em' }} />
            
            {/* Item list - right side, vertical */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <ItemList />
            </motion.div>
          </motion.div>
        </>
      )}
    </div>
  );
}
