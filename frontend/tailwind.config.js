/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
    "dark-primary": "#282a36", 
    "dark-secondary": "#A65D5D",
    "dark-ternary": "#7E88BF",
    'accent-1': '#BDC4E4'
    }, 
    extend: {},
  },
  plugins: [],
}

