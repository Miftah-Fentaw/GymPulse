import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#111111',
          soft:    '#222222',
          muted:   '#888888',
          ghost:   '#CCCCCC',
        },
        sheet: {
          DEFAULT: '#F4F4F5',
          card:    '#FFFFFF',
          hover:   '#ECECEC',
          border:  '#E4E4E7',
        },
        ok:   { DEFAULT: '#22C55E', light: '#DCFCE7' },
        warn: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
        bad:  { DEFAULT: '#EF4444', light: '#FEE2E2' },
        info: { DEFAULT: '#3B82F6', light: '#DBEAFE' },
        violet: { DEFAULT: '#8B5CF6', light: '#EDE9FE' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        xs:   '0 1px 3px rgba(0,0,0,.06)',
        card: '0 2px 8px rgba(0,0,0,.07)',
      },
    },
  },
  plugins: [],
}
export default config
