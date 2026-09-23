'use client';

import { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';
import WaveBackground from '../xmb/WaveBackground';

export default function StartGate() {
  const { start } = usePortfolioStore();
  const { playBoot } = useAudio();

  // Browsers only allow audio once the page has a user gesture, and Safari
  // wants the play() call inside the handler's own call stack - so the jingle
  // starts here, before the state change that mounts the boot sequence.
  const begin = useCallback(() => {
    playBoot();
    start();
  }, [playBoot, start]);

  useEffect(() => {
    const onKey = () => begin();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [begin]);

  return (
    <div
      className="absolute inset-0 cursor-pointer"
      onClick={begin}
      style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}
    >
      <WaveBackground />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white font-rodin text-center"
          style={{ fontSize: '0.85em', letterSpacing: '0.35em', whiteSpace: 'nowrap' }}
        >
          PRESS START
        </motion.div>
      </div>
    </div>
  );
}
