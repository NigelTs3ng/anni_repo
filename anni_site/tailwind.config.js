/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rose': {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
        },
        'amber': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
        },
        'peach': {
          50: '#fff5f0',
          100: '#ffe8e0',
        },
        'lavender': {
          200: '#e9d5ff',
          300: '#d8b4fe',
        },
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      spacing: {
        '28': '7rem',
      },
    },
  },
  plugins: [],
}


