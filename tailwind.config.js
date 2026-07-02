/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        "primary-hover": "#E85A28",
        "primary-light": "#FFF4EF",
        secondary: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        outlineVariant: "#9CA3AF",
        // Mamikos Warm Palette
        ink: "#1F2937",
        body: "#374151",
        muted: "#6B7280",
        placeholder: "#9CA3AF",
        canvas: "#FFFBF9",
        elevated: "#FFFFFF",
        card: "#FFFFFF",
        "card-hover": "#FFF7F5",
        warm: "#FFF5F0",
        "border-default": "#E5E7EB",
        "border-subtle": "#F3F4F6",
        "border-warm": "#FED7CC",
      }
    },
  },
  plugins: [],
}
