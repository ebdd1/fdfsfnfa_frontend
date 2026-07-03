/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Premium Design System Colors - Trust Blue Theme
      colors: {
        // Primary - Trust Blue
        primary: {
          DEFAULT: "#003594",
          light: "#4d7cff",
          container: "#004ac6",
          fixed: "#dbe1ff",
          "fixed-dim": "#b4c5ff",
          "on-fixed": "#00174b",
          "on-fixed-variant": "#003ea8",
          "on-container": "#b8c8ff",
        },
        // Secondary - Sophisticated Indigo
        secondary: {
          DEFAULT: "#4648d4",
          container: "#6063ee",
          fixed: "#e1e0ff",
          "fixed-dim": "#c0c1ff",
          "on-fixed": "#07006c",
          "on-fixed-variant": "#2f2ebe",
          "on-container": "#fffbff",
        },
        // Tertiary - Professional Green
        tertiary: {
          DEFAULT: "#004640",
          container: "#006058",
          fixed: "#89f5e7",
          "fixed-dim": "#6bd8cb",
          "on-fixed": "#00201d",
          "on-fixed-variant": "#005049",
          "on-container": "#6fdcce",
        },
        // Surface System (Elevation)
        surface: {
          DEFAULT: "#f8f9ff",
          dim: "#cbdbf5",
          bright: "#f8f9ff",
          "container-lowest": "#ffffff",
          "container-low": "#eff4ff",
          container: "#e5eeff",
          "container-high": "#dce9ff",
          "container-highest": "#d3e4fe",
          variant: "#d3e4fe",
          tint: "#1b55d0",
        },
        // On Colors (Text on surfaces)
        "on-surface": "#0b1c30",
        "on-surface-variant": "#434654",
        "on-background": "#0b1c30",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-tertiary": "#ffffff",
        // Inverse Colors (Dark surfaces)
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "inverse-primary": "#b4c5ff",
        // Outline & Borders
        outline: "#737685",
        "outline-variant": "#c3c6d6",
        // Error
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
          "on-container": "#93000a",
          "on-error": "#ffffff",
        },
        // Background
        background: "#f8f9ff",
        "on-background": "#0b1c30",
      },
      // Border Radius
      borderRadius: {
        DEFAULT: "0.25rem", // 4px
        sm: "0.25rem",
        lg: "0.5rem", // 8px
        xl: "0.75rem", // 12px
        "2xl": "1rem", // 16px
        "3xl": "1.5rem", // 24px
        full: "9999px", // Pill
      },
      // Spacing System (4px base)
      spacing: {
        base: "4px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "24px",
        gutter: "24px",
        "margin-mobile": "20px",
        "margin-desktop": "40px",
        "container-max": "1280px",
      },
      // Font Families
      fontFamily: {
        // Headlines - Plus Jakarta Sans
        display: ["Plus Jakarta Sans", "sans-serif"],
        headline: ["Plus Jakarta Sans", "sans-serif"],
        // Body - Inter
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
      },
      // Font Sizes
      fontSize: {
        // Display
        "display-lg": ["48px", { lineHeight: "60px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" }],
        // Headlines
        "headline-lg": ["30px", { lineHeight: "38px", fontWeight: "600" }],
        "headline-lg-mobile": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        // Body
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        // Labels
        "label-md": ["14px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" }],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      // Shadows (Elevation with blue tint)
      boxShadow: {
        "elevation-1": "0 2px 4px rgba(0, 0, 0, 0.05)",
        "elevation-2": "0 4px 8px rgba(0, 0, 0, 0.08)",
        "elevation-3": "0 8px 16px rgba(0, 0, 0, 0.1)",
        "elevation-hover": "0 10px 25px rgba(0, 0, 0, 0.1)",
        "elevation-modal": "0 20px 50px rgba(0, 0, 0, 0.15)",
        card: "0 2px 4px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 10px 25px rgba(0, 0, 0, 0.1)",
      },
      // Container
      container: {
        center: true,
        padding: {
          DEFAULT: "20px",
          md: "40px",
        },
        maxWidth: "1280px",
      },
    },
  },
  plugins: [],
}
