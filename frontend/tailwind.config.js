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
    "dark-secondary": "#44475a",
    "dark-ternary": "#6272a4",
    }, 
    extend: {},
  },
  plugins: [],
}

