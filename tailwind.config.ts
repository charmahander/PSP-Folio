import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'rodin': ['NewRodin Pro', 'sans-serif'],
      },
      colors: {
        'psp': {
          'blue': '#0066cc',
          'purple': '#6633cc',
          'dark': '#1a1a2e',
          'wave': '#2d3561',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg)' },
          '50%': { transform: 'translateY(-10px) rotateX(2deg)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0) translateY(0)' },
          '50%': { transform: 'translateX(-20px) translateY(10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;


