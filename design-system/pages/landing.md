# KostFind Landing Page — Page-Specific Design Override

**File:** `design-system/pages/landing.md`
**Reference:** `design-system/MASTER.md` (global rules always apply first)
**Inspired by:** Airbnb DESIGN.md — https://getdesign.md/airbnb/design-md
**Override rule:** If this file conflicts with MASTER.md, **this file wins** for landing page only.

---

## Context

KostFind landing page (`src/components/LandingPage.tsx`) adalah pintu masuk utama untuk pencari kost (mahasiswa Indonesia). Secara struktur sudah solid — hero search bar, budget estimator widget, trusted section, FAQ accordion. Dari Airbnb kita **adaptasi pola UX + soft aesthetics**, bukan warnanya.

**KostFind brand tetap berlaku:**
- Primary `#004ac6` (blue trust) → Airbnb's Rausch `#ff385c` role
- Secondary `#006c49` (green safe) → verified/trust indicators
- Font: Inter (Airbnb note: Inter is the closest open-source substitute for Airbnb Cereal VF)

---

## Colors (Token Remap dari Airbnb → KostFind)

Airbnb's white canvas + single accent philosophy → langsung applicable ke KostFind.

| Airbnb Token | Value | KostFind Remap | Value | Use |
|---|---|---|---|---|
| `canvas` | #ffffff | `canvas` | #ffffff | Page floor, card surface |
| `surface-soft` | #f7f7f7 | `surface-soft` | #f8fafc | Section band background |
| `hairline` | #dddddd | `hairline` | #e2e8f0 | Card borders, dividers |
| `ink` | #222222 | `ink` | #1e293b | Headlines, body text |
| `body` | #3f3f3f | `body` | #475569 | Running text |
| `muted` | #6a6a6a | `muted` | #64748b | Secondary labels |
| `primary` (Rausch) | #ff385c | **`primary`** | **`#004ac6`** | Search orb, CTA buttons, primary links |
| `primary-active` | #e00b41 | `primary-active` | `#003a9e` | Button press state |
| `primary-disabled` | #ffd1da | `primary-disabled` | `#dbeafe` | Disabled CTA fill |
| `secondary` | — | **`secondary`** | **`#006c49`** | Verified badge, trust indicators, "Terverifikasi" |
| `secondary-active` | — | `secondary-active` | `#005538` | Secondary hover |

> **Airbnb philosophy applied:** The single primary color carries every primary CTA and the search orb. KostFind maps this to blue `#004ac6`. Secondary green is reserved for trust signals only — verified badges, "Terverifikasi", success states.

---

## Typography

Airbnb: *Display weights stay modest (22-28px / 500-600) because photography carries visual hierarchy, not type.*

KostFind already uses Inter which is Airbnb's recommended open-source substitute for Cereal VF.

| Token | Size | Weight | Line Height | Airbnb Equivalent | Use |
|---|---|---|---|---|---|
| `display-xl` | 28px / 3.5xl | 700-800 | 1.12-1.2 | `{typography.display-xl}` | Hero h1 only |
| `display-lg` | 22px / 2xl | 600 | 1.2 | `{typography.display-lg}` | Section headlines |
| `title-md` | 16px | 600 | 1.25 | `{typography.title-md}` | Card titles, city names |
| `body-md` | 16px | 400 | 1.5 | `{typography.body-md}` | Running text |
| `body-sm` | 14px | 400 | 1.43 | `{typography.body-sm}` | Card meta, prices, captions |
| `caption` | 14px | 500 | 1.29 | `{typography.caption}` | Label text |
| `badge` | 11px | 600 | 1.18 | `{typography.badge}` | "Terverifikasi", "Baru" |
| `button-md` | 16px | 600 | 1.25 | `{typography.button-md}` | CTA labels |

### Typography Principles
- **Hero h1:** Airbnb-style "modest weight" — `text-3xl sm:text-4xl font-bold` (700) NOT extra-black. Max `font-black` (900) only for giant price displays.
- **No typographic muscle** — let photography and card density carry visual weight.
- **Body text minimum:** 14px (`text-sm`) — never go below for Bahasa Indonesia readability.

---

## Border Radius (Airbnb's Soft Shape Language)

Airbnb: *"There is essentially no hard corner anywhere except the body grid."*

| Token | Airbnb Value | Tailwind Class | Use |
|---|---|---|---|
| `rounded-xs` | 4px | `rounded-sm` | Subtle inner elements |
| `rounded-sm` | 8px | `rounded-sm` | Buttons, inputs, small cards |
| `rounded-md` | 14px | `rounded-lg` | **Property cards** (14px = Tailwind `rounded-lg`) |
| `rounded-lg` | 20px | `rounded-xl` | Hero cards, modal surfaces |
| `rounded-xl` | 32px | `rounded-2xl` | Hero device mockup frame |
| `rounded-full` | 9999px | `rounded-full` | **Search bar pill**, category pills, badge pills |

> **Critical:** Property cards use `rounded-lg` (14px), NOT `rounded-xl` (20px) — Airbnb's 14px is the signature soft card. Current KostFind uses `rounded-2xl` which is too round. Change property cards to `rounded-lg`.

---

## Spacing

Airbnb: *"64px section padding (marketplace density wants more cards per scroll)."*

| Token | Airbnb Value | Tailwind | Use |
|---|---|---|---|
| `spacing.section` | 64px | `py-16` (64px) | Major section vertical padding |
| `spacing.xl` | 32px | `gap-8` (32px) | Card grid gutters |
| `spacing.lg` | 24px | `gap-6` (24px) | Card internal padding |
| `spacing.base` | 16px | `gap-4` (16px) | Default gap |
| `spacing.sm` | 8px | `gap-2` (8px) | Dense elements |

**Current issue:** Landing page uses `py-24` (96px) section padding — too airy for a marketplace. Change to `py-16` (64px) to match Airbnb density.

---

## Elevation (Single Shadow Tier)

Airbnb: *"One shadow tier plus the flat baseline."*

```css
/* The single shadow definition in Airbnb — applied to: search bar, hover cards, dropdowns */
box-shadow:
  rgba(0, 0, 0, 0.02) 0 0 0 1px,
  rgba(0, 0, 0, 0.04) 0 2px 6px 0,
  rgba(0, 0, 0, 0.1) 0 4px 8px 0;
```

Tailwind equivalent: `shadow-sm` is close enough. Airbnb's shadow is slightly more sophisticated — use custom in `tailwind.config` if needed.

**Apply to:**
- Search bar at rest
- Property cards on hover (not flat — flat is body)
- Floating badges over photos

---

## Components (Airbnb Patterns → KostFind)

### 1. Search Bar (Airbnb Signature Pill)

Airbnb: white pill surface, fully rounded, hairline dividers, circular primary orb on right.

**KostFind adaptation** (`LandingPage.tsx` search form):
```tsx
// Airbnb pattern: full-rounded pill, hairline dividers, brand orb CTA
// Current (GOOD): bg-white rounded-2xl — change to rounded-full (pill)
// Current (GOOD): terminates in dark CTA — change CTA fill to bg-primary (#004ac6)
className={`
  bg-white
  rounded-full               // ← Airbnb pill (not rounded-2xl)
  border border-hairline     // ← 1px hairline border
  shadow-sm                  // ← single shadow tier
  px-2 py-2
  flex items-center gap-2
  max-w-2xl mx-auto
`}
```

**CTA orb** (Airbnb search orb):
```tsx
// Airbnb: circular primary orb terminating search bar
// KostFind: blue (#004ac6) circular button
<button className="
  bg-primary                 // ← #004ac6 (not dark/slate)
  hover:bg-primary-active    // ← #003a9e
  text-white
  rounded-full               // ← pill circle
  w-12 h-12                  // ← 48×48px (WCAG AAA touch target)
  flex items-center justify-center
  shrink-0
  shadow-sm
">
  <Search className="w-5 h-5" />
</button>
```

### 2. Property Card (Airbnb Photo-First Card)

Airbnb: 1:1 photo aspect, rounded-md (14px), "Guest favorite" floating badge top-left, heart top-right.

**KostFind adaptation** (for `featuredProperties` cards and search results):

```tsx
// Card shell
<div className="
  bg-white
  rounded-lg                  // ← rounded-md / 14px — Airbnb signature
  border border-hairline      // ← 1px hairline border
  overflow-hidden
  group
  transition-shadow duration-200
  hover:shadow-md             // ← single shadow tier on hover
">

  {/* Photo plate — Airbnb uses 1:1, KostFind uses 4:3 or 16:9. Either OK. */}
  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
    <img
      src={property.photos?.[0]}
      alt={property.name}
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    {/* Verified badge — Airbnb "Guest Favorite" pattern */}
    <div className="absolute top-3 left-3 z-10">
      <span className="
        bg-white/95
        backdrop-blur-sm         // ← Airbnb uses shadow here, backdrop-blur optional
        rounded-full            // ← pill shape
        px-2.5 py-1
        text-[11px] font-semibold
        text-secondary           // ← #006c49 KostFind green
        shadow-sm
        flex items-center gap-1
      ">
        <ShieldCheck className="w-3 h-3" />
        Terverifikasi
      </span>
    </div>

    {/* Save/Wishlist button — Airbnb heart top-right */}
    <button
      aria-label="Simpan ke watchlist"
      className="
        absolute top-3 right-3 z-10
        w-8 h-8 rounded-full
        bg-white/90 backdrop-blur-sm
        flex items-center justify-center
        hover:bg-primary hover:text-white
        transition-colors
        shadow-sm
        cursor-pointer
      "
    >
      <Heart className="w-4 h-4" />
    </button>
  </div>

  {/* Meta block — 4 lines of info like Airbnb */}
  <div className="p-4 space-y-1">
    <h3 className="text-sm font-semibold text-ink truncate">
      {property.name}
    </h3>
    <p className="text-xs text-muted truncate">
      {property.city}, {property.district}
    </p>
    <p className="text-xs text-muted">
      {property.distance}m dari {property.nearestUniversity}
    </p>
    <div className="pt-2 flex items-center justify-between">
      <span className="text-sm font-bold text-ink">
        Rp {formatCurrency(property.price)}<span className="text-xs font-normal text-muted">/bln</span>
      </span>
      {property.available_rooms > 0 && (
        <span className="text-[11px] font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
          {property.available_rooms} Kamar
        </span>
      )}
    </div>
  </div>
</div>
```

### 3. Category Pill Strip (Airbnb Category Nav)

Airbnb: horizontal scroll strip, 32px radius pills, icon + label.

**KostFind adaptation** (city selector chips):
```tsx
// Airbnb: full rounded pill strip with generous 32px radius
// KostFind: city/type filter chips
<div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
  {cities.map((city) => (
    <button
      key={city}
      onClick={() => handleQuickSearch(city)}
      className={`
        shrink-0
        flex items-center gap-2
        px-4 py-2
        rounded-full              // ← Airbnb pill
        border border-hairline
        text-sm font-medium
        whitespace-nowrap
        transition-all duration-200
        ${selectedCity === city
          ? 'bg-primary text-white border-primary'   // ← KostFind primary blue
          : 'bg-white text-body hover:border-primary hover:text-primary'
        }
      `}
    >
      <MapPin className="w-3.5 h-3.5" />
      {city}
    </button>
  ))}
</div>
```

### 4. Trust Section (Airbnb "Why Host" / Trust Bands)

Airbnb: editorial white-band sections with generous padding, icon + headline + body.

**KostFind adaptation** (Trust/Warranty section):
```tsx
// Airbnb: icon + headline + body in 3-column grid
// KostFind: 3 trust pillars with green secondary icon
<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-16 px-6">
  {/* Pillar */}
  <div className="flex flex-col items-center text-center gap-4">
    <div className="
      w-14 h-14 rounded-2xl           // ← rounded-lg (14px) per Airbnb
      bg-secondary/10                   // ← KostFind secondary green tint
      border border-secondary/20
      flex items-center justify-center
    ">
      <ShieldCheck className="w-7 h-7 text-secondary" />
    </div>
    <h3 className="text-lg font-semibold text-ink">Terverifikasi GPS</h3>
    <p className="text-sm text-body leading-relaxed">
      Setiap kost diverifikasi langsung oleh tim kami. Koordinat GPS akurat, tidak ada kost fiktif.
    </p>
  </div>
  {/* ... repeat for other pillars */}
</div>
```

### 5. Footer (Airbnb Clean Columns)

Airbnb: white surface matching page canvas, 3-column link list, muted text.

**KostFind current footer is already good.** Ensure:
- Background: `#ffffff` (canvas, not dark)
- Text: `text-muted` / `text-body`
- Border top: `border-t border-hairline`
- No gradient, no dark background

---

## Layout (Airbnb Grid Density)

| Element | Airbnb | KostFind |
|---|---|---|
| Max content width | ~1280px | `max-w-7xl mx-auto` ✅ already correct |
| Section padding | 64px vertical | Change `py-24` → `py-16` |
| Card grid desktop | 4-6 columns | `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` |
| Card grid tablet | 2-3 columns | `md:grid-cols-2` |
| Card gap | 16px | `gap-4` ✅ |
| Hero height | Photo + search bar visible above fold | Already correct |
| Footer columns | 3-column | `md:grid-cols-4` (4th = social) |

---

## Responsive Behavior

Mirrors Airbnb's collapsing strategy:

| Breakpoint | Behavior |
|---|---|
| Mobile (< 744px) | Search bar collapses to single pill + CTA orb; cards 1-up; city strip horizontal scroll |
| Tablet (744-1128px) | Search bar narrows but keeps 2 segments visible; cards 2-up |
| Desktop (1128px+) | Full pill search with all segments; cards 3-4-up |

---

## Anti-Patterns (From Airbnb That We Avoid)

❌ **Glassmorphism for cards** — Airbnb uses subtle backdrop-blur on floating elements only (badges, dropdowns). KostFind MASTER.md prohibits it on cards. Use `bg-white/90` or `bg-white` + `shadow-sm` instead.

❌ **Hard corners on cards** — Always `rounded-lg` minimum. No `rounded-none` on cards.

❌ **Over-elevation** — No multi-tier shadows. Airbnb has exactly one shadow tier. KostFind uses `shadow-sm` for resting state, `shadow-md` on hover only.

❌ **Dark footer** — Airbnb's white footer matches the canvas. KostFind: keep footer white.

❌ **Type as visual weight** — Airbnb trusts photography over typography. KostFind: keep headlines modest weight (700-800 max), don't over-bold.

---

## Priority Improvements (When Building/Redesigning)

1. **[HIGH] Change property cards** `rounded-2xl` → `rounded-lg` (Airbnb signature 14px)
2. **[HIGH] Change search bar** `rounded-2xl` → `rounded-full` (pill search bar)
3. **[HIGH] Change search CTA** dark fill → `bg-primary` (#004ac6) + orb shape
4. **[MEDIUM] Section padding** `py-24` → `py-16` (Airbnb density)
5. **[MEDIUM] Card hover shadow** add `hover:shadow-md`
6. **[LOW] Card photo hover** `group-hover:scale-105` (already good, confirm)
7. **[LOW] Category pills** add `rounded-full` class (pill shape)

---

## Existing Good Patterns (Don't Change)

- Hero layout with left text + right mockup device ✅
- Featured properties section structure ✅
- FAQ accordion ✅
- Footer column structure ✅
- Trust pillars layout ✅

These elements are architecturally sound — only cosmetic radius/elevation/color tweaks needed.
