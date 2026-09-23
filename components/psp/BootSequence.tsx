'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import WaveBackground from '../xmb/WaveBackground';
import { useTheme } from '@/hooks/useTheme';

export default function BootSequence() {
  const { finishBooting } = usePortfolioStore();
  const theme = useTheme();
  const [phase, setPhase] = useState<'wave' | 'name' | 'done'>('wave');

  useEffect(() => {
    // The jingle is started by StartGate, inside the user gesture that got us
    // here - browsers block it from a mount effect like this one.
    const bootTimer = setTimeout(() => {
      setPhase('name');
    }, 100);

    // Hold after waves expand before showing menu/top UI
    const doneTimer = setTimeout(() => {
      setPhase('done');
      finishBooting();
    }, 4500);

    return () => {
      clearTimeout(bootTimer);
      clearTimeout(doneTimer);
    };
  }, [finishBooting]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{
            background: theme.background,
          }}
        >
          {/* Wave background animation - particles that animate outward */}
          <WaveBackground />
          
          {/* Name text - fades in within 1s, centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {phase === 'name' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }} // Text fade in < 1s
                  className="text-white font-rodin tracking-wider text-center"
                  style={{ whiteSpace: 'nowrap', fontSize: '1.25em' }}
                >
                  Mahanetran Murali Narayanan
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          
        </motion.div>
      )}
    </AnimatePresence>
  );
}
