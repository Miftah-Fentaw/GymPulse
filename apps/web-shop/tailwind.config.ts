import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F15B2A',
          dark:    '#D94E22',
          light:   '#FFF1EC',
          50:      '#FFF7F4',
        },
        sidebar: {
          bg:     '#FFFFFF',
          border: '#F0F0F0',
          text:   '#374151',
          muted:  '#9CA3AF',
          active: '#FFF1EC',
        },
        surface: {
          DEFAULT: '#F8F9FA',
          card:    '#FFFFFF',
          border:  '#E9ECEF',
        },
        success: { DEFAULT: '#22C55E', light: '#DCFCE7' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
        danger:  { DEFAULT: '#EF4444', light: '#FEE2E2' },
        info:    { DEFAULT: '#3B82F6', light: '#DBEAFE' },
        violet:  { DEFAULT: '#8B5CF6', light: '#EDE9FE' },
        teal:    { DEFAULT: '#14B8A6', light: '#CCFBF1' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,.06)',
        lift: '0 4px 16px rgba(0,0,0,.10)',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
export default config
