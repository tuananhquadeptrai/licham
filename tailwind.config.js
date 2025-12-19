/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Be Vietnam Pro', 'system-ui', 'sans-serif'],
      },
      colors: {
        lunar: {
          red: '#D32F2F',
          gold: '#FFB300',
          dark: '#1a1a2e',
        },
      },
    },
  },
  plugins: [],
}
