'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';
import WaveBackground from '../xmb/WaveBackground';

export default function BootSequence() {
  const { finishBooting } = usePortfolioStore();
  const { playBoot } = useAudio();
  const [phase, setPhase] = useState<'wave' | 'name' | 'done'>('wave');

  useEffect(() => {
    // Play boot sound and show name immediately
    // Text fade in: 1s max
    // Total boot sequence: ~3s (matches startup sound duration)
    
    const bootTimer = setTimeout(() => {
      playBoot();
      setPhase('name'); // Show name when sound plays
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
  }, [finishBooting, playBoot]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
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
