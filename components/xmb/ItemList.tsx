'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { usePortfolioStore } from '@/stores/portfolioStore';
import type { XMBItem, XMBChildItem } from '@/types/xmb';
import { useAudio } from '@/hooks/useAudio';
import {
  px,
  GUTTER,
  ITEM_X,
  ITEM_Y,
  itemOffsetY,
  ITEM_ICON_FOCUS,
  ITEM_ICON_BODY,
  SUB_ICON_FOCUS,
  SUB_ICON_BODY,
  ITEM_TEXT_GAP,
  ITEM_TITLE_SIZE,
  ITEM_SUBTITLE_SIZE,
  ITEM_TEXT_MAX,
} from './layout';

// Map item types to PNG icon paths
const itemIconPaths: { [key: string]: string } = {
  umd: '/icons/umd.png',
  folder: '/icons/saved_filled.png',
  profile: '/icons/users.png',
  document: '/icons/work.png',
  item: '/icons/settings.png',
  music: '/icons/music.png',
  video: '/icons/video.png',
  camera: '/icons/camera.png',
  network: '/icons/internet.png',
  settings: '/icons/settings.png',
  photo: '/icons/camera.png',
  speaker: '/icons/speaker.png',
  gallery: '/icons/camera.png',
};

// Specific icon overrides for certain items
const itemIconOverrides: { [key: string]: string } = {
  'profile': '/icons/users.png',
  'manifesto': '/icons/web.png',
  'after-hours': '/icons/home.png',
  'internet-browser': '/icons/web.png',
  'remote-play': '/icons/connect.png',
  'rss-channel': '/icons/web.png',
  'theme-settings': '/icons/settings.png',
  'resume-pdf': '/icons/saved_filled.png',
  'toggle-audio': '/icons/speaker.png',
  'origin-story': '/images/about/origin-story.png',
  'project-1': '/images/projects/project-1.png',
  'project-2': '/images/projects/project-2.png',
  'project-3': '/images/projects/project-3.png',
  'project-4': '/images/projects/project-4.png',
  'project-5': '/images/projects/project-5.png',
  'gallery-1': '/images/gallery/gallery-1.png',
  'gallery-3': '/images/gallery/gallery-3.png',
  'gallery-4': '/images/gallery/gallery-4.png',
  'gallery-5': '/images/gallery/gallery-5.png',
  'gallery-6': '/images/gallery/gallery-6.png',
  'gallery-7': '/images/gallery/gallery-7.png',
  'gallery-10': '/images/gallery/gallery-10.png',
};

function getItemIconPath(item: XMBItem | XMBChildItem): string {
  if (item.id && itemIconOverrides[item.id]) return itemIconOverrides[item.id];

  if (item.id?.startsWith('theme-')) return '/icons/settings.png';
  if (item.id?.startsWith('song')) return '/icons/saved_filled.png';
  if (item.id?.startsWith('gallery')) return itemIconPaths.camera;
  if (item.id === 'skills') return itemIconPaths.settings;

  switch (item.type) {
    case 'caseStudy':
      if ('thumbnail' in item && item.thumbnail) return item.thumbnail;
      return itemIconPaths.umd;
    case 'folder':
      return itemIconPaths.folder;
    case 'profile':
      return itemIconPaths.profile;
    case 'resume':
      return itemIconPaths.document;
    case 'link':
      return itemIconPaths.network;
    case 'setting':
      return itemIconPaths.settings;
    case 'action':
      return itemIconPaths.speaker;
    default:
      return itemIconPaths.item;
  }
}

function getItemSubtext(item: XMBItem | XMBChildItem) {
  if ('tagline' in item && item.tagline) return item.tagline;
  if (item.subtitle) return item.subtitle;
  if (item.description) return item.description;
  if (item.type === 'folder') return 'Open folder';
  if (item.type === 'resume') return 'View & Download';
  return undefined;
}

export default function ItemList() {
  const {
    categories,
    currentCategory,
    currentItem,
    setItem,
    selectItem,
    isInSubfolder,
    subfolderItems,
    goBack,
    setTheme,
  } = usePortfolioStore();
  const { playNavigate, playSelect, playBack } = useAudio();

  const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;

  // A real PSP repaints the menu as the cursor moves over a colour, before you
  // confirm it. Must run before the early return to keep hook order stable.
  const highlightedId = items?.[currentItem]?.id;
  useEffect(() => {
    if (highlightedId && /^theme-\d+$/.test(highlightedId)) {
      setTheme(Number(highlightedId.slice('theme-'.length)));
    }
  }, [highlightedId, setTheme]);

  if (!items || items.length === 0) return null;

  // Remounts the column whenever the item set changes, so a new folder's
  // contents fade in rather than snapping into place.
  const listKey = `${isInSubfolder ? 'sub' : 'cat'}-${currentCategory}-${items[0]?.id ?? ''}`;

  const focusSize = isInSubfolder ? SUB_ICON_FOCUS : ITEM_ICON_FOCUS;
  const bodySize = isInSubfolder ? SUB_ICON_BODY : ITEM_ICON_BODY;

  const handleItemClick = (index: number) => {
    const clickedItem = items?.[index];

    if (clickedItem && 'type' in clickedItem && clickedItem.type === 'folder' && 'children' in clickedItem) {
      playSelect();
      selectItem();
      return;
    }

    if (index === currentItem) {
      playSelect();
      selectItem();
    } else {
      playNavigate();
      setItem(index);
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {isInSubfolder && (
        <motion.button
          initial={{ opacity: 0, y: '-0.3em' }}
          animate={{ opacity: 0.7, y: 0 }}
          onClick={() => {
            playBack();
            goBack();
          }}
          className="absolute text-white hover:opacity-100 flex items-center z-10 pointer-events-auto"
          style={{
            top: px(GUTTER),
            left: px(GUTTER),
            gap: px(3),
            fontSize: px(10),
          }}
        >
          <svg style={{ width: px(11), height: px(11) }} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Back
        </motion.button>
      )}

      <motion.div
        key={listKey}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.34, ease: 'easeOut' }}
      >
        {items.map((item, index) => {
          const offset = index - currentItem;
          const isSelected = offset === 0;
          const distance = Math.abs(offset);
          const opacity = distance === 0 ? 1 : distance === 1 ? 0.6 : distance === 2 ? 0.4 : 0.25;
          const iconSize = isSelected ? focusSize : bodySize;
          const subtext = getItemSubtext(item);

          return (
            <motion.div
              key={item.id}
              className="absolute flex items-center cursor-pointer pointer-events-auto"
              style={{
                left: px(ITEM_X - focusSize / 2),
                top: px(ITEM_Y - focusSize / 2),
                height: px(focusSize),
                gap: px(ITEM_TEXT_GAP),
              }}
              animate={{ y: px(itemOffsetY(offset) - ITEM_Y), opacity }}
              transition={{ type: 'tween', duration: 0.14, ease: 'easeOut' }}
              onClick={() => handleItemClick(index)}
            >
              {/* Fixed slot so body and focus sizes share one centre line */}
              <div
                className="flex-shrink-0 flex items-center justify-center"
                style={{ width: px(focusSize), height: px(focusSize) }}
              >
                <motion.img
                  src={getItemIconPath(item)}
                  alt={item.title}
                  animate={{ width: px(iconSize), height: px(iconSize) }}
                  transition={{ duration: 0.14, ease: 'easeOut' }}
                  style={{ objectFit: 'contain', display: 'block' }}
                />
              </div>

              <div className="flex flex-col" style={{ maxWidth: px(ITEM_TEXT_MAX) }}>
                {/* Kept mounted and faded by selection - mounting inside a
                    presence wrapper skips the enter animation. */}
                <motion.div
                  animate={{ opacity: isSelected ? 1 : 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="text-white font-medium"
                  style={{
                    fontSize: px(ITEM_TITLE_SIZE),
                    lineHeight: 1.25,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </motion.div>
                {subtext && (
                  <motion.div
                    animate={{ opacity: isSelected ? 0.7 : 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="text-white"
                    style={{
                      marginTop: px(2),
                      fontSize: px(ITEM_SUBTITLE_SIZE),
                      lineHeight: 1.35,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {subtext}
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
