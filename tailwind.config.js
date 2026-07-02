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
        // Clay Design System colors
        ink: "#000000",
        body: "#282c35",
        muted: "#52525b",
        placeholder: "#71717a",
        canvas: "#f9f8f6",
        elevated: "#ffffff",
        card: "#ffffff",
        "card-hover": "#f3f2ed",
        "border-default": "#d4d4d8",
        "border-subtle": "#e8e8ea",
      }
    },
  },
  plugins: [],
}
