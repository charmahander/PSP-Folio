'use client';

import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { THEMES, orbGradient } from '../xmb/themes';

export default function ThemeSwitcher() {
  const { themeIndex, setTheme } = usePortfolioStore();
  // The auto theme's swatch depends on the date, which the server cannot know.
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center" style={{ gap: '14px', marginTop: '64px' }}>
      {THEMES.map((theme, index) => {
        const isActive = index === themeIndex;
        return (
          <button
            key={theme.id}
            onClick={() => setTheme(index)}
            aria-label={theme.name}
            aria-pressed={isActive}
            title={theme.name}
            className="rounded-full"
            style={{
              width: '28px',
              height: '28px',
              cursor: 'pointer',
              background: now ? orbGradient(theme, now) : 'transparent',
              boxShadow: isActive
                ? '0 0 0 2px rgba(255,255,255,0.9), 0 2px 10px rgba(0,0,0,0.25)'
                : '0 0 0 1px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.12)',
              transform: isActive ? 'scale(1.12)' : 'scale(1)',
              transition: 'transform 140ms ease-out, box-shadow 140ms ease-out',
              WebkitTapHighlightColor: 'transparent',
            }}
          />
        );
      })}
    </div>
  );
}
