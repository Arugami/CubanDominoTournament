/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cuban color palette
        cuban: {
          // Deep navy background (the "night")
          navy: '#001F3F',
          // Table wood tones
          walnut: '#8B6F47',
          mahogany: '#5A3825',
          honey: '#B8956A',
          // Accents
          emerald: '#2ECC71',
          tobacco: '#6B4423',
          cream: '#FAEBD7',
          // System highlights
          gold: '#FFC107',
        },
        // Semantic colors
        table: {
          wood: '#8B6F47',
          felt: '#2ECC71',
          edge: '#D4AF37', // Gold brass
        },
        tile: {
          ivory: '#FFFFF0',
          shadow: '#1a1a1a',
        },
        state: {
          active: '#2ECC71',
          timeout: '#FFA500',
          error: '#E74C3C',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'], // For lingo overlays
      },
      spacing: {
        'table': '85vh',
        'tile': '48px',
      },
      animation: {
        'tile-slam': 'tileSlam 280ms cubic-bezier(0.4, 0, 0.1, 1.4)',
        'tile-shake': 'tileShake 100ms ease-in-out',
        'pulse-glow': 'pulseGlow 1s ease-in-out infinite',
        'fan-shadow': 'fanShadow 12s linear infinite',
      },
      keyframes: {
        tileSlam: {
          '0%': { transform: 'translateY(-20px) scale(0.9)', opacity: '0' },
          '70%': { transform: 'translateY(2px) scale(1.02)' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        tileShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fanShadow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        'tile': '0 4px 8px rgba(0, 0, 0, 0.3)',
        'tile-hover': '0 6px 12px rgba(0, 0, 0, 0.4)',
        'table': 'inset 0 2px 4px rgba(0, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
}
