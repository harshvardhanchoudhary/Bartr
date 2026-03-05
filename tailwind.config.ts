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
        // Bartr (consumer) palette
        bg: '#0a0a0a',
        surface: '#141414',
        'surface-2': '#1a1a1a',
        stroke: 'rgba(255,255,255,0.08)',
        'stroke-2': 'rgba(255,255,255,0.14)',
        text: 'rgba(255,255,255,0.92)',
        muted: 'rgba(255,255,255,0.62)',
        'muted-2': 'rgba(255,255,255,0.40)',
        red: {
          DEFAULT: '#C8352A',
          light: '#e11d2e',
          muted: 'rgba(200,53,42,0.12)',
          border: 'rgba(200,53,42,0.45)',
        },
        // Bartr-B (business) palette
        green: {
          DEFAULT: '#2D6A4F',
          light: '#52B788',
          muted: 'rgba(45,106,79,0.12)',
          border: 'rgba(45,106,79,0.45)',
        },
        // Status colours
        amber: {
          DEFAULT: '#D97706',
          muted: 'rgba(217,119,6,0.12)',
        },
        blue: {
          DEFAULT: '#3B82F6',
          muted: 'rgba(59,130,246,0.12)',
        },
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '16px',
        lg: '22px',
        full: '9999px',
      },
      boxShadow: {
        card: '0 18px 45px rgba(0,0,0,0.55)',
        'card-sm': '0 8px 24px rgba(0,0,0,0.40)',
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
      },
      animation: {
        'slide-up': 'slideUp 0.28s cubic-bezier(0.32,0.72,0,1)',
        'fade-in': 'fadeIn 0.18s ease',
      },
    },
  },
  plugins: [],
}

export default config
