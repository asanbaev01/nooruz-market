/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#006948',
        'primary-light': '#00855d',
        'primary-dark': '#004d34',
        gold: '#d4a843',
        'gold-light': '#f0d68a',
        cream: '#fdf8f0',
        'dark-green': '#1a3a2a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}