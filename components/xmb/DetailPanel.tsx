'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import type { AboutItem, CaseStudy } from '@/types/xmb';
import { px, DETAIL_PANEL_SHARE, PANEL_TOP } from './layout';

/**
 * Feathers the drawer's left edge. A hard edge made the blurred region read as
 * a solid block laid over the menu rather than the menu seen through glass.
 */
const EDGE_FEATHER = `linear-gradient(90deg, transparent 0, #000 ${px(14)})`;

const TITLE_SIZE = 15;
const BODY_SIZE = 9.5;

/**
 * One spacing scale for the whole drawer, in screen grid units: 4 inside a
 * group, 8 between items, 12 before a sub-heading, 16 between sections. The
 * gap under the status bar is a section gap too, so the drawer's content sits
 * as far from the bar as its sections sit from each other.
 */
const SPACE = { tight: 4, item: 8, group: 12, section: 16 } as const;
const PAD_X = 16;
const PAD_BOTTOM = 20;

/**
 * Fades content out at the scroll area's edges instead of a scrollbar: the
 * bottom fade says there is more, the top one softens text scrolling away.
 */
const SCROLL_FADE = `linear-gradient(180deg, transparent 0, #000 ${px(SPACE.tight)}, #000 calc(100% - ${px(18)}), transparent 100%)`;

/**
 * What X opens, drawn on the screen itself rather than as a page overlay: the
 * right 55%, over a blurred view of whatever the menu was showing. The
 * highlighted row steps aside to the left edge to sit beside it.
 */
export default function DetailPanel() {
  const { expandedContent, expandedAbout, detailScroll } = usePortfolioStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const openId = expandedContent?.id ?? expandedAbout?.id ?? null;

  // The d-pad scrolls the panel while it is open. Skips the value it opened
  // with, so an old press does not scroll a freshly opened panel.
  const openedAt = useRef(detailScroll.seq);
  useEffect(() => {
    openedAt.current = usePortfolioStore.getState().detailScroll.seq;
    scrollRef.current?.scrollTo({ top: 0 });
  }, [openId]);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || detailScroll.seq === openedAt.current) return;
    el.scrollBy({ top: detailScroll.dir * el.clientHeight * 0.4, behavior: 'smooth' });
  }, [detailScroll]);

  return (
    <AnimatePresence>
      {openId && (
        <motion.div
          key={openId}
          className="absolute top-0 right-0 bottom-0 z-30 text-white"
          style={{
            width: `${DETAIL_PANEL_SHARE * 100}%`,
            // Blur alone, no fill and no colour boost. Heavy enough to calm the
            // text's backdrop, light enough that the waves still read through
            // as soft light - a stronger blur averaged them into one flat
            // purple, which looked like a solid panel.
            backdropFilter: `blur(${px(9)})`,
            WebkitBackdropFilter: `blur(${px(9)})`,
            WebkitMaskImage: EDGE_FEATHER,
            maskImage: EDGE_FEATHER,
            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          }}
          initial={{ opacity: 0, x: '8%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '8%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          // The panel scrolls natively on touch, so a drag here must not also
          // reach the screen's swipe handler and move the menu behind it.
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scrolls beneath the status bar's band rather than under it, so
              the date, time and battery stay clear while reading. */}
          <div
            ref={scrollRef}
            className="absolute left-0 right-0 bottom-0 overflow-y-auto no-scrollbar"
            style={{
              top: px(PANEL_TOP),
              padding: `${px(SPACE.tight)} ${px(PAD_X)} ${px(PAD_BOTTOM)}`,
              WebkitMaskImage: SCROLL_FADE,
              maskImage: SCROLL_FADE,
            }}
          >
            {expandedContent ? (
              <ProjectBody project={expandedContent} />
            ) : expandedAbout ? (
              <AboutBody item={expandedAbout} />
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Stacks its children with one gap, so spacing lives in one place. */
function Stack({ gap, children, style }: { gap: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="flex flex-col" style={{ gap: px(gap), ...style }}>
      {children}
    </div>
  );
}

function Header({ title, subtitle }: { title: React.ReactNode; subtitle?: string }) {
  return (
    <Stack gap={SPACE.tight}>
      <h2 style={{ fontSize: px(TITLE_SIZE), lineHeight: 1.2, fontWeight: 400, margin: 0 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: px(BODY_SIZE), lineHeight: 1.4, opacity: 0.7 }}>{subtitle}</p>}
    </Stack>
  );
}

function Figure({ src, alt, position = 'center' }: { src: string; alt: string; position?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full block"
      style={{ aspectRatio: '1.9', objectFit: 'cover', objectPosition: position }}
    />
  );
}

const bodyText: React.CSSProperties = { fontSize: px(BODY_SIZE), lineHeight: 1.55 };

function ProjectBody({ project }: { project: CaseStudy }) {
  const { content } = project;
  const rows = (
    [
      ['Role', content.role],
      ['Skills', content.skills ?? project.categories?.join(', ')],
      ['Timeline', content.timeline ?? content.duration],
    ] as [string, string | undefined][]
  ).filter(([, value]) => value);

  return (
    <Stack gap={SPACE.section}>
      <Header title={`${project.title}: ${project.tagline}`} />

      {/* Label left, value right-aligned; each row sizes its own label so a
          long value keeps the full width it needs */}
      <Stack gap={SPACE.tight} style={{ fontSize: px(BODY_SIZE), lineHeight: 1.4 }}>
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between" style={{ gap: px(SPACE.group) }}>
            <span style={{ fontWeight: 500 }}>{label}</span>
            <span className="text-right" style={{ opacity: 0.8 }}>
              {value}
            </span>
          </div>
        ))}
      </Stack>

      <Figure src={project.thumbnail} alt={project.title} />

      <Stack gap={SPACE.group} style={{ ...bodyText, opacity: 0.85 }}>
        {content.overview && <p>{content.overview}</p>}
        {content.sections.map((section) => (
          <Stack key={section.title} gap={SPACE.tight}>
            <h3 style={{ fontWeight: 500 }}>{section.title}</h3>
            <p>{section.content}</p>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

function AboutBody({ item }: { item: AboutItem }) {
  const { detail } = item;

  return (
    <Stack gap={SPACE.section}>
      <Header title={item.title} subtitle={item.description} />

      {item.photo && <Figure src={item.photo} alt={item.title} position="50% 30%" />}

      {detail?.kind === 'paragraphs' && (
        <Stack gap={SPACE.item} style={{ ...bodyText, opacity: 0.85 }}>
          {detail.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </Stack>
      )}

      {detail?.kind === 'list' && (
        <ul className="list-disc flex flex-col" style={{ ...bodyText, gap: px(SPACE.item), paddingLeft: px(SPACE.group), margin: 0 }}>
          {detail.items.map((entry, i) => (
            <li key={i}>
              <span className="block" style={{ fontWeight: 500 }}>{entry.title}</span>
              <span className="block" style={{ opacity: 0.8 }}>{entry.body}</span>
            </li>
          ))}
        </ul>
      )}
    </Stack>
  );
}
