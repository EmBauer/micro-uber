/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#7691c1',
        'secondary': '#a8c5e8'
      },
    },
  },
  plugins: [],
}

