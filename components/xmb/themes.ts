export type WavePalette = {
  primary: string;
  secondary: string;
  accent: string;
};

export interface ResolvedTheme {
  background: string;
  waves: WavePalette;
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (c: number) => clamp(Math.round(c), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const shade = (hex: string, factor: number) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * factor, g * factor, b * factor);
};

/**
 * The PSP cycles one hue per calendar month, switching on the 1st. Sony never
 * published the values, so these approximate the documented descriptions.
 * Order is January through December.
 */
export const MONTH_THEMES: { name: string; base: string }[] = [
  { name: 'Grey', base: '#8a8f96' },
  { name: 'Yellow', base: '#c9a227' },
  { name: 'Light Green', base: '#8bc34a' },
  { name: 'Pink', base: '#e87faa' },
  { name: 'Dark Green', base: '#2e7d4f' },
  { name: 'Blue Purple', base: '#6b63c9' },
  { name: 'Cyan', base: '#2bb3c9' },
  { name: 'Dark Blue', base: '#2a5ca8' },
  { name: 'Purple', base: '#8e4bb0' },
  { name: 'Orange', base: '#e08a2a' },
  { name: 'Brown', base: '#8a5a33' },
  { name: 'Red', base: '#c0392b' },
];

/** Index 0 is the PSP's automatic mode; 1-12 pick a month's colour directly. */
export const BY_MONTH_INDEX = 0;

export const THEME_OPTIONS: { id: string; name: string }[] = [
  { id: 'by-month', name: 'By Month' },
  ...MONTH_THEMES.map((m, i) => ({ id: `month-${i + 1}`, name: m.name })),
];

function buildTheme(base: string): ResolvedTheme {
  return {
    background: `linear-gradient(160deg, ${shade(base, 0.16)} 0%, ${shade(base, 0.28)} 55%, ${shade(base, 0.44)} 100%)`,
    waves: {
      accent: shade(base, 1.18),
      primary: shade(base, 0.92),
      secondary: shade(base, 0.68),
    },
  };
}

function baseForIndex(index: number, now: Date): string {
  if (index === BY_MONTH_INDEX) return MONTH_THEMES[now.getMonth()].base;
  return (MONTH_THEMES[index - 1] ?? MONTH_THEMES[now.getMonth()]).base;
}

export function resolveTheme(index: number, now: Date): ResolvedTheme {
  return buildTheme(baseForIndex(index, now));
}

/** Swatch for the picker, showing the colour the option actually paints. */
export function themeSwatch(index: number, now: Date): string {
  const { accent, primary, secondary } = resolveTheme(index, now).waves;
  return `linear-gradient(135deg, ${accent} 0%, ${primary} 55%, ${secondary} 100%)`;
}
