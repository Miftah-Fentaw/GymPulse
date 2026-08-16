import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: '#1C2434',
          hover: '#333A48',
          active: '#3C4557',
          text: '#DEE4EE',
          muted: '#8A99AF',
          border: '#2E3A4E',
        },
        brand: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#EFF6FF',
        },
        surface: {
          DEFAULT: '#F1F5F9',
          card: '#FFFFFF',
          border: '#E2E8F0',
        },
        success: { DEFAULT: '#10B981', light: '#D1FAE5' },
        warning: { DEFAULT: '#F59E0B', light: '#FEF3C7' },
        danger:  { DEFAULT: '#EF4444', light: '#FEE2E2' },
        info:    { DEFAULT: '#3B82F6', light: '#DBEAFE' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,.07), 0 1px 2px -1px rgba(0,0,0,.07)',
        dropdown: '0 4px 16px rgba(0,0,0,.12)',
      },
    },
  },
  plugins: [],
}
export default config
