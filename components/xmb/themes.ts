export type WavePalette = {
  primary: string;
  secondary: string;
  accent: string;
};

export interface XmbTheme {
  id: string;
  name: string;
  /** Screen background gradient. */
  background: string;
  /** Wave colours, or null to derive them from the date the way a PSP does. */
  waves: WavePalette | null;
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

const interpolateColor = (c1: string, c2: string, t: number) => {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return rgbToHex(a.r + (b.r - a.r) * t, a.g + (b.g - a.g) * t, a.b + (b.b - a.b) * t);
};

const adjustBrightness = (hex: string, factor: number) => {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex(r * factor, g * factor, b * factor);
};

// PSP-inspired monthly hues
const monthColors = [
  '#d0b000', '#a0002e', '#b0007a', '#2f8a3d',
  '#28b5a6', '#63a3d8', '#c22626', '#c66812',
  '#7c7c7c', '#b58b32', '#7a5bd1', '#d45b9c',
];

// Brightness curve across the day (midnight low, noon peak)
const brightnessByHour = [
  0.18, 0.2, 0.22, 0.24, 0.28, 0.35, 0.45, 0.6,
  0.7, 0.8, 0.9, 1.0, 1.0, 0.95, 0.85, 0.75,
  0.65, 0.55, 0.45, 0.35, 0.3, 0.26, 0.22, 0.2,
];

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export function getDynamicPalette(now: Date, brightnessOverride?: number): WavePalette {
  const month = now.getMonth();
  const daysInMonth = getDaysInMonth(now.getFullYear(), month);
  const blend = clamp(now.getDate() / daysInMonth, 0, 1);
  const base = interpolateColor(monthColors[month], monthColors[(month + 1) % 12], blend);
  const brightness = brightnessOverride ?? brightnessByHour[now.getHours()] ?? 1;

  return {
    primary: adjustBrightness(base, clamp(brightness * 0.9, 0.15, 1.1)),
    secondary: adjustBrightness(base, clamp(brightness * 0.7, 0.12, 0.9)),
    accent: adjustBrightness(base, clamp(brightness * 1.15, 0.2, 1.2)),
  };
}

export const THEMES: XmbTheme[] = [
  {
    id: 'auto',
    name: 'Auto — shifts with month and hour',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    waves: null,
  },
  {
    id: 'ice',
    name: 'Ice',
    background: 'linear-gradient(135deg, #101d2b 0%, #12293f 50%, #0d3b57 100%)',
    waves: { accent: '#7fd4f5', primary: '#3f92c4', secondary: '#20536f' },
  },
  {
    id: 'ember',
    name: 'Ember',
    background: 'linear-gradient(135deg, #2b1416 0%, #3d1d20 50%, #5a2418 100%)',
    waves: { accent: '#ffb46b', primary: '#e2703a', secondary: '#8f3a2a' },
  },
  {
    id: 'moss',
    name: 'Moss',
    background: 'linear-gradient(135deg, #0f2420 0%, #133029 50%, #0e4038 100%)',
    waves: { accent: '#6fdcb9', primary: '#2f9c7c', secondary: '#1b5c4f' },
  },
  {
    id: 'orchid',
    name: 'Orchid',
    background: 'linear-gradient(135deg, #1e1430 0%, #2a1a45 50%, #3d1f5c 100%)',
    waves: { accent: '#c894f2', primary: '#8b5cd6', secondary: '#523682' },
  },
];

export function resolveWaves(theme: XmbTheme, now: Date): WavePalette {
  return theme.waves ?? getDynamicPalette(now);
}

/**
 * Swatch for the picker. The auto theme dims toward midnight, which would leave
 * its orb an unreadable near-black, so the swatch ignores the time-of-day curve
 * and shows the month's hue at full strength.
 */
export function orbGradient(theme: XmbTheme, now: Date): string {
  const { accent, primary, secondary } = theme.waves ?? getDynamicPalette(now, 1);
  return `linear-gradient(135deg, ${accent} 0%, ${primary} 55%, ${secondary} 100%)`;
}
