'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';

/** How long the cursor must rest on an item before its art takes the background. */
const DWELL_MS = 2500;

/** 0% to 100% opacity, left to right, eased so the art is solid by a third in. */
const ART_FADE =
  'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.45) 12%, rgba(0,0,0,0.85) 24%, #000 36%)';

/**
 * A PSP shows the highlighted game's own artwork behind the menu. Only case
 * studies carry art, so everything else falls through to the wave background.
 */
export default function ItemArtwork() {
  const {
    categories,
    currentCategory,
    currentItem,
    isInSubfolder,
    subfolderItems,
    settledArt: settled,
    setSettledArt,
  } = usePortfolioStore();

  const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
  const item = items?.[currentItem];
  const art =
    item && 'type' in item && item.type === 'caseStudy' && 'thumbnail' in item
      ? item.thumbnail ?? null
      : null;

  // Only art the cursor has rested on is shown, so scrolling the column does
  // not strobe a background per row. Any move clears it immediately. Kept in
  // the store because the menu moves the highlighted row aside for it.
  useEffect(() => {
    setSettledArt(null);
    if (!art) return;
    const id = setTimeout(() => setSettledArt(art), DWELL_MS);
    return () => {
      clearTimeout(id);
      setSettledArt(null);
    };
  }, [art, setSettledArt]);

  return (
    <AnimatePresence mode="wait">
      {settled && (
        <motion.div
          key={settled}
          className="absolute inset-0 z-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* The right 55%, fading in from nothing at its left edge so the
              menu background still reads on the left. The highlighted row
              steps aside to the left edge to make room for it. */}
          <img
            src={settled}
            alt=""
            className="absolute top-0 right-0 h-full"
            style={{
              width: '55%',
              objectFit: 'cover',
              objectPosition: 'center',
              WebkitMaskImage: ART_FADE,
              maskImage: ART_FADE,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
