/** @type {import('tailwindcss').Config} */
import colors from './src/style/colors.js';

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: "#161B27",
        },
        border: {
          DEFAULT: "#1B2434",
          light: ""
        },
        brand: {
          yellow: {
            DEFAULT: "#FCA311",
            hover: "#E5940F"
          }
        },
        card: colors.card,
        searchBar: colors.searchBar,
        list: colors.list,
      }
    },
  },
  plugins: [],
}

