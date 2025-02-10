/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        '4k': '2160px',
        '2xl': '1536px',
      },
      keyframes: {
        'fade-out': {
          '0%': { opacity: '1' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        }
      },
      animation: {
        'fade-out': 'fade-out 600s ease-in-out forwards',
      }
    },
  },
  plugins: [],
};