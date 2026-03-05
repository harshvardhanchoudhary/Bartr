import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warm parchment base
        bg: '#F6F4F1',
        'bg-2': '#EDEAE5',
        surf: '#FDFCFA',
        brd: '#E0DCD5',
        'brd-2': '#CAC5BC',
        ink: '#1A1814',
        'ink-2': '#3C3830',
        muted: '#78746E',
        faint: '#B4B0A8',
        // Bartr red
        red: {
          DEFAULT: '#C4312A',
          bg: '#FDF0EF',
          border: '#EACAC7',
        },
        // Bartr-B green
        green: {
          DEFAULT: '#1A7A4A',
          bg: '#EFF9F4',
          border: '#B5DDC8',
        },
        // Offer-gap states
        blue: {
          DEFAULT: '#1D5FA8',
          bg: '#EFF5FD',
          border: '#BACDE8',
        },
        gold: {
          DEFAULT: '#9A6C18',
          bg: '#FDF6EC',
          border: '#E3CCAA',
        },
        amber: {
          DEFAULT: '#C47A1A',
          bg: '#FDF5EC',
          border: '#E8CCAA',
        },
      },
      fontFamily: {
        serif: ['var(--font-instrument-serif)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '5px',
        DEFAULT: '11px',
        md: '14px',
        lg: '22px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(26,24,20,0.08)',
        'card-md': '0 4px 16px rgba(26,24,20,0.10)',
        sheet: '0 -4px 32px rgba(26,24,20,0.12)',
      },
      keyframes: {
        slideUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'slide-up': 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
        'fade-in': 'fadeIn 0.18s ease',
        ticker: 'ticker 24s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
