/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004ac6",
        secondary: "#006c49",
        warning: "#f59e0b",
        danger: "#ba1a1a",
        outlineVariant: "#c3c6d7",
      }
    },
  },
  plugins: [],
}
