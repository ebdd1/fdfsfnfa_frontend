---
name: Premium Dwelling System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434654'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737685'
  outline-variant: '#c3c6d6'
  surface-tint: '#1b55d0'
  primary: '#003594'
  on-primary: '#ffffff'
  primary-container: '#004ac6'
  on-primary-container: '#b8c8ff'
  inverse-primary: '#b4c5ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#004640'
  on-tertiary: '#ffffff'
  tertiary-container: '#006058'
  on-tertiary-container: '#6fdcce'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The design system is engineered for the high-end Indonesian rental market, focusing on trust, transparency, and effortless discovery. It balances the warmth of hospitality with the precision of a professional real estate marketplace.

The visual style is **Corporate Modern with a Minimalist lean**, emphasizing high-quality surfaces and ample whitespace. By utilizing a "surface-heavy" approach, the UI evokes a sense of stability and premium value, moving away from cluttered listing sites toward a curated, editorial experience. The emotional response should be one of "assured quality"—users should feel that every listing on the platform is verified and superior.

## Colors

The palette is anchored by **Trust Blue (#004AC6)**, a deep, authoritative primary used for brand moments and primary actions. To provide a modern edge, **Sophisticated Indigo (#6366F1)** is used for secondary accents and interactive highlights.

The neutral system is critical to the "surface-heavy" aesthetic. It uses a range of Blue-Grays (Slate) to maintain a cool, professional temperature. Backgrounds are primarily **Off-White (#F8FAFC)** to make white card elements pop with subtle elevation. Status colors are saturated and clear, ensuring functional feedback is immediate and accessible.

## Typography

This design system employs a dual-font strategy. **Plus Jakarta Sans** is used for headlines to provide a friendly, modern, and slightly geometric personality. **Inter** is used for body and UI labels to ensure maximum legibility at small sizes and high functional clarity for data-heavy views.

High contrast between headline and body sizes is intentional to drive conversion-focused hierarchy. Mobile adjustments are crucial for the Indonesian market; display and large headline sizes scale down significantly to ensure listing titles and prices remain clear on smaller handheld devices.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. A base unit of 4px drives all spacing decisions, ensuring a mathematical harmony across the UI. 

**Desktop:** Centered fixed-width containers (max 1280px) are preferred for search results and content pages to prevent line-lengths from becoming unreadable on ultra-wide monitors.
**Mobile:** Side margins are reduced to 20px. Horizontal scrolling "peek" cards are encouraged for category or location browsing to maximize vertical real estate. 
**Vertical Rhythm:** Use larger gaps (stack-lg) between distinct sections (e.g., between "Amenities" and "Location") and tighter gaps (stack-sm) for related metadata.

## Elevation & Depth

Hierarchy is established through **Ambient Shadows** and **Tonal Layers**. Instead of harsh borders, the system uses soft, multi-layered shadows that simulate a physical stack of paper or light cards.

- **Level 0 (Base):** Off-white background (#F8FAFC).
- **Level 1 (Cards/Inputs):** White surface with a very soft shadow: `0 2px 4px rgba(0,0,0,0.05)`.
- **Level 2 (Hover/Active):** White surface with an expanded shadow: `0 10px 25px rgba(0,0,0,0.1)`.
- **Level 3 (Modals/Overlays):** `0 20px 50px rgba(0,0,0,0.15)`.

To maintain the premium feel, shadows should carry a subtle tint of the primary color (dark blue) rather than pure black, making the depth feel more integrated into the brand environment.

## Shapes

The shape language is welcoming and "human-centered." 
- **Standard (8px):** Used for buttons, input fields, and small UI elements. This provides a professional but approachable feel.
- **Large (16px):** Used for main listing cards and container segments.
- **Extra Large (24px+):** Used for prominent call-to-action sections or "Featured" listing hero cards.

Buttons should never be sharp-edged; the medium-to-large roundedness reflects the comfort and safety associated with finding a new home.

## Components

### Buttons
- **Primary:** Trust Blue background, White text. 8px radius. On hover: darken by 10% and scale 1.02x.
- **Secondary:** White background, Trust Blue border (1px), Trust Blue text.
- **Ghost:** No background or border. For low-priority actions (e.g., "See all amenities").

### Listing Cards
The primary conversion driver.
- **Style:** 16px radius, white background, Level 1 shadow. 
- **Image:** 16:9 or 4:3 aspect ratio with 16px top-corner radius.
- **Content:** Title in Headline-sm, Price in Primary Blue (Bold), Location with a small Lucide 'MapPin' icon.

### Input Fields
- **Style:** 8px radius, Slate-100 background. Focus state: 1px Trust Blue border with a soft blue outer glow.
- **Labels:** Label-md typography, positioned clearly above the input.

### Chips & Badges
- **Status Badges:** Use light tints of status colors (e.g., Success Green at 10% opacity) with dark text for "Available," "Verified," or "Discount."
- **Search Chips:** 100px+ roundedness (pill-shaped) for selecting locations or price ranges.

### Iconography
- Use **Lucide** icons with a 1.5pt or 2pt stroke weight. Icons should always be centered within a square bounding box. For the Indonesian context, ensure specific icons for "AC," "WiFi," and "Laundry" are clear and consistently styled.