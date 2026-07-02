# KostFind Design System — MASTER
**Version:** 1.0.0  
**Last Updated:** 2026-06-21  
**Stack:** React 19 + TypeScript + Tailwind CSS 4.3.1 + Vite

---

## 🎯 Product Context

**KostFind** adalah marketplace peer-to-peer untuk pencarian dan booking kost di Indonesia, menghubungkan pencari kost (mahasiswa) dengan pemilik kost.

**Kategori:** Marketplace (P2P) + Booking & Appointment  
**Target User:** Mahasiswa Indonesia, Pemilik Kost  
**Kompetitor:** Mamikos, RukitaKost, Travelio

---

## 🎨 Design Pattern: Marketplace / Directory

### Conversion Strategy
- **Hero Search Bar** sebagai CTA utama (reduce friction to search)
- Map hover pins untuk visual discovery
- Card carousel untuk featured listings
- Popular searches suggestions
- Navbar CTA: "List your property" untuk pemilik kost

### Page Structure
1. **Hero** (Search-focused dengan city/price filters)
2. **Categories** (By city, by price range, by facilities)
3. **Featured Listings** (Verified kost, new listings)
4. **Trust/Safety** (Verified badges, reviews, secure payment)
5. **CTA** (Become a host/list your kost)

---

## 🎨 Brand Colors (EXISTING — DO NOT CHANGE)

KostFind sudah memiliki brand colors yang established. **Pertahankan warna ini:**

```css
--color-primary: #004ac6;      /* Blue Trust — auth, CTA utama */
--color-secondary: #006c49;    /* Green Safe — success, verified */
--color-warning: #f59e0b;      /* Amber Warning */
--color-danger: #ba1a1a;       /* Red Alert */
--color-outline-variant: #c3c6d7;
```

### Usage Guidelines
- **Primary (`#004ac6`)**: CTA buttons, links, active states, trust indicators
- **Secondary (`#006c49`)**: Success messages, verified badges, safe transactions
- **Warning (`#f59e0b`)**: Attention needed, pending states
- **Danger (`#ba1a1a`)**: Errors, destructive actions, critical warnings

---

## 🎨 Extended Palette (Recommended)

Untuk melengkapi brand colors existing:

```css
/* Neutral Scale (for text, backgrounds, borders) */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;

/* Accent (for highlights, badges, special features) */
--color-accent: #f59e0b;      /* Match warning color */
--color-accent-light: #fef3c7;
```

---

## 🎨 Clay Design System (from layout-context MCP)

**Source:** `.layout/tokens.json` — Clay.com Design System

### Quick Reference
```css
:root {
  /* Primary Accent */
  --clay-accent: #3859f9;           /* Blueberry-400 */
  --clay-accent-warm: #fa6900;      /* Tangarine-600 */
  --clay-accent-cool: #0382f7;     /* Blueberry-500 */
  --clay-accent-hover: rgb(255, 118, 20);

  /* Text */
  --clay-text-primary: #000000;
  --clay-text-secondary: #282c35;

  /* Backgrounds (Oat Scale) */
  --clay-oat-50: #fffcfa;
  --clay-oat-100: #f9f8f6;
  --clay-oat-200: #f3f2ed;
  --clay-oat-300: #eee9df;

  /* Borders */
  --clay-border: #302f2c;

  /* Status */
  --clay-success: #047e4a;
  --clay-warning: #fcbe11;
  --clay-error: #b21a3f;
  --clay-info: #038ff7;

  /* Spacing */
  --clay-space-sm: 12px;
  --clay-space-md: 24px;
  --clay-space-lg: 20px;
  --clay-space-xl: 32px;

  /* Radius */
  --clay-radius-full: 12px;
}
```

### NEVER Rules (Clay)
- NEVER use `Inter`, `Roboto`, or `Arial` as primary font
- NEVER use hardcoded hex colors — always reference `--clay-*` tokens
- NEVER use border-radius > 12px on primary buttons
- NEVER construct spacing values outside the defined scale
- NEVER omit hover, focus-visible, and active states
- NEVER use `!important` to override token values

### How to Apply Clay Tokens
```tsx
// Tailwind with CSS vars
<button className="bg-[var(--clay-accent)] text-white rounded-[var(--clay-radius-full)]">
  CTA Button
</button>

// Style object
<button style={{
  backgroundColor: 'var(--clay-accent)',
  borderRadius: 'var(--clay-radius-full)',
  transition: 'all 0.3s ease'
}}>
  CTA Button
</button>
```

---

## 🔤 Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
```

**Rationale:** Inter sangat readable untuk Bahasa Indonesia, support OpenType features, gratis, dan widely adopted.

### Type Scale

| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| **Hero Heading** | 3.5rem (56px) | 800 | 1.1 | Landing hero title |
| **H1** | 2.25rem (36px) | 700 | 1.2 | Page titles |
| **H2** | 1.875rem (30px) | 700 | 1.3 | Section headers |
| **H3** | 1.5rem (24px) | 600 | 1.4 | Subsection headers |
| **H4** | 1.25rem (20px) | 600 | 1.5 | Card titles |
| **Body Large** | 1.125rem (18px) | 400 | 1.6 | Feature descriptions |
| **Body** | 1rem (16px) | 400 | 1.5 | Default text |
| **Body Small** | 0.875rem (14px) | 400 | 1.5 | Secondary text, labels |
| **Caption** | 0.75rem (12px) | 500 | 1.4 | Metadata, timestamps |

### Responsive Typography
```css
@media (max-width: 768px) {
  /* Scale down for mobile */
  --font-hero: 2.5rem;
  --font-h1: 1.875rem;
  --font-h2: 1.5rem;
}
```

---

## 📐 Spacing Scale

Tailwind default spacing dengan beberapa custom values:

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

### Component Spacing Guidelines
- **Card padding**: `p-6` (24px) desktop, `p-4` (16px) mobile
- **Section margin**: `my-16` (64px) desktop, `my-8` (32px) mobile
- **Input padding**: `py-3 px-4` (12px 16px)
- **Button padding**: `py-3 px-6` (12px 24px)

---

## 🔘 Components

### Buttons

#### Primary (CTA utama)
```tsx
<button className="
  bg-primary hover:bg-[#003a9e] 
  text-white font-semibold 
  py-3 px-6 rounded-lg 
  transition-colors duration-200 
  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Cari Kost
</button>
```

#### Secondary (Action kedua)
```tsx
<button className="
  bg-white border-2 border-primary text-primary 
  hover:bg-gray-50 
  font-semibold py-3 px-6 rounded-lg 
  transition-colors duration-200 
  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
">
  List Kost Anda
</button>
```

#### Ghost (Tertiary)
```tsx
<button className="
  text-primary hover:bg-gray-100 
  font-semibold py-3 px-6 rounded-lg 
  transition-colors duration-200
">
  Pelajari Lebih Lanjut
</button>
```

### Cards (Listing Card)

```tsx
<div className="
  bg-white rounded-xl shadow-sm hover:shadow-md 
  transition-shadow duration-200 
  overflow-hidden border border-gray-200
">
  <img src="..." className="w-full h-48 object-cover" />
  <div className="p-4">
    <h3 className="font-semibold text-lg text-gray-900">Kost Nyaman Jogja</h3>
    <p className="text-sm text-gray-500 mt-1">Sleman, Yogyakarta</p>
    <div className="mt-3 flex items-center justify-between">
      <span className="text-xl font-bold text-primary">Rp 1.2jt/bln</span>
      <span className="text-xs text-gray-400">⭐ 4.8 (120)</span>
    </div>
  </div>
</div>
```

### Input Fields

```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Lokasi Kost
  </label>
  <input 
    type="text"
    className="
      w-full px-4 py-3 
      border border-gray-300 rounded-lg 
      focus:ring-2 focus:ring-primary focus:border-transparent 
      transition-all duration-200
      placeholder:text-gray-400
    "
    placeholder="Contoh: Jogja, Bandung, Jakarta"
  />
</div>
```

---

## ✨ Effects & Animation

### Hover Transitions
```css
/* Standard hover: 200ms ease */
transition: all 200ms ease;

/* Card lift */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
```

### Focus States (Accessibility)
```css
/* Keyboard focus ring */
focus:outline-none 
focus:ring-2 
focus:ring-primary 
focus:ring-offset-2
```

### Loading States
```tsx
<div className="animate-pulse">
  <div className="h-48 bg-gray-200 rounded-t-xl"></div>
  <div className="p-4 space-y-3">
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile first */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices (large desktops) */
2xl: 1536px /* 2X large devices */
```

### Test Viewports
- Mobile: **375px** (iPhone SE)
- Tablet: **768px** (iPad)
- Desktop: **1440px** (Standard laptop)

---

## ♿ Accessibility

### Contrast Ratios
- **Body text**: Minimum 4.5:1 (WCAG AA)
- **Large text (18px+)**: Minimum 3:1
- **Interactive elements**: Minimum 4.5:1

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus states visible (ring-2 ring-primary)
- Tab order logical

### Screen Readers
```tsx
<button aria-label="Cari kost di Jogja">
  <SearchIcon />
</button>

<img src="..." alt="Kamar kost dengan AC dan WiFi di Sleman" />
```

### Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🚫 Anti-Patterns (AVOID)

❌ **Glassmorphism** — Rekomendasi skill suggest ini, tapi **TIDAK COCOK** untuk marketplace kost Indonesia:
- Performance issue di mobile low-end (backdrop-filter berat)
- Accessibility issue (text on blur background sulit dibaca)
- Terlalu "fancy" untuk konteks pencarian kost (trust > style)

❌ **Purple gradients** (`#7C3AED`) — Rekomendasi skill, tapi **JANGAN GANTI** brand color existing (`#004ac6`)

❌ **Over-animation** — Keep animation subtle, marketplace bukan portfolio

❌ **Tiny text** — Hindari font < 14px untuk body text (Bahasa Indonesia butuh readability tinggi)

❌ **Emoji sebagai icon** — Use Lucide React icons, bukan emoji

---

## ✅ Pre-Delivery Checklist

Sebelum consider komponen "done", pastikan:

- [ ] Hover states implemented (200ms transition)
- [ ] Focus states visible (keyboard navigation)
- [ ] Contrast ratio ≥ 4.5:1 untuk text
- [ ] Responsive di 375px, 768px, 1440px
- [ ] Loading states designed
- [ ] Error states designed
- [ ] Empty states designed
- [ ] No console errors/warnings
- [ ] Alt text untuk semua images
- [ ] ARIA labels untuk icon-only buttons
- [ ] Cursor pointer pada semua clickable elements
- [ ] Tested dengan screen reader (basic check)
- [ ] Motion respects `prefers-reduced-motion`

---

## 🔗 Page-Specific Overrides

Beberapa halaman butuh treatment khusus. Lihat:

- `design-system/pages/auth.md` — Login/Register (trust-focused)
- `design-system/pages/listing-detail.md` — Detail kost (conversion-optimized)
- `design-system/pages/conversations.md` — Chat UI (realtime indicators)
- `design-system/pages/admin.md` — Admin dashboard (data-dense)

Jika ada konflik antara MASTER.md dan page-specific file, **prioritaskan page-specific**.

---

## 🛠️ Integration with Claude Code

Saat membangun UI baru, Claude Code akan otomatis:
1. Baca `design-system/MASTER.md` (file ini)
2. Cek apakah ada `design-system/pages/[page-name].md`
3. Jika ada konflik, prioritaskan page-specific override
4. Generate code yang sesuai dengan design system ini

**Stack reminder:**
- React 19 + TypeScript
- Tailwind CSS (no inline styles)
- Lucide React untuk icons
- Framer Motion untuk animation (optional)

---

**Dibuat dengan:** UI/UX Pro Max Skill v2.5.0  
**Adapted untuk:** KostFind (CarimiKost'ta)  
**Maintainer:** Development Team
