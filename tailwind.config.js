/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f3e8d7', // Couleur amande
        secondary: '#a38f6a' // Couleur accent
      }
    },
  },
  plugins: [],
}
