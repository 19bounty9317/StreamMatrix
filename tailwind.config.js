/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        twitch: {
          purple: '#9146FF',
          dark: '#0E0E10',
          gray: '#18181B',
          lightgray: '#1F1F23'
        }
      }
    },
  },
  plugins: [],
}
