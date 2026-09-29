import { create } from 'zustand';
import type { Category, XMBChildItem, XMBItem, CaseStudy, AboutItem, ViewedPhoto } from '@/types/xmb';
import { TRACKS } from '@/data/music';
import { THEME_OPTIONS, BY_MONTH_INDEX } from '@/components/xmb/themes';

interface PortfolioState {
  // Navigation state
  currentCategory: number;
  currentItem: number;
  
  // UI state
  /** The power LED is lit; the screen boots a beat later. */
  poweredOn: boolean;
  hasStarted: boolean;
  isBooting: boolean;
  themeIndex: number;
  expandedContent: CaseStudy | null;
  expandedAbout: AboutItem | null;
  expandedPhoto: ViewedPhoto | null;
  /** Art the cursor has rested on long enough to take the background. */
  settledArt: string | null;
  /** Bumped by Up/Down while a detail panel is open, which scrolls it. */
  detailScroll: { dir: 1 | -1; seq: number };
  isInSubfolder: boolean;
  subfolderItems: XMBChildItem[] | null;
  activeFolderIndex: number | null;
  activeFolderTitle: string | null;
  
  // Audio state
  isMuted: boolean;
  
  // Actions
  setCategory: (index: number) => void;
  setItem: (index: number) => void;
  navigateLeft: () => void;
  navigateRight: () => void;
  navigateUp: () => void;
  navigateDown: () => void;
  selectItem: () => void;
  goBack: () => void;
  start: () => void;
  powerOn: () => void;
  setTheme: (index: number) => void;
  finishBooting: () => void;
  setExpandedContent: (content: CaseStudy | null) => void;
  setExpandedAbout: (content: AboutItem | null) => void;
  setSettledArt: (art: string | null) => void;
  toggleMute: () => void;
  volume: number;
  adjustVolume: (delta: number) => void;
  enterSubfolder: (items: AboutItem[]) => void;
  exitSubfolder: () => void;
  
  // Data
  categories: Category[];
}

/** From the power switch to the screen booting. */
const POWER_ON_DELAY_MS = 1500;

/** While a panel or photo is up, the d-pad drives it instead of the menu. */
const isDetailOpen = (s: Pick<PortfolioState, 'expandedContent' | 'expandedAbout' | 'expandedPhoto'>) =>
  Boolean(s.expandedContent || s.expandedAbout || s.expandedPhoto);

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  // Settings sits leftmost as it does on a real PSP, so open on Games instead.
  currentCategory: 1,
  currentItem: 0,
  poweredOn: false,
  hasStarted: false,
  isBooting: true,
  themeIndex: 0,
  expandedContent: null,
  expandedAbout: null,
  expandedPhoto: null,
  settledArt: null,
  detailScroll: { dir: 1, seq: 0 },
  isInSubfolder: false,
  subfolderItems: null,
  activeFolderIndex: null,
  activeFolderTitle: null,
  isMuted: false,
  volume: 0.7,

  categories: [
    {
      id: 'settings',
      name: 'Settings',
      icon: 'settings',
      items: [
        {
          id: 'theme-settings',
          title: 'Theme Settings',
          type: 'folder',
          subtitle: 'Colour of the home menu',
          children: THEME_OPTIONS.map((option, index) => ({
            id: `theme-${index}`,
            title: option.name,
            type: 'setting' as const,
            subtitle:
              index === BY_MONTH_INDEX
                ? 'Changes automatically each month'
                : undefined,
          })),
        },
      ],
    },
    {
      id: 'game',
      name: 'Projects',
      icon: 'game',
      items: [
        {
          id: 'project-1',
          title: 'PaidPiper',
          type: 'caseStudy',
          tagline: 'Music Business co-pilot for indie artists',
          categories: ['UX Design', 'Mobile'],
          thumbnail: '/images/projects/project-1.png',
          backgroundImage: '/images/projects/paidpiper/01.webp',
          gallery: [2, 3, 4, 5, 6, 7, 8].map(
            (n) => `/images/projects/paidpiper/${String(n).padStart(2, '0')}.webp`,
          ),
          content: {
            // The drawer is images only after the details, so no prose here
            overview: '',
            role: 'Designer - Product & Strategy',
            skills: 'Product Design, Business Strategy',
            timeline: 'Sept ’24 - May ’25',
            duration: '3 months',
            tools: ['Figma', 'Protopie', 'Unity'],
            sections: [
            ],
          },
        } as XMBItem,
        {
          id: 'project-2',
          title: 'BMW Group x SCADpro',
          type: 'caseStudy',
          tagline: 'Intrapreneurial innovation strategy',
          categories: ['Product Design', 'Social'],
          thumbnail: '/images/projects/project-2.png',
          content: {
            overview: 'Building meaningful connections through design.',
            role: 'Product Designer',
            duration: '6 months',
            tools: ['Figma', 'Framer', 'React'],
            sections: [],
          },
        } as XMBItem,
        {
          id: 'project-3',
          title: 'BMW M x SCADpro',
          type: 'caseStudy',
          tagline: 'Innovative M-Driving Experience',
          categories: ['UI Design', 'E-commerce'],
          thumbnail: '/images/projects/project-3.png',
          content: {
            overview: 'Streamlining the online shopping experience.',
            role: 'UI/UX Designer',
            duration: '4 months',
            tools: ['Sketch', 'InVision', 'Zeplin'],
            sections: [],
          },
        } as XMBItem,
        {
          id: 'project-4',
          title: 'Billify',
          type: 'caseStudy',
          tagline: 'Personal finance manager',
          categories: ['UX Research', 'Healthcare'],
          thumbnail: '/images/projects/project-4.png',
          content: {
            overview: 'Making healthcare accessible through technology.',
            role: 'UX Researcher',
            duration: '5 months',
            tools: ['Figma', 'Maze', 'Dovetail'],
            sections: [],
          },
        } as XMBItem,
      ],
    },
    {
      id: 'about',
      name: 'About',
      icon: 'about',
      items: [
        // Each opens the in-screen detail panel. Placeholder copy until the
        // real text is in: prose for the narrative entries, a list for the
        // ones that are a set of separate points.
        {
          id: 'origin-story',
          title: 'The origin story',
          type: 'item',
          description: 'Foundational background and journey.',
          photo: '/images/about/origin-story.png',
          detail: {
            kind: 'paragraphs',
            body: [
              'Placeholder - a short introduction: who I am, where I grew up, and what drew me to design.',
              'Placeholder - the path from there to product design and strategy, and what I care about now.',
            ],
          },
        },
        {
          id: 'design-manifesto',
          title: 'Design Manifesto',
          type: 'item',
          description: 'Principles I design by.',
          detail: {
            kind: 'list',
            items: [1, 2, 3, 4, 5, 6].map((n) => ({
              title: `Principle ${n}`,
              body: 'Placeholder - one or two lines on what this principle means in practice.',
            })),
          },
        },
        {
          id: 'skills',
          title: 'Skills',
          type: 'item',
          description: 'What I bring to a team.',
          detail: {
            kind: 'paragraphs',
            body: [
              'Placeholder - design skills: research, interaction, visual and prototyping.',
              'Placeholder - strategy and product skills, and the tools I work in day to day.',
            ],
          },
        },
        {
          id: 'testimonials',
          title: 'Testimonials',
          type: 'item',
          description: 'Words from people I have worked with.',
          detail: {
            kind: 'list',
            items: [1, 2, 3, 4, 5, 6].map((n) => ({
              title: `Name ${n}, Role at Company`,
              body: 'Placeholder - a quote from someone I have worked with.',
            })),
          },
        },
      ],
    },
    {
      id: 'resume',
      name: 'Resume',
      icon: 'resume',
      items: [
        {
          id: 'resume-pdf',
          title: 'Download Resume',
          type: 'resume',
          subtitle: 'Open PDF in new tab',
        },
      ],
    },
    {
      id: 'music',
      name: 'Music',
      icon: 'music',
      items: [
        // Straight from the playlist snapshot; X opens the track on Spotify.
        ...TRACKS.map(
          (track) =>
            ({
              id: `song-${track.id}`,
              title: track.title,
              type: 'link',
              subtitle: `${track.artist} · ${track.year}`,
              thumbnail: `/images/music/${track.id}.jpg`,
              url: `https://open.spotify.com/track/${track.id}`,
            }) as XMBItem,
        ),
      ],
    },
    {
      id: 'gallery',
      name: 'Gallery',
      icon: 'gallery',
      items: [
        // Ids stay bound to their image files, which is why they skip numbers.
        { id: 'gallery-1', title: 'Snow Day in Sav', type: 'item', thumbnail: '/images/gallery/gallery-1.png' },
        { id: 'gallery-3', title: 'SCAD Grad', type: 'item', thumbnail: '/images/gallery/gallery-3.png' },
        { id: 'gallery-4', title: 'Vinyl Daze', type: 'item', thumbnail: '/images/gallery/gallery-4.png' },
        { id: 'gallery-5', title: 'Goku ’21', type: 'item', thumbnail: '/images/gallery/gallery-5.png' },
        { id: 'gallery-6', title: 'Hard at work', type: 'item', thumbnail: '/images/gallery/gallery-6.png' },
        { id: 'gallery-7', title: 'First tat', type: 'item', thumbnail: '/images/gallery/gallery-7.png' },
        { id: 'gallery-10', title: 'That one guy at every party', type: 'item', thumbnail: '/images/gallery/gallery-10.png' },
      ],
    },
  ] as Category[],
  
  setCategory: (index) => {
    if (isDetailOpen(get())) return;
    const { categories } = get();
    if (categories.length === 0) return;
    const nextIndex = (index + categories.length) % categories.length;
    set({ currentCategory: nextIndex, currentItem: 0, activeFolderIndex: null, activeFolderTitle: null, isInSubfolder: false, subfolderItems: null });
  },
  
  setItem: (index) => {
    if (isDetailOpen(get())) return;
    const { categories, currentCategory, isInSubfolder, subfolderItems } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    if (!items || items.length === 0) return;
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    set({ currentItem: clamped });
  },
  
  navigateLeft: () => {
    if (isDetailOpen(get())) return;
    const { currentCategory, isInSubfolder, categories } = get();
    if (isInSubfolder) {
      set({ isInSubfolder: false, subfolderItems: null, currentItem: 0, activeFolderIndex: null, activeFolderTitle: null });
      return;
    }
    const prev = (currentCategory - 1 + categories.length) % categories.length;
    set({ currentCategory: prev, currentItem: 0, activeFolderIndex: null, activeFolderTitle: null, subfolderItems: null });
  },
  
  navigateRight: () => {
    if (isDetailOpen(get())) return;
    const { currentCategory, categories, isInSubfolder } = get();
    
    // If in subfolder, don't navigate categories
    if (isInSubfolder) return;
    
    // Right moves along the category row. Only X opens a folder, as on
    // hardware - right previously swallowed the press and entered one.
    const next = (currentCategory + 1) % categories.length;
    set({ currentCategory: next, currentItem: 0, activeFolderIndex: null, activeFolderTitle: null, subfolderItems: null });
  },
  
  navigateUp: () => {
    if (isDetailOpen(get())) return scrollDetail(-1);
    const { currentItem, isInSubfolder, subfolderItems, currentCategory, categories } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    if (!items || items.length === 0) return;
    if (currentItem > 0) {
      set({ currentItem: currentItem - 1 });
    }
  },
  
  navigateDown: () => {
    if (isDetailOpen(get())) return scrollDetail(1);
    const { currentItem, currentCategory, categories, isInSubfolder, subfolderItems } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    if (!items || items.length === 0) return;
    if (currentItem < items.length - 1) {
      set({ currentItem: currentItem + 1 });
    }
  },
  
  selectItem: () => {
    const { currentCategory, currentItem, categories, isInSubfolder, subfolderItems, activeFolderIndex } = get();
    const items = isInSubfolder ? subfolderItems : categories[currentCategory]?.items;
    const item = items?.[currentItem];
    
    if (!item || isDetailOpen(get())) return;

    // Case study content
    if (item.type === 'caseStudy' && 'content' in item && item.content) {
      set({ expandedContent: item as CaseStudy });
      return;
    }
    
    // Folders
    if (item.type === 'folder' && 'children' in item && item.children) {
      const parentIndex = isInSubfolder ? activeFolderIndex : currentItem;
      set({ 
        isInSubfolder: true, 
        subfolderItems: item.children as XMBChildItem[], 
        currentItem: 0,
        activeFolderIndex: parentIndex ?? currentItem,
        activeFolderTitle: item.title,
      });
      return;
    }
    
    // Profile items
    if (item.type === 'profile') {
      set({ expandedAbout: item as AboutItem });
      return;
    }
    
    // Resume download
    if (item.type === 'resume') {
      window.open('/Mahanetran Murali Narayanan_Resume.pdf', '_blank');
      return;
    }

    // Gallery photos open full screen inside the device
    if (item.id.startsWith('gallery-') && item.thumbnail) {
      set({ expandedPhoto: { src: item.thumbnail, title: item.title } });
      return;
    }

    // Links
    if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank');
      return;
    }

    // Action toggles (e.g., mute)
    if (item.type === 'action') {
      if (item.id === 'toggle-audio') {
        set((state) => ({ isMuted: !state.isMuted }));
      }
      return;
    }
    
    // Theme colours already applied while highlighted, so this just confirms.
    if (/^theme-\d+$/.test(item.id)) {
      set({ themeIndex: Number(item.id.slice('theme-'.length)) });
      return;
    }

    // Generic items
    if (item.type === 'item' || item.type === 'setting') {
      set({ expandedAbout: item as AboutItem });
      return;
    }
  },
  
  goBack: () => {
    const { expandedContent, expandedAbout, expandedPhoto, isInSubfolder } = get();

    if (expandedPhoto) {
      set({ expandedPhoto: null });
      return;
    }

    if (expandedContent) {
      set({ expandedContent: null });
      return;
    }
    
    if (expandedAbout) {
      set({ expandedAbout: null });
      return;
    }
    
    if (isInSubfolder) {
      set({ isInSubfolder: false, subfolderItems: null, currentItem: 0 });
      return;
    }
  },
  
  start: () => set({ hasStarted: true }),

  // The LED lights at once, then the screen waits a beat before it boots, as
  // a real PSP pauses between the switch and the logo.
  powerOn: () => {
    if (get().poweredOn) return;
    set({ poweredOn: true });
    setTimeout(() => get().start(), POWER_ON_DELAY_MS);
  },

  setTheme: (index) => set({ themeIndex: index }),

  // Derived from current state, not a captured value: repeated presses within
  // one render would otherwise all read the same volume and collapse to one step.
  adjustVolume: (delta) =>
    set((state) => ({ volume: Math.max(0, Math.min(1, state.volume + delta)) })),

  finishBooting: () => set({ isBooting: false }),
  
  setExpandedContent: (content) => set({ expandedContent: content }),
  
  setExpandedAbout: (content) => set({ expandedAbout: content }),

  setSettledArt: (art) => set({ settledArt: art }),
  
  toggleMute: () => {
    // Use functional update to prevent unnecessary re-renders
    set((state) => ({ isMuted: !state.isMuted }));
  },
  
  enterSubfolder: (items) => set({ isInSubfolder: true, subfolderItems: items, currentItem: 0 }),
  
  exitSubfolder: () => set({ isInSubfolder: false, subfolderItems: null, currentItem: 0 }),
}));


/** Up/Down on an open panel scroll it; the panel watches this counter. */
function scrollDetail(dir: 1 | -1) {
  usePortfolioStore.setState((s) =>
    s.expandedPhoto ? {} : { detailScroll: { dir, seq: s.detailScroll.seq + 1 } },
  );
}
