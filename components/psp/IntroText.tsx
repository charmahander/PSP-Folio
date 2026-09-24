'use client';

import { motion } from 'framer-motion';

/** Each block follows the one before it by this much. */
const STAGGER_S = 0.3;

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
        {'Welcome to '}
        <strong style={{ fontWeight: 700 }}>PSPFolio</strong>
        {
          ': a fun reimagining of my old PSP 1000 if it was my portfolio/website itself (as if the device IS the folio!).'
        }
      </motion.p>
      <motion.p variants={block} style={{ marginTop: '14px' }}>
        {
          "Built the device's design on Figma, brought it to life with Cursor with Sonnet last year, then revamped it recently in Claude Code with Opus 5. It's navigable with your mouse, keys, touch, and even the console buttons; and for added nostalgia, the original sounds! The XMB Interface was tricky to build but you learn a lot from the '00s. Enjoy!"
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
