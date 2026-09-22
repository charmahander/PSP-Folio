'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';
import {
  RAIL_PADDING_EM,
  CATEGORY_SLOT_EM,
  CATEGORY_GAP_EM,
  CATEGORY_STEP_EM,
} from './layout';

// Map category icon keys to PNG files (PSP-inspired set)
const categoryIconPaths: { [key: string]: string } = {
  game: '/icons/video game.png',
  about: '/icons/about.png',
  resume: '/icons/work.png',
  music: '/icons/music.png',
  gallery: '/icons/camera.png',
};

export default function CategoryBar() {
  const { categories, currentCategory, setCategory, isInSubfolder } = usePortfolioStore();
  const { playCategory } = useAudio();

  const handleCategoryClick = (index: number) => {
    if (index !== currentCategory && !isInSubfolder) {
      playCategory();
      setCategory(index);
    }
  };

  return (
    <div
      className="relative w-full flex items-center justify-start z-10 overflow-hidden"
      style={{ paddingLeft: `${RAIL_PADDING_EM}em` }}
    >
      {/* Horizontal category row - active pinned left */}
      <motion.div
        className="grid items-end"
        style={{
          gridAutoFlow: 'column',
          gridAutoColumns: `${CATEGORY_SLOT_EM}em`,
          columnGap: `${CATEGORY_GAP_EM}em`,
          minWidth: 'max-content',
        }}
        animate={{ x: `${-CATEGORY_STEP_EM * currentCategory}em` }}
        transition={{ type: 'tween', duration: 0.16, ease: 'easeOut' }}
      >
        {/* Leading spacer so the current category can slide left into it when advancing */}
        <div aria-hidden style={{ width: '100%', height: '100%' }} />

        <AnimatePresence mode="popLayout">
          {categories.map((category, index) => {
            const isSelected = index === currentCategory;
            const distance = Math.abs(index - currentCategory);
            
            return (
              <motion.div
                key={category.id}
                layout={false}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isSelected ? 1 : distance === 1 ? 0.5 : 0.3,
                  scale: isSelected ? 1 : 0.82,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className={`flex flex-col items-center cursor-pointer ${
                  isInSubfolder ? 'pointer-events-none' : ''
                }`}
                style={{ gap: '0.3em', width: '100%' }} // tighter gap between icon and label
                onClick={() => handleCategoryClick(index)}
              >
                {/* Category icon */}
                <motion.div
                  className="relative flex items-center justify-center"
                  style={{ 
                    width: isSelected ? '2.65em' : '2.1em', 
                    height: isSelected ? '2.65em' : '2.1em',
                    padding: '0.12em',
                  }}
                  animate={{
                    filter: isSelected ? 'drop-shadow(0 0 10px rgba(255,255,255,0.45))' : 'none',
                  }}
                >
                  <Image
                    src={categoryIconPaths[category.icon] || '/icons/home.png'}
                    alt={category.name}
                    fill
                    className="object-contain pointer-events-none"
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </motion.div>
                
                {/* Category name - keep space to prevent lateral shifts */}
                <motion.span
                  animate={{ opacity: isSelected ? 1 : 0.05 }}
                  transition={{ duration: 0.2 }}
                  className="text-white font-medium tracking-wide text-center"
                  style={{ fontSize: '0.58em', minHeight: '0.9em', whiteSpace: 'nowrap', letterSpacing: '0.02em' }}
                >
                  {category.name}
                </motion.span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
