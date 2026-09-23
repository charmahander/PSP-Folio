'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';

/** How long the cursor must rest on an item before its art takes the background. */
const DWELL_MS = 2500;

/**
 * A PSP shows the highlighted game's own artwork behind the menu. Only case
 * studies carry art, so everything else falls through to the wave background.
 */
export default function ItemArtwork() {
  const { categories, currentCategory, currentItem, isInSubfolder, subfolderItems } =
    usePortfolioStore();

  const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
  const item = items?.[currentItem];
  const art =
    item && 'type' in item && item.type === 'caseStudy' && 'thumbnail' in item
      ? item.thumbnail ?? null
      : null;

  // Only art the cursor has rested on is shown, so scrolling the column does
  // not strobe a background per row. Any move clears it immediately.
  const [settled, setSettled] = useState<string | null>(null);
  useEffect(() => {
    setSettled(null);
    if (!art) return;
    const id = setTimeout(() => setSettled(art), DWELL_MS);
    return () => clearTimeout(id);
  }, [art]);

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
          {/* Held to the right, where the reference puts a game's art, and
              faded out before it reaches the column. Project thumbnails are
              bright UI captures, so full-bleed swamps the menu. */}
          <img
            src={settled}
            alt=""
            className="absolute top-0 right-0 h-full"
            style={{
              width: '56%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: 0.55,
              WebkitMaskImage:
                'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 38%, #000 100%)',
              maskImage:
                'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.55) 38%, #000 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
