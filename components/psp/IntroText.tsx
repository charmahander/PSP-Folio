'use client';

export default function IntroText() {
  return (
    <div
      className="font-rodin text-center px-6"
      style={{
        marginTop: '80px',
        maxWidth: '660px',
        color: '#5b6167',
        fontSize: '14px',
        lineHeight: 1.65,
      }}
    >
      <p>
        {
          'Welcome to PSPFolio: a fun reimagining of my old PSP 1000 if it was my portfolio/website itself (as if the device IS the folio!).'
        }
      </p>
      <p style={{ marginTop: '14px' }}>
        {
          "I built the design of the device in Figma, brought it to Cursor, got bored of Cursor (sorry), and revamped it in Claude Code. It's navigable with mouse, keys, and the console buttons + the original sounds! The XMB Interface was tricky to build but I learnt a lot!"
        }
      </p>
      <p style={{ marginTop: '20px' }}>
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
      </p>
    </div>
  );
}
