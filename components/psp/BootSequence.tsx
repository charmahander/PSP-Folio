'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';
import WaveBackground from '../xmb/WaveBackground';
import StatusBar from '../xmb/StatusBar';

export default function BootSequence() {
  const { finishBooting } = usePortfolioStore();
  const { playBoot } = useAudio();
  const [phase, setPhase] = useState<'wave' | 'name' | 'status' | 'done'>('wave');

  useEffect(() => {
    // Play boot sound immediately when component mounts and show name
    // Small delay to ensure audio context is ready
    const bootSoundDuration = 3500; // Approximate duration of startup sound (3.5 seconds)
    
    const bootTimer = setTimeout(() => {
      playBoot();
      setPhase('name'); // Show name when sound plays
    }, 100);

    // Status bar fades in after startup sound completes
    const statusTimer = setTimeout(() => setPhase('status'), bootSoundDuration + 100);
    
    // Finish booting 1 second after status bar appears (allowing it to fade in)
    const doneTimer = setTimeout(() => {
      setPhase('done');
      finishBooting();
    }, bootSoundDuration + 2100); // 1s after status bar starts fading in

    return () => {
      clearTimeout(bootTimer);
      clearTimeout(statusTimer);
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
          {/* Wave background animation */}
          <WaveBackground />
          
          {/* Name text - appears when sound plays, centered */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              {phase === 'name' || phase === 'status' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="text-white font-rodin tracking-wider text-center"
                  style={{ whiteSpace: 'nowrap', fontSize: '1.25em' }}
                >
                  Mahanetran Murali Narayanan
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          
          {/* Status bar - fades in after name */}
          <AnimatePresence>
            {phase === 'status' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <StatusBar />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
