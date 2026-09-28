'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePortfolioStore } from '@/stores/portfolioStore';
import type { AboutItem, CaseStudy } from '@/types/xmb';
import { px, DETAIL_PANEL_SHARE } from './layout';

const PAD = 16;
const TITLE_SIZE = 15;
const BODY_SIZE = 9.5;

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
            // Blur alone, no tinted fill: whatever the menu shows behind the
            // panel reads through it. A shadow on the text keeps it legible
            // over bright artwork without a solid backing.
            backdropFilter: `blur(${px(22)}) saturate(1.2)`,
            WebkitBackdropFilter: `blur(${px(22)}) saturate(1.2)`,
            textShadow: '0 1px 3px rgba(0,0,0,0.55)',
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
          <div
            ref={scrollRef}
            className="h-full overflow-y-auto xmb-scrollable"
            style={{ padding: `${px(14)} ${px(PAD)} ${px(PAD)}` }}
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

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: px(TITLE_SIZE),
        lineHeight: 1.2,
        fontWeight: 400,
        margin: 0,
      }}
    >
      {children}
    </h2>
  );
}

function ProjectBody({ project }: { project: CaseStudy }) {
  const { content } = project;
  const rows: [string, string | undefined][] = [
    ['Role', content.role],
    ['Skills', content.skills ?? project.categories?.join(', ')],
    ['Timeline', content.timeline ?? content.duration],
  ];

  return (
    <>
      <Title>
        {project.title}: {project.tagline}
      </Title>

      <dl style={{ marginTop: px(14), fontSize: px(BODY_SIZE) }}>
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between"
              style={{ gap: px(12), marginTop: px(5) }}
            >
              <dt style={{ fontWeight: 500 }}>{label}</dt>
              <dd className="text-right" style={{ margin: 0, opacity: 0.8 }}>
                {value}
              </dd>
            </div>
          ))}
      </dl>

      <img
        src={project.thumbnail}
        alt={project.title}
        className="w-full block"
        style={{ marginTop: px(14), aspectRatio: '1.9', objectFit: 'cover' }}
      />

      <div style={{ fontSize: px(BODY_SIZE), lineHeight: 1.5, opacity: 0.85 }}>
        {content.overview && <p style={{ marginTop: px(14) }}>{content.overview}</p>}
        {content.sections.map((section) => (
          <div key={section.title} style={{ marginTop: px(12) }}>
            <h3 style={{ fontWeight: 500, opacity: 1 }}>{section.title}</h3>
            <p style={{ marginTop: px(3) }}>{section.content}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function AboutBody({ item }: { item: AboutItem }) {
  const { detail } = item;

  return (
    <>
      <Title>{item.title}</Title>
      {item.description && (
        <p style={{ marginTop: px(4), fontSize: px(BODY_SIZE), opacity: 0.7 }}>
          {item.description}
        </p>
      )}

      {item.photo && (
        <img
          src={item.photo}
          alt={item.title}
          className="w-full block"
          style={{ marginTop: px(12), aspectRatio: '1.9', objectFit: 'cover', objectPosition: '50% 30%' }}
        />
      )}

      <div style={{ marginTop: px(12), fontSize: px(BODY_SIZE), lineHeight: 1.55 }}>
        {detail?.kind === 'paragraphs' &&
          detail.body.map((paragraph, i) => (
            <p key={i} style={{ marginTop: i ? px(8) : 0, opacity: 0.85 }}>
              {paragraph}
            </p>
          ))}

        {detail?.kind === 'list' && (
          <ul className="list-disc" style={{ paddingLeft: px(12) }}>
            {detail.items.map((entry, i) => (
              <li key={i} style={{ marginTop: i ? px(8) : 0 }}>
                <span style={{ fontWeight: 500 }}>{entry.title}</span>
                <span className="block" style={{ opacity: 0.8 }}>
                  {entry.body}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
