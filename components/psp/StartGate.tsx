'use client';

import { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';

/**
 * The switched-off screen: plain black, with a prompt pointing at the power
 * switch. Clicking the screen does the same as the switch. Once powered, the
 * prompt fades and the screen stays dark until the boot a beat later.
 */
export default function StartGate() {
  const { poweredOn, powerOn, bootCount } = usePortfolioStore();
  const { unlockAudio } = useAudio();

  // Inside the press itself, so the boot jingle is allowed to play later
  const begin = useCallback(() => {
    unlockAudio();
    powerOn();
  }, [unlockAudio, powerOn]);

  // Keyboard users can power on too
  useEffect(() => {
    if (poweredOn) return;
    const onKey = () => begin();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [begin, poweredOn]);

  // After a power-off the picture drops to black over a moment; on first
  // load the screen is simply already off.
  return (
    <motion.div
      className={`absolute inset-0 bg-black ${poweredOn ? '' : 'cursor-pointer'}`}
      onClick={poweredOn ? undefined : begin}
      initial={{ opacity: bootCount > 0 ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeIn' }}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: poweredOn ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div
          className="font-rodin text-center"
          style={{
            color: 'rgba(255,255,255,0.72)',
            fontSize: '0.8em',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          &quot;Power&quot; on to start
        </div>
      </motion.div>
    </motion.div>
  );
}
