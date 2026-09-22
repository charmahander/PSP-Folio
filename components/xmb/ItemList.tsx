'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/stores/portfolioStore';
import type { XMBItem, XMBChildItem } from '@/types/xmb';
import { useAudio } from '@/hooks/useAudio';
import {
  RAIL_PADDING_EM,
  ITEM_ROW_PADDING_EM,
  ITEM_ICON_SLOT_EM,
  ITEM_LIST_PADDING_EM,
  ITEM_LIST_WIDTH_EM,
  ITEM_ICON_TEXT_GAP_EM,
  ITEM_TEXT_MAX_EM,
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
  'profile': '/icons/users.png',           // Who I Am
  'manifesto': '/icons/web.png',           // Design Manifesto  
  'after-hours': '/icons/home.png',        // 5-9 After 9-5
  'internet-browser': '/icons/web.png',
  'remote-play': '/icons/connect.png',
  'rss-channel': '/icons/web.png',
  'theme-settings': '/icons/settings.png',
  'resume-pdf': '/icons/saved_filled.png', // memory stick icon for resume download
  'toggle-audio': '/icons/speaker.png',
  'origin-story': '/images/about/origin-story.png',
  // Project-specific thumbnails (ordered as provided by user attachments)
  'project-1': '/images/projects/project-1.png',
  'project-2': '/images/projects/project-2.png',
  'project-3': '/images/projects/project-3.png',
  'project-4': '/images/projects/project-4.png',
  'project-5': '/images/projects/project-5.png',
  // Gallery overrides (first ten images)
  'gallery-1': '/images/gallery/gallery-1.png',
  'gallery-2': '/images/gallery/gallery-2.png',
  'gallery-3': '/images/gallery/gallery-3.png',
  'gallery-4': '/images/gallery/gallery-4.png',
  'gallery-5': '/images/gallery/gallery-5.png',
  'gallery-6': '/images/gallery/gallery-6.png',
  'gallery-7': '/images/gallery/gallery-7.png',
  'gallery-8': '/images/gallery/gallery-8.png',
  'gallery-9': '/images/gallery/gallery-9.png',
  'gallery-10': '/images/gallery/gallery-10.png',
};

function getItemIconPath(item: XMBItem | XMBChildItem): string {
  // Check for specific item ID overrides first
  if (item.id && itemIconOverrides[item.id]) {
    return itemIconOverrides[item.id];
  }

  // Pattern-based overrides
  if (item.id?.startsWith('song')) {
    return '/icons/saved_filled.png'; // memory/file icon for all song items
  }
  if (item.id?.startsWith('gallery')) {
    return itemIconPaths.camera; // image/camera icon for gallery items
  }
  if (item.id === 'origin-story') {
    return itemIconPaths.camera; // image icon for origin story
  }
  if (item.id === 'skills') {
    return itemIconPaths.settings; // tool/settings icon for skills
  }
  
  switch (item.type) {
    case 'caseStudy':
      // Use thumbnail when available to keep proportions consistent, fallback to UMD icon
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
  } = usePortfolioStore();
  const { playNavigate, playSelect, playBack } = useAudio();

  const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;

  if (!items || items.length === 0) return null;

  // Remounts the column whenever the item set changes, so a new folder's
  // contents fade in rather than snapping into place.
  const listKey = `${isInSubfolder ? 'sub' : 'cat'}-${currentCategory}-${items[0]?.id ?? ''}`;

  const handleItemClick = (index: number) => {
    const clickedItem = items?.[index];
    
    // If clicking on a folder, always open it (even if not selected)
    if (clickedItem && 'type' in clickedItem && clickedItem.type === 'folder' && 'children' in clickedItem) {
      playSelect();
      selectItem();
      return;
    }
    
    // If clicking the selected item, select/open it
    if (index === currentItem) {
      playSelect();
      selectItem();
    } else {
      // Otherwise navigate to that item
      playNavigate();
      setItem(index);
    }
  };

  const handleBackClick = () => {
    playBack();
    goBack();
  };

  // XMB style: selected near top/left, with above/below context.
  // Row/block dimensions for consistent snapping
  const rowHeightEm = 4.2; // item block height
  const rowGapEm = 3.0; // default vertical gap between items
  const rowGapAfterActiveEm = 1.2; // reduced gap right after the active item so the next is visible
  const stepEm = rowHeightEm + rowGapEm; // total vertical step per item
  const topOffsetEm = 1.0; // cushion under the category rail for active item spacing

  return (
    <div
      className="absolute inset-0 w-full flex flex-col items-start z-0"
      style={{
        paddingLeft: `${ITEM_LIST_PADDING_EM}em`,
        marginTop: '0px',
        overflow: 'visible'
      }}
    >
      {/* Back button when in subfolder */}
      {isInSubfolder && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleBackClick}
          className="absolute text-white/70 hover:text-white flex items-center z-10"
          style={{ top: '-0.5em', left: `${RAIL_PADDING_EM}em`, gap: '0.35em', fontSize: '0.65em' }}
        >
          <svg style={{ width: '1em', height: '1em' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back
        </motion.button>
      )}
      
      {/* Items list - XMB style: vertical list with selected item centered */}
      <div
        className="flex flex-col items-start justify-start relative"
        style={{ 
          gap: `${rowGapEm}em`,
          paddingTop: '2em', 
          paddingBottom: '2em', // equal padding above/below category bar area
          height: `${stepEm * 3}em`, // one above + active + one below
          overflow: 'hidden',
          width: `${ITEM_LIST_WIDTH_EM}em`,
        }}
      >
        <motion.div
          key={listKey}
          // Leave one item-height of headroom above the active item (mirrors category spacer logic)
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: `calc(${topOffsetEm}em - ${currentItem} * ${stepEm}em + ${stepEm}em)`,
          }}
          transition={{
            y: { type: 'tween', duration: 0.12, ease: 'easeOut' },
            opacity: { duration: 0.34, ease: 'easeOut' },
          }}
          className="flex flex-col relative"
          style={{ 
            gap: `${rowGapEm}em`, 
            paddingRight: '0.75em',
            display: 'grid',
            gridAutoRows: `${rowHeightEm}em`,
            rowGap: `${rowGapEm}em`,
          }}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item, originalIndex) => {
              const isSelected = originalIndex === currentItem;
              const distance = Math.abs(originalIndex - currentItem);
              
              // XMB style: selected item fully visible, adjacent items visible but faded, distant items more faded
              let opacity = 1;
              if (distance === 0) opacity = 1;
              else if (distance === 1) opacity = 0.6;
              else if (distance === 2) opacity = 0.4;
              else opacity = 0.25;
              const isAbove = originalIndex < currentItem;
              
              return (
                <motion.div
                  key={item.id}
                  layout={false}
                  initial={{ opacity: 0, x: '-0.5em' }}
                  animate={{
                    opacity: opacity,
                    x: 0,
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    filter: 'none',
                  }}
                  exit={{ opacity: 0, x: '-0.5em' }}
                  transition={{ type: 'tween', duration: 0.14, ease: 'easeOut' }}
                  onClick={() => handleItemClick(originalIndex)}
                  className="relative flex items-center cursor-pointer"
                  style={{
                    gap: `${ITEM_ICON_TEXT_GAP_EM}em`,
                    padding: `0.55em ${ITEM_ROW_PADDING_EM}em`,
                    minHeight: '3.1em',
                    borderRadius: '0.9em',
                    backdropFilter: 'none',
                    // Reduce spacing after the active item only, so the next item stays visible
                    marginBottom: isSelected ? `${rowGapAfterActiveEm - rowGapEm}em` : undefined,
                  }}
                >
                {/* Item icon - centred in a fixed slot so every icon size shares one axis */}
                <div
                  className="relative flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: `${ITEM_ICON_SLOT_EM}em`,
                    height: `${ITEM_ICON_SLOT_EM}em`,
                  }}
                >
                  <img
                    src={getItemIconPath(item)}
                    alt={item.title}
                    style={{
                      width: item.type === 'caseStudy' ? (isSelected ? '2.35em' : '1.95em') : (isSelected ? '2.05em' : '1.7em'),
                      height: item.type === 'caseStudy' ? (isSelected ? '2.35em' : '1.95em') : (isSelected ? '2.05em' : '1.7em'),
                      objectFit: 'contain',
                      filter: 'none',
                      display: 'block'
                    }}
                  />
                </div>
                
                {/* Item content */}
                <div className="flex flex-col" style={{ maxWidth: `${ITEM_TEXT_MAX_EM}em` }}>
                  {/* Kept mounted and faded by selection - mounting inside
                      AnimatePresence skips the enter animation. */}
                  <motion.div
                    animate={{ opacity: isSelected ? 1 : 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="text-white font-medium"
                      style={{
                        fontSize: '0.78em',
                        lineHeight: 1.25,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                  >
                    {item.title}
                  </motion.div>
                  {getItemSubtext(item) && (
                    <motion.div
                      animate={{ opacity: isSelected ? 0.7 : 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="text-white"
                      style={{ 
                        fontSize: '0.5em',
                        marginTop: '0.16em',
                        lineHeight: 1.35,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {getItemSubtext(item)}
                    </motion.div>
                  )}
                </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
