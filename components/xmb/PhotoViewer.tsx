'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';
import { px, GUTTER } from './layout';

/**
 * A gallery photo at the full size of the screen. `contain` keeps the photo's
 * own proportions, so portraits sit pillarboxed rather than cropped. Closes
 * from the button, Escape, or the device's O button (all route to goBack).
 */
export default function PhotoViewer() {
  const { expandedPhoto, goBack } = usePortfolioStore();
  const { playBack } = useAudio();

  return (
    <AnimatePresence>
      {expandedPhoto && (
        <motion.div
          key={expandedPhoto.src}
          className="absolute inset-0 z-40 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.img
            src={expandedPhoto.src}
            alt={expandedPhoto.title}
            className="w-full h-full block"
            style={{ objectFit: 'contain' }}
            initial={{ scale: 0.85 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
          />

          <button
            onClick={() => {
              playBack();
              goBack();
            }}
            className="absolute flex items-center justify-center rounded-full text-white"
            style={{
              top: px(GUTTER),
              left: px(GUTTER),
              width: px(22),
              height: px(22),
              background: 'rgba(0,0,0,0.55)',
              border: `${px(1)} solid rgba(255,255,255,0.35)`,
            }}
            aria-label="Close photo"
          >
            <svg style={{ width: px(10), height: px(10) }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
