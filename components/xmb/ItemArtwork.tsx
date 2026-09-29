'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';

/** How long the cursor must rest on an item before its art takes the background. */
const DWELL_MS = 2500;

/**
 * The art fills the screen, as a PSP's game backdrop does, so the menu and
 * status bar sit over it. Project art is often light, so a soft shade under
 * the menu's side and the status bar keeps white text readable on it.
 */
const ART_SCRIM =
  'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0) 60%), ' +
  'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 22%)';

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
    expandedContent,
    expandedAbout,
  } = usePortfolioStore();
  const panelOpen = Boolean(expandedContent || expandedAbout);

  const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
  const item = items?.[currentItem];
  // A project's own full-screen art when it has one, else its thumbnail
  const art =
    item && item.type === 'caseStudy' && 'backgroundImage' in item
      ? item.backgroundImage ?? item.thumbnail ?? null
      : item && item.type === 'caseStudy' && 'thumbnail' in item
        ? item.thumbnail ?? null
        : null;

  // Only art the cursor has rested on is shown, so scrolling the column does
  // not strobe a background per row. Any move clears it immediately. Kept in
  // the store because the menu moves the highlighted row aside for it.
  // A panel suspends it, and closing one starts the wait over: the row goes
  // back into the column and the art returns only if the cursor stays put.
  useEffect(() => {
    setSettledArt(null);
    if (!art || panelOpen) return;
    const id = setTimeout(() => setSettledArt(art), DWELL_MS);
    return () => {
      clearTimeout(id);
      setSettledArt(null);
    };
  }, [art, panelOpen, setSettledArt]);

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
          <img
            src={settled}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
          <div className="absolute inset-0" style={{ background: ART_SCRIM }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
