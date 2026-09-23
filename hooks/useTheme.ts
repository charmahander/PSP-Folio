'use client';

import { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { resolveTheme, type ResolvedTheme } from '@/components/xmb/themes';

/**
 * Resolves the selected theme. The date only matters for the PSP's "By Month"
 * mode; the whole scene is client-only, so reading the clock is safe here.
 */
export function useTheme(): ResolvedTheme {
  const themeIndex = usePortfolioStore((s) => s.themeIndex);
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  return resolveTheme(themeIndex, now);
}
