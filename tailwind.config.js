/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          surface: '#F1F5F9',
          border: '#E2E8F0',
          text: '#0F172A',
          muted: '#64748B'
        },
        dark: {
          bg: '#0F172A',
          card: '#1E293B',
          surface: '#334155',
          border: '#475569',
          text: '#F8FAFC',
          muted: '#94A3B8'
        },
        brand: {
          amber: '#D97706',
          gold: '#B45309',
          lightGold: '#FEF3C7',
          black: '#0F172A'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 4px 20px -2px rgba(217, 119, 6, 0.25)',
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
