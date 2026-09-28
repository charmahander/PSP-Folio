'use client';

import { motion } from 'framer-motion';

/** Each block follows the one before it by this much. */
const STAGGER_S = 0.15;

const group = {
  hidden: {},
  show: {
    transition: {
      // Lets the device settle first, then the copy arrives under it.
      delayChildren: 0.45,
      staggerChildren: STAGGER_S,
    },
  },
};

const block = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

/** An app icon set into the line, sized to the text around it. */
function ToolMark({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      width={16}
      height={16}
      style={{
        display: 'inline-block',
        width: '1.3em',
        height: '1.3em',
        verticalAlign: '-0.3em',
        marginRight: '0.25em',
      }}
    />
  );
}

export default function IntroText() {
  return (
    <motion.div
      variants={group}
      initial="hidden"
      animate="show"
      className="font-rodin text-center px-6 balanced-text intro-copy"
      style={{
        maxWidth: '660px',
        color: '#5b6167',
        lineHeight: 1.65,
      }}
    >
      <motion.p variants={block}>
        {'A fun reimagining of my old '}
        <strong style={{ fontWeight: 700 }}>PSP 1000</strong>
        {' if it was a portfolio/website i.e. where the device IS the folio!'}
      </motion.p>
      <motion.p variants={block} style={{ marginTop: '14px' }}>
        {'Built with '}
        <ToolMark src="/logos/figma.png" alt="Figma" />
        <ToolMark src="/logos/claude.png" alt="Claude" />
        {
          ' and navigable with your mouse, keyboard, touch, and console buttons. For added nostalgia, playing the original sounds!'
        }
      </motion.p>
      <motion.p variants={block} style={{ marginTop: '20px' }}>
        {'As seen on '}
        <a
          href="https://x.com/charmahander/status/1999188731807285355?s=20"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#3a4046', textDecoration: 'underline', textUnderlineOffset: '2px' }}
        >
          Twitter
        </a>
        {' :)'}
      </motion.p>
    </motion.div>
  );
}
