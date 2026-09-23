'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useAudio } from '@/hooks/useAudio';
import {
  px,
  CATEGORY_ICON,
  CATEGORY_UNSELECTED_SCALE,
  CATEGORY_STEP,
  CATEGORY_X,
  CATEGORY_Y,
  CATEGORY_CELL_W,
  CATEGORY_LABEL_SIZE,
  CATEGORY_LABEL_GAP,
} from './layout';

// Map category icon keys to PNG files (PSP-inspired set)
const categoryIconPaths: { [key: string]: string } = {
  game: '/icons/video game.png',
  about: '/icons/about.png',
  resume: '/icons/work.png',
  music: '/icons/music.png',
  gallery: '/icons/camera.png',
  settings: '/icons/settings.png',
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
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {categories.map((category, index) => {
        const offset = index - currentCategory;
        const isSelected = offset === 0;
        const distance = Math.abs(offset);
        const scale = isSelected ? 1 : CATEGORY_UNSELECTED_SCALE;

        return (
          <motion.div
            key={category.id}
            className={`absolute ${isInSubfolder ? '' : 'cursor-pointer pointer-events-auto'}`}
            style={{
              // Box is icon-sized and centred on the row, so every icon shares
              // one centreline no matter how the selected one scales.
              left: px(CATEGORY_X - CATEGORY_CELL_W / 2),
              top: px(CATEGORY_Y - CATEGORY_ICON / 2),
              width: px(CATEGORY_CELL_W),
              height: px(CATEGORY_ICON),
            }}
            animate={{
              x: px(offset * CATEGORY_STEP),
              opacity: isSelected ? 1 : distance === 1 ? 0.55 : 0.3,
            }}
            transition={{ type: 'tween', duration: 0.18, ease: 'easeOut' }}
            onClick={() => handleCategoryClick(index)}
          >
            <div className="w-full h-full flex items-center justify-center">
              <motion.div
                className="relative"
                animate={{
                  width: px(CATEGORY_ICON * scale),
                  height: px(CATEGORY_ICON * scale),
                  filter: isSelected
                    ? 'drop-shadow(0 0 10px rgba(255,255,255,0.45))'
                    : 'drop-shadow(0 0 0 rgba(255,255,255,0))',
                }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <Image
                  src={categoryIconPaths[category.icon] || '/icons/home.png'}
                  alt={category.name}
                  fill
                  sizes="64px"
                  className="object-contain pointer-events-none"
                />
              </motion.div>
            </div>

            <motion.span
              animate={{ opacity: isSelected ? 1 : 0 }}
              transition={{ duration: 0.18 }}
              className="absolute text-white text-center w-full"
              style={{
                top: `calc(100% + ${px(CATEGORY_LABEL_GAP)})`,
                left: 0,
                fontSize: px(CATEGORY_LABEL_SIZE),
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              {category.name}
            </motion.span>
          </motion.div>
        );
      })}
    </div>
  );
}
