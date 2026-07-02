# layout.md — Clay.com Design System

---

## 0. Quick Reference

**Stack:** Webflow-built marketing site · Token source: `extracted-css-vars` (707 CSS custom properties, high confidence) · Primary font: `Roobertvf` (body/headings) + `Canela Web` (secondary/display) · Styling via CSS custom properties, no Tailwind utility classes.

**How to apply:** Use as `var(--token-name)` in CSS, `style={{ prop: 'var(--token-name)' }}` in JSX, or `bg-[var(--token-name)]` in Tailwind.

```css
:root {
  /* Colours */
  --clay-bg-app:          var(--loam---web-library_swatches---neutrals--white); /* App background */
  --clay-border:          #302f2c;           /* Default border colour */
  --clay-accent:          #3859f9;           /* Primary accent (blueberry-400) */
  --clay-text-primary:    #000000;           /* Primary text */
  --clay-text-secondary:  #282c35;           /* Secondary text (grey-900) */
  --clay-accent-warm:     #fa6900;           /* Orange accent (tangarine-600) */
  --clay-accent-cool:     #0382f7;           /* Blue accent (blueberry-500) */

  /* Typography */
  --fonts--primary-font-family: Roobertvf, Arial, sans-serif; /* Body + headings */
  --fonts--secondary-font-family: "Canela Web", sans-serif;   /* Display / eyebrow */
  --clay-font-mono:       "Roobert mono", Arial, sans-serif;  /* Code / mono */

  /* Spacing */
  --clay-space-sm:        12px;
  --clay-space-md:        24px;
  --clay-space-lg:        20px;
  --clay-space-2xl:       32px;

  /* Radius */
  --clay-radius-full:     12px;  /* Primary button radius */
  --loam---web-library_border-radius---radius-sm: 0.75rem;
  --loam---web-library_border-radius---radius-md: 1rem;
  --loam---web-library_border-radius---radius-lg: 1.25rem;

  /* Motion */
  --clay-duration-fast:   0.25s;
  --clay-duration-base:   0.3s;
  --clay-ease-default:    ease;
}
```

```tsx
// Primary button — correct token usage
<button
  style={{
    fontFamily: 'var(--fonts--primary-font-family)',
    fontSize: '13.92px',
    fontWeight: 500,
    borderRadius: 'var(--clay-radius-full)', // 12px
    padding: '8px 16px',
    backgroundColor: 'rgb(243, 242, 237)',   // oat-100 surface
    color: 'var(--clay-text-primary)',
    border: '1px solid transparent',
    transition: 'background-color var(--clay-duration-base) cubic-bezier(0.075, 0.82, 0.165, 1)',
  }}
>
  Get a demo
</button>
```

**NEVER rules:**
- NEVER use `Inter`, `Roboto`, or `Arial` as the primary font — use `Roobertvf, Arial, sans-serif`
- NEVER use hardcoded hex colours — always reference a `--clay-*` or `--_swatches---color--*` token
- NEVER use border-radius > 12px on primary buttons — the brand radius is `12px` (`--clay-radius-full`)
- NEVER construct spacing values outside the defined scale — no arbitrary `px` values
- NEVER omit hover, focus-visible, and active states on interactive elements
- NEVER use `!important` to override token values

> Full design system → see **layout.md**

---

## 1. Design Direction & Philosophy

### Character & Mood
Clay.com presents as a **precision B2B SaaS product with editorial warmth**. The aesthetic combines a serious, data-dense product interface with expressive brand moments — saturated colour tiles, serif display type (Canela), and generous whitespace. The tone is confident without being cold.

### What this design IS:
- **Typographically tight:** H1 line-height of `1` (80px/80px), negative letter-spacing (`-3.2px` on H1, `-1.32px` on H2). Text is dense and intentional.
- **Colour-expressive at scale:** A rich swatch palette (blueberry, tangarine, dragonfruit, matcha, ube, slushie, lemon, oat, pomegranate) is used for decorative card backgrounds and illustration accents — not for functional UI.
- **Surface-minimal:** Page backgrounds are near-white oat tones. Cards may use transparent or subtly coloured backgrounds. Dark surfaces appear in specific feature sections.
- **Motion-subtle:** Transitions at `0.3s ease`. Marquee animations for logo strips. No gratuitous animation.
- **Font-dual:** `Roobertvf` (a geometric sans) handles all body and heading work. `Canela Web` (a serif display) appears on eyebrows and secondary display moments.

### What this design REJECTS:
- NEVER use warm rounded corners > 12px on buttons (the design uses a flat `12px` pill, not a soft blob)
- NEVER use warm, high-saturation colours for functional UI states — those colours are decorative
- NEVER use generic card shadows as the primary depth mechanism — borders and background shifts are preferred
- NEVER use Inter, Roboto, or system-ui as the primary font — `Roobertvf` is mandatory
- NEVER apply `text-transform: uppercase` to headings — the design relies on weight and size alone

---

## 2. Colour System

### Tier 1 — Primitive Swatches (extracted CSS vars, preserved names)

```css
/* Neutrals */
--_swatches---color--black:     #000000;
--_swatches---color--white:     #ffffff;
--_swatches---color--oat-50:    #fffcfa;
--_swatches---color--oat-100:   #f9f8f6;
--_swatches---color--oat-200:   #f3f2ed;
--_swatches---color--oat-300:   #eee9df;
--_swatches---color--oat-400:   #dad4c8;
--_swatches---color--oat-500:   #c0bbaf;
--_swatches---color--oat-600:   #9f9b93;
--_swatches---color--oat-700:   #85817a;
--_swatches---color--oat-800:   #55534e;
--_swatches---color--oat-900:   #363430;
--_swatches---color--oat-950:   #1b1a18;

/* Grey scale */
--_swatches---color--grey-50:   #f7f8f9;
--_swatches---color--grey-100:  #eff1f3;
--_swatches---color--grey-200:  #e6e8ec;
--_swatches---color--grey-300:  #d6d9df;
--_swatches---color--grey-400:  #bfc4cd;
--_swatches---color--grey-500:  #979da9;
--_swatches---color--grey-600:  #717989;
--_swatches---color--grey-700:  #525a69;
--_swatches---color--grey-800:  #3c414d;
--_swatches---color--grey-900:  #282c35;
--_swatches---color--grey-950:  #16181f;

/* Blueberry */
--_swatches---color--blueberry-50:  #ecf6ff;
--_swatches---color--blueberry-100: #d7ebfe;
--_swatches---color--blueberry-200: #bee0ff;
--_swatches---color--blueberry-300: #83c4ff;
--_swatches---color--blueberry-400: #4ca8fd;
--_swatches---color--blueberry-500: #0382f7;
--_swatches---color--blueberry-600: #0667d9;
--_swatches---color--blueberry-700: #0053b5;
--_swatches---color--blueberry-800: #01418d;
--_swatches---color--blueberry-900: #002f67;
--_swatches---color--blueberry-950: #001e4b;
--loam---web-library_swatches---blueberry--400: #3859f9; /* Accent blueberry (design-system canonical) */

/* Tangarine (orange) */
--_swatches---color--tangarine-50:  #fff3ed;
--_swatches---color--tangarine-100: #ffe9d5;
--_swatches---color--tangarine-200: #fdd4b7;
--_swatches---color--tangarine-300: #ffbe90;
--_swatches---color--tangarine-400: #ffa775;
--_swatches---color--tangarine-500: #fc8936;
--_swatches---color--tangarine-600: #fa6900;  /* Primary warm accent */
--_swatches---color--tangarine-700: #c34e1b;
--_swatches---color--tangarine-800: #9f3e15;
--_swatches---color--tangarine-900: #752b12;
--_swatches---color--tangrine-950:  #431407;

/* Lemon (yellow) */
--_swatches---color--lemon-100:  #fff8d2;
--_swatches---color--lemon-200:  #fef0a4;
--_swatches---color--lemon-300:  #fadf7c;
--_swatches---color--lemon-400:  #f8cc65;
--_swatches---color--lemon-500:  #fbbd41;
--_swatches---color--lemon-600:  #fdad15;
--_swatches---color--lemon-700:  #d08a11;
--_swatches---color--lemon-800:  #9d6a09;
--_swatches---color--lemon-900:  #7f500a;
--_swatches---color--lemon-950:  #623c02;

/* Ube (purple) */
--_swatches---color--ube-50:   #f5f3ff;
--_swatches---color--ube-100:  #e9e4ff;
--_swatches---color--ube-200:  #d8d0ff;
--_swatches---color--ube-300:  #c1b0ff;
--_swatches---color--ube-400:  #a789fe;
--_swatches---color--ube-500:  #8b5cf6;
--_swatches---color--ube-600:  #7934f0;
--_swatches---color--ube-700:  #5c15cc;
--_swatches---color--ube-800:  #43089f;
--_swatches---color--ube-900:  #32037d;

/* Matcha (green) */
--_swatches---color--matcha-100: #dbffe0;
--_swatches---color--matcha-200: #bcf4ca;
--_swatches---color--matcha-300: #84e7a5;
--_swatches---color--matcha-400: #3ece82;
--_swatches---color--matcha-500: #0dac65;
--_swatches---color--matcha-600: #078a52;
--_swatches---color--matcha-700: #02693e;
--_swatches---color--matcha-800: #02492a;
--_swatches---color--matcha-900: #03331d;

/* Pomegranate (red) */
--_swatches---color--pomegranate-100: #ffebec;
--_swatches---color--pomegranate-200: #fecdd3;
--_swatches---color--pomegranate-400: #fc7981;
--_swatches---color--pomegranate-500: #e94d68;
--_swatches---color--pomegranate-600: #dd2c53;
--_swatches---color--pomegranate-700: #b21a3f;

/* Dragonfruit (hot pink) */
--_swatches---color--dragonfruit-50:  #fff5fc;
--_swatches---color--dragonfruit-100: #ffe5f7;
--_swatches---color--dragonfruit-200: #ffd1f1;
--_swatches---color--dragonfruit-300: #ffb8e8;
--_swatches---color--dragonfruit-400: #ff99df;
--_swatches---color--dragonfruit-500: #ff7ad5;
--_swatches---color--dragonfruit-600: #ff52c2;
--_swatches---color--dragonfruit-700: #f90ba6;  /* Decorative brand accent */
--_swatches---color--dragonfruit-800: #cc0687;
--_swatches---color--dragonfruit-900: #8b045c;

/* Slushie (cyan/teal) */
--_swatches---color--slushie-50:  #f5fdff;
--_swatches---color--slushie-100: #e0f8ff;
--_swatches---color--slushie-200: #c7f3ff;
--_swatches---color--slushie-300: #a3ebff;
--_swatches---color--slushie-400: #7ae3ff;
--_swatches---color--slushie-500: #3bd3fd;
--_swatches---color--slushie-600: #2abeea;
--_swatches---color--slushie-700: #02a8d4;
--_swatches---color--slushie-800: #0089ad;
--_swatches---color--slushie-900: #005870;
--_swatches---color--slushie-950: #00303d;
```

### Tier 2 — Semantic Aliases

```css
/* Application background */
--loam---web-library---colors--background: var(--loam---web-library_swatches---neutrals--white); /* Page/app bg */
--clay-bg-app:     var(--loam---web-library---colors--background); /* alias */

/* Brand surface (decorative tile backgrounds — NOT for functional UI) */
--brand-surface-1: rgb(203, 216, 16);   /* Lime-ish yellow tile bg */
--brand-surface-2: rgb(255, 118, 20);   /* Warm orange tile bg */
--brand-surface-3: rgb(66, 157, 255);   /* Sky blue tile bg */
--brand-surface-4: rgb(139, 4, 92);     /* Dragonfruit tile bg */
--brand-surface-5: rgb(2, 105, 62);     /* Matcha tile bg */
--brand-surface-6: rgb(221, 44, 83);    /* Pomegranate tile bg */

/* Text */
--loam---web-library---colors--text: var(--loam---web-library_swatches---neutrals--black); /* All body text */
--clay-text-primary:   #000000;  /* alias for computed body text */
--clay-text-secondary: #282c35;  /* alias: --_swatches---color--grey-900 */

/* Primary action */
--loam---web-library---colors--primary-action: var(--loam---web-library_swatches---neutrals--black); /* Button/action default */

/* Accent */
--loam---web-library---colors--primary-accent: var(--loam---web-library_swatches---blueberry--400); /* #3859f9 */
--clay-accent:      #3859f9;  /* alias */
--clay-accent-warm: #fa6900;  /* tangarine-600 */
--clay-accent-cool: #0382f7;  /* blueberry-500 */

/* Border */
--loam---web-library---colors--border: #302f2c; /* Default border */
--clay-border: #302f2c; /* alias */
--border: 1px solid rgba(231, 231, 231, 0.25); /* Subtle divider */
--dashed-border: 1px dashed #e7e7e7;            /* Dashed divider */

/* Status */
--clay-success: #047e4a; /* green-600 */
--clay-info:    #038ff7; /* blue-500  */
--clay-warning: #fcbe11; /* lemon-300 */
--clay-error:   #b21a3f; /* pomegranate-700 */
```

### Tier 3 — Component Tokens

```css
/* Chips */
--_theme--chips---background: var(--_swatches---color--blueberry-900); /* #002f67 */
--_theme--chips---text:       var(--_swatches---color--white);          /* #ffffff */

/* Cards (dark variant) */
--_theme--cards---border:     #ffffff1a; /* 10% white border on dark cards */

/* Terra cards (light, editorial) */
--_theme--terra-card---background-one: var(--loam---web-library_terra-swatches---oat--oat-200);
--_theme--terra-card---background-two: var(--loam---web-library_terra-swatches---oat--oat-300);
--_theme--terra-card---background-three: #ffffff;
--_theme--terra-card---text-primary:   var(--loam---web-library_terra-swatches---oat--oat-500);
--_theme--terra-card---text-secondary: var(--loam---web-library_terra-swatches---oat--oat-200);
--_theme--terra-card---border:         var(--loam---web-library_terra-swatches---oat--oat-200);

/* Pricing cards */
--_theme--pricing-cards---background: #fff0;  /* transparent */
--_theme--pricing-cards---text:       var(--_swatches---color--black);
```

### Additional Brand Accent Colours (Decorative Only)

| Token | Value | Use |
|---|---|---|
| `--_swatches---color--dragonfruit-700` | `#f90ba6` | Hot pink decorative tile |
| `--loam---web-library_terra-swatches---lemon--lemon-300` | `#fdbe11` | Lemon yellow accent |
| `--loam---web-library_color---secondary--blue` | `#0073e6` | Secondary blue |
| `--_swatches---color--ube-600` | `#7934f0` | Purple decorative accent |
| `--loam---web-library_swatches---pomegranate--300` | `#fb4450` | Pomegranate accent |
| `--_swatches---color--matcha-500` | `#0dac65` | Matcha green accent |
| `--loam---web-library_swatches---lime--300` | `#cbd810` | Lime green accent |

> **These colours are for decorative tile backgrounds and illustration only. NEVER use them as button backgrounds, text colours, or semantic status colours.**

---

## 3. Typography System

Clay uses **two typefaces** with strict role separation:
- **`Roobertvf`** (variable font, weights 300–900) — all headings and body copy
- **`Canela Web`** — secondary display/editorial moments (light 300, regular 400, italic 400)
- **`Roobert mono`** — monospaced data/code contexts

All headings use **negative letter-spacing**. H1/H2/H3 are fluid (`clamp()`-based). Letter spacing on H1–H3 is `-.04em`.

```css
/* ── Font stacks ── */
--fonts--primary-font-family:   Roobertvf, Arial, sans-serif;        /* Body + headings */
--fonts--secondary-font-family: "Canela Web", sans-serif;             /* Display / serif accent */
--_typography---fonts--secondary-font: "Roobert mono", Arial, sans-serif; /* Mono */
--loam---web-library_typography---fonts--primary-font: Roobert, Arial, sans-serif; /* Fallback */
```

### Composite Typography Groups

| Role | font-family | font-size (fluid) | font-weight | line-height | letter-spacing |
|---|---|---|---|---|---|
| **H1** | Roobertvf, Arial | `clamp(2.8rem, …, 5.5rem)` / computed 80px | 600 | 1 (80px/80px) | -0.04em (-3.2px) |
| **H2** | Roobertvf, Arial | `clamp(2rem, …, 3.8rem)` / computed 44px | 500 | 1.1 (48.4px) | -0.04em (-1.32px) |
| **H3** | Roobertvf, Arial | `clamp(1.5rem, …, 2.3rem)` / computed 32px | 600 | 1.2 (35.2px) | -0.04em (-0.64px) |
| **H4** | Roobertvf, Arial | `clamp(1.3rem, …, 1.5rem)` | 500 | 1.4 | 0em |
| **H5** | Roobertvf, Arial | `clamp(1.1rem, …, 1.2rem)` | 500 | 1.4 | 0em |
| **H6** | Roobertvf, Arial | `clamp(0.9rem, …, 1rem)` | 500 | 1.4 | 0em |
| **Body** | Roobertvf, Arial | 14px (computed) | 500 | 21px (1.5) | normal |
| **Paragraph XL** | Roobertvf, Arial | `clamp(1.2rem, …, 1.5rem)` | 400 | 1.4 | 0em |
| **Paragraph LG** | Roobertvf, Arial | `clamp(1rem, …, 1.25rem)` | 400 | 1.5 | 0em |
| **Paragraph Body** | Roobertvf, Arial | `clamp(0.9rem, …, 1rem)` | 400 | 1.6 | 0em |
| **Paragraph SM** | Roobertvf, Arial | 0.75rem (fixed) | 400 | 1.5 | 0em |
| **Eyebrow** | Canela Web | `clamp(0.7rem, …, 0.8rem)` | 500 | 1.2 | 0.1em |
| **Button** | Roobertvf, Arial | 1rem / computed 13.92px | 500 | 1.3em | 0em |
| **Input** | Roobertvf, Arial | 1rem | 400 | 1.5em | 0em |
| **Input Label** | Roobertvf, Arial | 0.9rem | 400 | 1em | 0em |

```css
/* Token reference — fluid heading sizes */
--loam---web-library_typography---h1--font-size-min-rem: 2.8;
--loam---web-library_typography---h1--font-size-max-rem: 5.5;
--loam---web-library_typography---h1--line-height: 1;
--loam---web-library_typography---h1--letter-spacing: -.04em;
--loam---web-library_typography---h1--font-weight: 600;
--loam---web-library_typography---h1--bottom-margin: .3em;

--loam---web-library_typography---h2--font-size-min-rem: 2;
--loam---web-library_typography---h2--font-size-max-rem: 3.8;
--loam---web-library_typography---h2--line-height: 1.1;
--loam---web-library_typography---h2--letter-spacing: -.04em;
--loam---web-library_typography---h2--bottom-margin: .2em;

--loam---web-library_typography---h3--font-size-min-rem: 1.5;
--loam---web-library_typography---h3--font-size-max-rem: 2.3;
--loam---web-library_typography---h3--line-height: 1.2;
--loam---web-library_typography---h3--letter-spacing: -.04em;
--loam---web-library_typography---h3--bottom-margin: .3em;

/* Eyebrow (secondary font) */
--loam---web-library_typography---eyebrow--font-size-min-rem: .7;
--loam---web-library_typography---eyebrow--font-size-max-rem: .8;
--loam---web-library_typography---eyebrow--line-height: 1.2;
--loam---web-library_typography---eyebrow--letter-spacing: .1em; /* tracked out */
--loam---web-library_typography---eyebrow--font-weight: 500;
--loam---web-library_typography---eyebrow--bottom-margin: 1.5em;

/* Font weight scale */
--clay-font-weight-semibold: 550; /* extracted: high confidence */
/* Roobertvf variable font axis: 300–900 */
/* Used: 400 (regular), 500 (medium/body), 550 (semibold), 600 (bold headings) */
```

### Font Pairing Rules
- H1–H3: always `Roobertvf` with negative letter-spacing
- Eyebrow labels above section headings: `Canela Web` at 0.7–0.8rem, tracked +0.1em
- Body copy: `Roobertvf` 14px / weight 500 — NOT weight 400
- Mono data/code: `Roobert mono` exclusively
- NEVER use Canela Web for body copy or buttons

---

## 4. Spacing & Layout

**Base unit:** 4px grid implied. Primary scale mixes `rem` (relative) and `px` (fixed). The gap system uses a distinct set of named tokens.

```css
/* ── Fixed spacing tokens ── */
--clay-space-sm:   12px;   /* Small gaps, icon padding */
--clay-space-md:   24px;   /* Grid gap (--loam---web-library_layout---grid--gap-md) */
--clay-space-lg:   20px;   /* Standard lg spacing */
--clay-space-2xl:  32px;   /* Section sub-spacing */
--clay-space-3xl:  130.27px; /* ⚠ off-grid — use 128px (32×4) in new components */
--clay-space-xs:   0.2em;  /* H2 bottom margin */
--clay-space-xl:   1.75rem;

/* ── Rem spacing scale ── */
--spacing--0-25rem:  .25rem;
--spacing--0-5rem:   .5rem;
--spacing--0-75rem:  .75rem;
--spacing--0-875rem: .875rem;
--spacing--1rem:     1rem;
--spacing--1-25rem:  1.25rem;
--spacing--1-5rem:   1.5rem;
--spacing--1-75rem:  1.75rem;
--spacing--2rem:     2rem;
--spacing--2-5rem:   2.5rem;
--spacing--3rem:     3rem;
--spacing--4rem:     4rem;
--spacing--4-5rem:   4.5rem;
--spacing--5rem:     5rem;
--spacing--6rem:     6rem;
--spacing--7rem:     7rem;
--spacing--8rem:     8rem;
--spacing--11rem:    11rem;

/* ── Section padding (fluid, responsive) ── */
--layout--section-padding-xs: var(--spacing--3rem);   /* 48px */
--layout--section-padding-sm: var(--spacing--3rem);   /* 48px */
--layout--section-padding-md: var(--spacing--4rem);   /* 64px */
--layout--section-padding-lg: var(--spacing--6rem);   /* 96px */
--layout--section-padding-xl: var(--spacing--8rem);   /* 128px */

/* Component section padding (clamp — 3rem min, 6rem max) */
--loam---web-library_components---section--padding-min-rem: 3;
--loam---web-library_components---section--padding-max-rem: 6;

/* ── Grid gaps ── */
--loam---web-library_layout---grid--gap-sm:     8px;
--loam---web-library_layout---grid--gap-md:     24px;  /* Default column gap */
--loam---web-library_layout---grid--gap-main:   40px;  /* Main layout gap */
--loam---web-library_layout---grid--gap-button: 16px;  /* Button group gap */
--layout--row-col-gap:                          1rem;

/* ── Restart gap system ── */
--loam---web-library_layout--restart---gap--small:   1rem;
--loam---web-library_layout--restart---gap--regular: 1.25rem;
--loam---web-library_layout--restart---gap--medium:  1.5rem;
--loam---web-library_layout--restart---gap--large:   1.5rem;

/* ── Margin scale ── */
--loam---web-library_layout---spacing--margin-xs: .5em;
--loam---web-library_layout---spacing--margin-sm: 1em;
--loam---web-library_layout---spacing--margin-md: 2em;
--loam---web-library_layout---spacing--margin-lg: 3em;

/* ── Card padding (fluid: 1rem min, 1.5rem max) ── */
--loam---web-library_components---card--padding-min-rem: 1;
--loam---web-library_components---card--padding-max-rem: 1.5;

/* ── Container ── */
--loam---web-library_components---container--max-width: calc(var(--loam---web-library_layout---fluid--max) * 1rem);
/* fluid--max resolves to the site's max viewport rem — ~80rem / 1280px */
```

### Grid & Breakpoints

| Breakpoint | Width | Usage |
|---|---|---|
| xs | ≤ 479px | Mobile portrait |
| sm | ≤ 767px | Mobile landscape |
| sm+ | 768px | Tablet start |
| md | 990–991px | Tablet landscape |
| lg | 992px | Small desktop |
| xl | 1150px | Full desktop |

**Layout rules:**
- Use `display: flex; flex-direction: row` for button groups and nav items
- Use CSS Grid for multi-column feature sections
- Default column gap: `--loam---web-library_layout---grid--gap-md` (24px)
- Main layout gap: `--loam---web-library_layout---grid--gap-main` (40px)
- Cards use `display: block` (not flex) by default

---

## 5. Page Structure & Layout Patterns

> **Note:** No page screenshots provided. All section order and layout details are derived from the LAYOUT DIGEST (component inventory, computed styles, and structural signals). Rows marked **(inferred)** are not visually confirmed.

### 5.1 Section Map

| # | Section | Layout type | Approx. height | Key elements |
|---|---|---|---|---|
| 1 | **Navigation / Header** | `display:block` full-width | 60–80px | Logo, nav links (`display:flex, row`), CTA button (`radius: 12px`, bg `rgb(243,242,237)`) |
| 2 | **Hero** (inferred) | Centered column, full-width bg | 500–700px | H1 (80px, weight 600, centered), subhead paragraph, 1–2 CTA buttons, badge |
| 3 | **Feature / Card Grid** | CSS Grid, 3–4 col | 400–600px | 57 card instances; cards at `border-radius: 16px`; gap `24px` |
| 4 | **Social Proof / Logo Strip** (inferred) | Flex row, marquee animation | 80–120px | Logo images, marquee keyframe, `overflow: hidden` |
| 5 | **Feature Detail Sections** (inferred) | 2-col flex or grid (60/40 ratio) | 400–500px ea. | H2 + body, screenshot/UI image, secondary CTA |
| 6 | **Testimonials / Quotes** (inferred) | Flex row or 2-col grid | 300–400px | Quote tiles with coloured `brand-surface-*` backgrounds |
| 7 | **Pricing** (inferred) | 3-col grid | 500–600px | Pricing cards (`--_theme--pricing-cards---background: transparent`), feature list |
| 8 | **CTA Banner** (inferred) | Full-width, centred | 200–300px | Large H2, primary + secondary button |
| 9 | **Footer** | Multi-col flex | 200–300px | Nav links, social icons, legal text |

### 5.2 Layout Patterns

**Navigation:**
```
display: block (role_navigation)
→ Inner wrapper: flex row, justify-content: space-between, align-items: center
→ CTA button: padding 8px 16px, border-radius 12px, bg rgb(243,242,237)
```

**Hero (inferred from H1 computed styles):**
```
text-align: center
H1: font-size 80px, font-weight 600, letter-spacing -3.2px, margin-bottom 24px
Subhead: paragraph-xl fluid (1.2–1.5rem), line-height 1.4
Button group: flex row, gap 16px (--loam---web-library_layout---grid--gap-button), justify-center
```

**Card Grid (from 57 card instances):**
```
display: block (card)
border-radius: 16px
padding: clamp(1rem, …, 1.5rem) fluid
gap: 24px (--loam---web-library_layout---grid--gap-md)
Grid: auto-fit columns, min ~280px
Coloured tile cards use brand-surface-* backgrounds (decorative)
```

**Feature 2-col sections (inferred):**
```
Grid: 2 columns, ~60/40 or 50/50 ratio
Gap: 40px (--loam---web-library_layout---grid--gap-main)
Responsive: stacks to 1-col at ≤ 767px
```

### 5.3 Visual Hierarchy

- **Most prominent:** H1 at 80px / weight 600 / letter-spacing -3.2px — dominates hero
- **Section headings:** H2 at 44px / weight 500 — leads each content section
- **CTAs:** Primary button `rgb(243, 242, 237)` (oat-100 surface) + black text; hover shifts to `--_swatches---color--grey-900` (#282c35)
- **Coloured tiles:** `brand-surface-*` backgrounds on testimonial/quote cards create visual punctuation between otherwise neutral sections
- **Whitespace rhythm:** Section padding `3–6rem` fluid; card padding `1–1.5rem` fluid; consistent 24px column gaps

### 5.4 Content Patterns

**Card content pattern (repeating):**
```
[Eyebrow label — Canela Web, tracked]
[H3 or H4 heading — Roobertvf, tight]
[Body paragraph — Roobertvf 14px/21px]
[Optional: inline CTA link or button]
```

**Testimonial tile pattern (inferred from brand-surface colours):**
```
[Coloured background tile (brand-surface-1 through -6)]
[Quote text in paragraph-lg]
[Avatar + name + title in paragraph-sm]
```

**Badge + heading pattern:**
```
[Badge: 9.6px / weight 600 / border-radius 11px / bg rgb(240,248,255) / color rgb(56,89,249)]
[H2 or H3 below]
```

---

## 6. Component Patterns

### 6.1 Primary Button

**Anatomy:** `[optional icon] [label text]`
- Container: `display:flex, flex-direction:row, justify-content:center, align-items:center, gap:6.96px`
- Padding: `8px 16px`
- Border-radius: **12px** (`--clay-radius-full`)
- Font: `Roobertvf 13.92px / weight 500 / line-height 20.88px / letter-spacing -0.1392px`

**State table:**

| State | Background | Text | Border | Other |
|---|---|---|---|---|
| Default | `rgb(243, 242, 237)` | `#000000` | `1px solid transparent` | — |
| Hover | `var(--_swatches---color--grey-900)` (#282c35) | `#000000` | transparent | transition `0.3s cubic-bezier(0.075,0.82,0.165,1)` |
| Focus-visible | `rgb(243, 242, 237)` | `#000000` | — | `outline: 2px dashed #000; outline-offset: 2px` |
| Active | (darker shift) | `#000000` | — | opacity: 0.9 |
| Disabled | `rgb(243, 242, 237)` | `#000000` at 40% opacity | transparent | `cursor: not-allowed; pointer-events: none` |

**Secondary button (`.btn.cc-secondary`):**
- Default bg: transparent
- Hover: `var(--_swatches---color--oat-100)` `#f9f8f6`

**Oat button (`.btn.cc-oat`):**
- Hover: `var(--_swatches---color--oat-400)` `#dad4c8`

```tsx
// Production-ready primary button — all states
interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'oat';
}

const Button: React.FC<ButtonProps> = ({
  children, disabled, loading, onClick, variant = 'primary'
}) => {
  const bgMap = {
    primary:   'rgb(243, 242, 237)',
    secondary: 'transparent',
    oat:       'var(--_swatches---color--oat-200)',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      style={{
        fontFamily:     'var(--fonts--primary-font-family)',
        fontSize:       '13.92px',
        fontWeight:     500,
        lineHeight:     '20.88px',
        letterSpacing:  '-0.1392px',
        color:          disabled ? 'rgba(0,0,0,0.4)' : 'var(--clay-text-primary)',
        backgroundColor: disabled ? 'rgba(243, 242, 237, 0.5)' : bgMap[variant],
        border:         '1px solid transparent',
        borderRadius:   'var(--clay-radius-full)', /* 12px */
        padding:        '8px 16px',
        display:        'flex',
        flexDirection:  'row',
        justifyContent: 'center',
        alignItems:     'center',
        gap:            '6.96px',
        cursor:         disabled ? 'not-allowed' : 'pointer',
        transition:     `background-color var(--clay-duration-base) cubic-bezier(0.075, 0.82, 0.165, 1)`,
        outline:        'none',
        pointerEvents:  disabled ? 'none' : 'auto',
      }}
      onMouseEnter={e => {
        if (!disabled && !loading) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            variant === 'primary' ? 'var(--_swatches---color--grey-900)' :
            variant === 'oat'     ? 'var(--_swatches---color--oat-400)' :
            'var(--_swatches---color--oat-100)';
        }
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor = bgMap[variant];
      }}
      onFocus={e => {
        (e.currentTarget as HTMLButtonElement).style.outline =
          '2px dashed var(--clay-text-primary)';
        (e.currentTarget as HTMLButtonElement).style.outlineOffset = '2px';
      }}
      onBlur={e => {
        (e.currentTarget as HTMLButtonElement).style.outline = 'none';
      }}
    >
      {loading ? <span aria-hidden="true">…</span> : children}
    </button>
  );
};
```

---

### 6.2 Card

**Anatomy:** `[header area] [body content] [optional footer/CTA]`
- `display: block`
- `border-radius: 16px` (extracted from computed styles)
- `padding: clamp(1rem, …, 1.5rem)` (fluid)
- Default bg: transparent or oat surface; dark variant: black bg

**State table:**

| State | Background | Border | Other |
|---|---|---|---|
| Default | transparent / `--_theme--terra-card---background-one` | `--_theme--cards---border` (`#ffffff1a`) | — |
| Hover (dark variant) | `var(--loam---web-library---colors--border)` (#302f2c) | — | transition: all |
| Focus | — | — | follow child link/button focus |

```tsx
const Card: React.FC<{ children: React.ReactNode; variant?: 'light' | 'dark' | 'terra' }> = ({
  children, variant = 'light'
}) => {
  const bgMap = {
    light: 'var(--_swatches---color--oat-100)',
    dark:  'transparent',
    terra: 'var(--_theme--terra-card---background-one)',
  };
  const borderMap = {
    light: '1px solid rgba(209, 205, 199, 0.5)',
    dark:  '1px solid var(--_theme--cards---border)',
    terra: '1px solid var(--_theme--terra-card---border)',
  };

  return (
    <div
      style={{
        fontFamily:      'var(--fonts--primary-font-family)',
        fontSize:        '16px',
        fontWeight:      400,
        lineHeight:      '24px',
        color:           variant === 'dark' ? '#ffffff' : 'var(--clay-text-primary)',
        backgroundColor: bgMap[variant],
        border:          borderMap[variant],
        borderRadius:    '16px',
        padding:         'clamp(1rem, 2vw, 1.5rem)',
        display:         'block',
        transition:      `all var(--clay-duration-base) var(--clay-ease-default)`,
      }}
    >
      {children}
    </div>
  );
};
```

---

### 6.3 Badge

**Anatomy:** `[label text]`
- `display: block`
- `border-radius: 11px`
- `padding: 2px 4px`
- `font-size: 9.6px / weight 600 / line-height 14.4px / letter-spacing -0.1px`
- Default: bg `rgb(240, 248, 255)`, text `rgb(56, 89, 249)`

**State table:**

| State | Background | Text | Notes |
|---|---|---|---|
| Default | `rgb(240, 248, 255)` | `rgb(56, 89, 249)` | Blue pill |
| Chip variant | `var(--_swatches---color--blueberry-900)` | `#ffffff` | Dark chip |
| Hover | (unchanged — badges are display only) | — | — |

```tsx
const Badge: React.FC<{ label: string; variant?: 'default' | 'chip' }> = ({
  label, variant = 'default'
}) => (
  <span
    style={{
      fontFamily:    'var(--fonts--primary-font-family)',
      fontSize:      '9.6px',
      fontWeight:    600,
      lineHeight:    '14.4px',
      letterSpacing: '-0.1px',
      color:          variant === 'chip' ? '#ffffff' : 'rgb(56, 89, 249)',
      backgroundColor: variant === 'chip'
        ? 'var(--_swatches---color--blueberry-900)'
        : 'rgb(240, 248, 255)',
      borderRadius:  '11px',
      padding:       '2px 4px',
      display:       'inline-block',
    }}
  >
    {label}
  </span>
);
```

---

### 6.4 Navigation Item

**Anatomy:** `[label] [optional dropdown indicator]`
- `display: flex, flex-direction: row, align-items: center`
- `font-size: 16px / weight 400 / line-height 24px`
- Default: transparent bg, `color: #000`
- `.w--current` (active): underline
- CTA nav item: `bg: #1d1c1a` (near-black), text: white

**State table:**

| State | Style |
|---|---|
| Default | no decoration |
| Hover | `text-decoration: underline` |
| Active / current | `text-decoration: underline` |
| Focus-visible | `outline: none` (Webflow default — **add** `outline: 2px dashed #000` for accessibility) |
| CTA hover | `background-color: rgb(48, 47, 44)` |

---

### 6.5 Input / Form Field

**Anatomy:** `[label] [input element] [error message (optional)]`

| State | Border | Notes |
|---|---|---|
| Default | `var(--loam---web-library---colors--border)` | 1px solid |
| Focus | `rgb(56, 152, 236)` — all four sides | `.w-input:focus` rule |
| Active | color: `var(--loam---web-library_swatches---neutrals--black)` | `.input:active` rule |
| Error | `var(--clay-error)` `#b21a3f` | apply `border-color` |

```css
.input {
  font-family: var(--fonts--primary-font-family);
  font-size: var(--loam---web-library_components---input--font-size); /* 1rem */
  line-height: var(--loam---web-library_components---input--line-height); /* 1.5em */
  letter-spacing: var(--loam---web-library_components---input--letter-spacing); /* 0em */
  border-radius: var(--loam---web-library_components---input--border-radius); /* .5rem */
  border: 1px solid var(--clay-border);
  margin-bottom: var(--loam---web-library_components---input--bottom-margin); /* 1rem */
  color: var(--loam---web-library---colors--text);
}
.input:focus {
  border-color: rgb(56, 152, 236);
  outline: none;
}
.input:active {
  color: var(--loam---web-library_swatches---neutrals--black);
}
```

---

### 6.6 Dropdown

**Anatomy:** `[toggle button] [dropdown panel]`
- Panel: `border-radius: 0px 0px 24px 24px` (rounded only at bottom)
- Border: `1px solid rgba(209, 205, 199, 0.5)`
- Background: `#ffffff`
- Toggle focus: `outline: none` (Webflow override — restore for accessibility)

---

### 6.7 Avatar

**Anatomy:** `[image circle]`
- `border-radius: 24px`
- `display: block`
- Background: uses `background-image` (avatar photo)

---

## 7. Elevation & Depth

Clay.com uses **minimal shadow elevation**. Depth is primarily created through background colour shifts and borders, not box-shadows.

```css
/* Shadows — extracted from interactive states */
--clay-shadow-none:  none;                                   /* Default — most elements */
--clay-shadow-card:  rgba(0, 0, 0, 0.05) 0px 2px 5px;      /* Nav card hover (.nav_card-link:hover) */
--clay-shadow-focus: rgb(255, 255, 255) 0px 0px 0px 2px;   /* Slider dot focus ring */
--clay-shadow-nav-banner-hover: rgba(0, 0, 0, 0.15) 0px 0px 0px 100px inset; /* Nav banner hover */

/* Borders */
--clay-border:         #302f2c;                        /* Primary border */
--border:              1px solid rgba(231, 231, 231, 0.25); /* Subtle divider */
--dashed-border:       1px dashed #e7e7e7;             /* Dashed separator */
--_theme--cards---border: #ffffff1a;                   /* Dark card border (10% white) */
--loam---web-library_components---card--border-radius: 0rem; /* Cards: sharp corners by default (overridden per component) */
--loam---web-library_components---button--border-radius: .5rem; /* Buttons: 8px (Webflow library default, overridden to 12px in production) */
```

### Border Radius Scale

```css
--loam---web-library_border-radius---radius-xs: var(--loam---web-library_sizes---0-5rem);  /* 0.5rem / 8px */
--loam---web-library_border-radius---radius-sm: var(--loam---web-library_sizes---0-75rem); /* 0.75rem / 12px */
--loam---web-library_border-radius---radius-md: var(--loam---web-library_sizes---1rem);    /* 1rem / 16px */
--loam---web-library_border-radius---radius-lg: var(--loam---web-library_sizes---1-25rem); /* 1.25rem / 20px */
--loam---web-library_border-radius---radius-xl: var(--loam---web-library_sizes---1-5rem);  /* 1.5rem / 24px */
--loam---web-library_border-radius---rounded:   999rem;                                   /* Full pill */
--clay-radius-full: 12px; /* Primary button radius (extracted from computed styles — HIGH confidence) */
--radius--small:    .25rem; /* 4px — small UI elements */
--radius--large:    1rem;   /* 16px — cards */
```

### Z-Index Scale (inferred from Webflow conventions)

| Layer | z-index | Usage |
|---|---|---|
| Base content | 0 | Page sections, cards |
| Sticky nav | 100 | Navigation |
| Dropdown | 200 | Nav dropdown panels |
| Modal overlay | 300 | Lightbox, dialogs |
| Tooltip | 400 | Tooltips |

---

## 8. Motion

```css
/* ── Timing tokens ── */
--clay-duration-fast: 0.25s;  /* Micro-interactions (3 elements confirmed) */
--clay-duration-base: 0.3s;   /* Default transitions (17 elements confirmed) */
--clay-duration-slow: 0.4s;   /* Section reveals, complex transitions (12 elements) */
--clay-ease-default:  ease;   /* 212 elements — dominant easing across all components */

/* ── Button transition (extracted from computed style) ── */
/* background-color 0.3s cubic-bezier(0.075, 0.82, 0.165, 1) */
/* This is an ease-out-back variant — slightly bouncy on completion */

/* ── Named keyframe animations ── */
/* spin: continuous rotation (loading spinners) */
/* marquee: horizontal scroll -50% (logo strips, content carousels) */
/* marquee-up / marquee-down: vertical ticker (±400% Y travel) */
/* logos-marquee: horizontal scroll -100% (logo strip variant) */
/* fadein: opacity 0→1 (section reveal) */
/* pulse: scale 1→1.25, opacity 1→0 (notification dot, ping) */
/* bouncy: rotateZ 0→-4deg→0 (subtle wiggle on icon) */
/* load: background-position -100% (skeleton shimmer) */
```

### Animation Rules
- **Use** `transition: background-color var(--clay-duration-base) cubic-bezier(0.075, 0.82, 0.165, 1)` on all button bg changes
- **Use** `transition: all var(--clay-duration-base) var(--clay-ease-default)` on card hover states
- **Use** `@keyframes marquee` with `animation: marquee [duration] linear infinite` for logo strips
- **Use** `@keyframes fadein` for section entry animations
- **Do NOT** animate `height`, `width`, or `top/left` — use `transform` and `opacity` only
- **Respect** `prefers-reduced-motion`: wrap marquee and fadein in `@media (prefers-reduced-motion: no-preference)`

---

## 9. Anti-Patterns & Constraints

1. **NEVER use Inter, Roboto, Arial, or system-ui as the primary font without Roobertvf as the first family.**
   → Why it fails: AI agents default to Inter or system-ui when no font is specified. This produces body text that looks like a generic SaaS app, completely erasing Clay's distinct typographic personality and the visual weight of 80px Roobertvf headings.
   → What to do instead: Always declare `font-family: var(--fonts--primary-font-family)` (`Roobertvf, Arial, sans-serif`) on all text elements. Inter exists in the font declarations but is a legacy/body fallback only.

2. **NEVER apply a button border-radius other than 12px (`--clay-radius-full`) to primary CTAs.**
   → Why it fails: The Webflow library default (`--loam---web-library_components---button--border-radius: .5rem / 8px`) differs from the actual computed production value (12px). AI agents reading the CSS variable without the computed styles will use 8px and produce a visually incorrect button.
   → What to do instead: Use `border-radius: var(--clay-radius-full)` (12px) for all primary `.btn` buttons. The `.5rem` token is the library default and is overridden in production.

3. **NEVER use `brand-surface-*` colours (`rgb(203,216,16)`, `rgb(255,118,20)`, etc.) for functional UI.**
   → Why it fails: These high-saturation colours are detected on testimonial/quote tile backgrounds (decorative). AI agents see a bright colour token and assign it to buttons or status indicators, creating accessibility failures and off-brand UI.
   → What to do instead: Use `--_swatches---color--oat-100` (#f9f8f6) for default button surfaces, `--clay-accent` (#3859f9) for links/focus rings, and `brand-surface-*` only for full-bleed tile/card background fills.

4. **NEVER use negative letter-spacing values on body text or UI elements smaller than H3.**
   → Why it fails: AI agents copy the heading letter-spacing (`-.04em` = -3.2px at 80px) and apply it globally. At 14px body size this becomes -0.56px — too tight to read and visually mismatched with the design intent.
   → What to do instead: Negative letter-spacing applies ONLY to H1 (`-3.2px`), H2 (`-1.32px`), and H3 (`-0.64px`). Body, buttons, inputs, and badges use `0em` or `normal`.

5. **NEVER hardcode hex values for colours in components.**
   → Why it fails: With 764 near-duplicate colour pairs in the system, hardcoding `#000` or `#282c35` creates fragile code that breaks in dark-mode variants or theme overrides, and fails the curated token system.
   → What to do instead: Always reference `--_swatches---color--*` or `--clay-*` alias tokens. If you need pure black, use `var(--clay-text-primary)`.

6. **NEVER omit the `focus-visible` outline on interactive elements.**
   → Why it fails: Webflow strips native outlines (`outline: none`) across most interactive elements. AI agents inherit this pattern and produce inaccessible components. The design system defines `outline: 2px dashed var(--clay-text-primary); outline-offset: 2px` for buttons and `outline: 2px dashed var(--color--blue-500); outline-offset: 0px` for links.
   → What to do instead: Every button must have an `:focus-visible` rule restoring the brand outline. Every link must show `outline: 2px dashed #038ff7` on keyboard focus.

7. **NEVER construct spacing values outside the defined rem scale.**
   → Why it fails: The extraction found one off-grid value (`--clay-space-3xl: 130.27px`). AI agents treat this as a pattern and produce arbitrary pixel spacing that breaks the visual rhythm. 130.27px is a Webflow calculation artifact, not a design decision.
   → What to do instead: Use only tokens from the defined spacing scale (`--spacing--*`). For new spacing needs, round to the nearest 4px multiple and reference the closest `--spacing--` token.

8. **NEVER use `card--border-radius: 0rem` (the Webflow library default) for visible cards.**
   → Why it fails: `--loam---web-library_components---card--border-radius: 0rem` is the library primitive. AI agents use it and produce sharp-cornered cards. The actual computed card radius is `16px`.
   → What to do instead: Use `border-radius: 16px` (`--loam---web-library_border-radius---radius-md` = 1rem, or `--radius--large` = 1rem) for standard cards. Use `0rem` only for full-bleed image containers.

9. **NEVER use the saturated swatch colours (`dragonfruit`, `ube`, `pomegranate`) for text or interactive states.**
   → Why it fails: AI agents see `#f90ba6` (dragonfruit-700) or `#7934f0` (ube-600) in the colour tokens and apply them as link colours or hover states, producing garish, off-brand UI that violates WCAG contrast ratios on light backgrounds.
   → What to do instead: Use `--clay-accent` (#3859f9) for interactive blue accents, `--clay-text-primary` (#000) for all body text, and saturated swatches exclusively for decorative tile backgrounds.

10. **NEVER use `position: absolute` to replicate flex or grid layout.**
    → Why it fails: The layout digest shows Clay uses `display: flex` for button groups and nav, and `display: block` for cards. AI agents sometimes position elements absolutely when recreating grid-like layouts, breaking responsiveness at the 479px / 767px / 991px breakpoints.
    → What to do instead: Use `display: flex; flex-direction: row; gap: var(--loam---web-library_layout---grid--gap-md)` for row layouts. Use CSS Grid for multi-column sections. Reserve `position: absolute` for overlays, badges, and decorative elements only.

---

## Appendix A: Complete Token Reference

Every token extracted from the source. §0 CORE TOKENS is the primary AI signal; this appendix is reference material an AI can cross-check against when a curated role is missing.

```css
/* Colours (218) */
--loam---web-library_color---neutral--black<deleted|variable-c36ac7e1-8fbe-02c8-b299-0725f37835b2>: #1d1c1a;
--loam---web-library---colors--text: var(--loam---web-library_swatches---neutrals--black);
--_theme--terra-card---button-light: white;
--loam---web-library_color---secondary--yellow<deleted|variable-9968a3b0-2914-6749-6f13-da8b7daee1ee>: #f8d47a;
--loam---web-library_color---secondary--blue<deleted|variable-79ac7cfe-5399-ceee-c3b8-67b92fc66a66>: #0073e6;
--loam---web-library---colors--border<deleted|variable-153c7f1c-5103-5586-e137-6fbaee48816e>: #302f2c;
--loam---web-library_swatches---blueberry--400: #3859f9;
--loam---web-library_swatches---lemon--300: #fcbe11;
--loam---web-library_swatches---dragonfruit--400: #cc089e;
--loam---web-library---colors--background: var(--loam---web-library_swatches---neutrals--white);
--color--blue-500<deleted|variable-ebe93488-89c6-a5cd-d5e1-dded8473b4b5>: #038ff7;
--_swatches---color--black: #000000;
--_swatches---color--oat-700: #85817a;
--color--clay-black<deleted|variable-26800bf5>: var(--_swatches---color--black);
--archive--medium-purple<deleted|variable-7fcb262b>: #9170e6;
--archive--slate-grey<deleted|variable-1ed44f93>: #676d7e;
--archive--alice-blue<deleted|variable-4b33b3bb>: #f3f7fe;
--archive--dark-grey<deleted|variable-eb42266a>: #a0a0a0;
--_swatches---color--oat-600: #9f9b93;
--_swatches---color--oat-800: #55534e;
--_swatches---color--grey-200: #e6e8ec;
--_swatches---color--grey-50: #f7f8f9;
--_theme--chips---background: var(--_swatches---color--blueberry-900);
--_swatches---color--grey-700: #525a69;
--_swatches---color--grey-900: #282c35;
--_swatches---color--oat-100: #f9f8f6;
--_swatches---color--oat-200: #f3f2ed;
--_swatches---color--oat-400: #dad4c8;
--_swatches---color--lemon-200: #fef0a4;
--_swatches---color--ube-600: #7934f0;
--_swatches---color--oat-300: #eee9df;
--loam---web-library_swatches---lime--300: #cbd810;
--_swatches---color--tangarine-600: #fa6900;
--_swatches---color--ube-500: #8b5cf6;
--_swatches---color--ube-100: #e9e4ff;
--_swatches---color--grey-100: #eff1f3;
--_swatches---color--grey-border<deleted|variable-21448b64-1391-d1a2-0faa-3eb7fb0cf75f>: var(--_swatches---color--grey-200);
--_swatches---color--grey-300: #d6d9df;
--_swatches---color--blueberry-600: #0667d9;
--_swatches---color--blueberry-900: #002f67;
--_swatches---color--matcha-900: #03331d;
--_swatches---color--matcha-700: #02693e;
--_swatches---color--blueberry-100: #d7ebfe;
--loam---web-library_swatches---oat--400: #7b7974;
--loam---web-library_swatches---oat--300: #d1cdc7;
--_swatches---color--grey-500: #979da9;
--_swatches---color--pomegranate-700: #b21a3f;
--_swatches---color--pomegranate-100: #ffebec;
--_swatches---color--matcha-100: #dbffe0;
--_swatches---color--lemon-100: #fff8d2;
--_terra--swatches-remove---oat--oat-200<deleted|variable-e3420190-630a-e3ca-0fbd-a4b37ecb51e1>: #f4f3f0;
--color--grey-medium<deleted|variable-8c6b4a1d-24b1-aa41-3363-37e53d4709f8>: #a2a8b7;
--_swatches---color--grey-600: #717989;
--loam---web-library_swatches---lime--200: #eef673;
--_swatches---color--blueberry-200: #bee0ff;
--color--green-600<deleted|variable-1be72259-5255-72a7-9424-f413d6a9c046>: #047e4a;
--_swatches---color--lemon-300: #fadf7c;
--_swatches---color--lemon-600: #fdad15;
--_swatches---color--ube-300: #c1b0ff;
--_swatches---color--ube-200: #d8d0ff;
--_swatches---color--blueberry-500: #0382f7;
--_swatches---color--blueberry-700: #0053b5;
--loam---web-library_swatches---oat--100: #fefdfb;
--_swatches---color--oat-50: #fffcfa;
--_swatches---color--lemon-500: #fbbd41;
--_swatches---color--slushie-800: #0089ad;
--_swatches---color--matcha-600: #078a52;
--_swatches---color--oat-500: #c0bbaf;
--_swatches---color--ube-800: #43089f;
--_swatches---color--dragonfruit-500: #ff7ad5;
--_swatches---color--pomegranate-500: #e94d68;
--_swatches---color--matcha-500: #0dac65;
--_swatches---color--grey-400: #bfc4cd;
--_swatches---color--blueberry-800: #01418d;
--_swatches---color--matcha-400: #3ece82;
--_swatches---color--grey-800: #3c414d;
--_swatches---color--grey-950: #16181f;
--_swatches---color--lemon-700: #d08a11;
--_swatches---color--matcha-300: #84e7a5;
--_swatches---color--dragonfruit-200: #ffd1f1;
--_swatches---color--dragonfruit-400: #ff99df;
--_swatches---color--dragonfruit-700: #f90ba6;
--loam---web-library---colors--primary-accent: var(--loam---web-library_swatches---blueberry--400);
--_swatches---color--dragonfruit-900: #8b045c;
--_swatches---color--dragonfruit-600: #ff52c2;
--_swatches---color--blueberry-950: #001e4b;
--_swatches---color--matcha-800: #02492a;
--_swatches---color--pomegranate-600: #dd2c53;
--_swatches---color--ube-400: #a789fe;
--_swatches---color--tangarine-700: #c34e1b;
--loam---web-library_swatches---ube--400: #6d4cd6;
--_swatches---color--ube-700: #5c15cc;
--_swatches---color--matcha-200: #bcf4ca;
--_swatches---color--slushie-900: #005870;
--_swatches---color--tangarine-500: #fc8936;
--_swatches---color--slushie-500: #3bd3fd;
--_swatches---color--slushie-300: #a3ebff;
--_swatches---color--slushie-950: #00303d;
--_swatches---color--tangarine-200: #fdd4b7;
--loam---web-library_swatches---ube--200: #c8bbfb;
--loam---web-library_swatches---slushie--500: #002833;
--loam---web-library_swatches---lemon--500: #372100;
--loam---web-library_swatches---dragonfruit--500: #45012e;
--loam---web-library_swatches---blueberry--200: #bedffd;
--loam---web-library_swatches---dragonfruit--200: #f8b9e3;
--loam---web-library_swatches---blueberry--300: #429dff;
--_swatches---color--slushie-600: #2abeea;
--loam---web-library_swatches---lemon--200: #fae188;
--_swatches---color--ube-50: #f5f3ff;
--loam---web-library_swatches---tangerine--300: #ff7614;
--loam---web-library_swatches---slushie--400: #008aad;
--loam---web-library_swatches---pomegranate--500: #390307;
--_theme--terra-card---background-one: var(--loam---web-library_terra-swatches---oat--oat-200);
--loam---web-library_terra-swatches---slushie--slushie-400: #008bad;
--_theme--terra-card---background-two: var(--loam---web-library_terra-swatches---oat--oat-300);
--_swatches---color--oat-950: #1b1a18;
--_theme--cards---border<deleted|variable-392a37ad-dfd7-ea70-fbc4-13492a35e88d>: #ffffff1a;
--_terra--swatches-remove---pomegranate--pomegranate-500<deleted|variable-f75608ef-8c42-175d-798a-42b908415e09>: #3a0308;
--loam---web-library_swatches---ube--300: #a07bf9;
--_theme--pricing-cards---background: #fff0;
--loam---web-library_swatches---blueberry--500: #001433;
--loam---web-library_terra-swatches---blueberry--blueberry-400: #395afa;
--_terra--swatches-remove---blueberry--blueberry-300<deleted|variable-03031faf-6fe2-2dad-f59a-4ef38e7303db>: #429eff;
--loam---web-library_terra-swatches---blueberry--blueberry-200: #bedffe;
--loam---web-library_terra-swatches---slushie--slushie-200: #aaebfd;
--loam---web-library_swatches---slushie--100: #f0fcff;
--loam---web-library_terra-swatches---lime--lime-500: #102b03;
--loam---web-library_terra-swatches---lime--lime-200: #eef773;
--loam---web-library_swatches---lime--100: #fcfee2;
--loam---web-library_terra-swatches---lemon--lemon-500: #372201;
--loam---web-library_terra-swatches---lemon--lemon-400: #9e5802;
--loam---web-library_terra-swatches---lemon--lemon-300: #fdbe11;
--loam---web-library_terra-swatches---lemon--lemon-200: #fbe189;
--loam---web-library_swatches---lemon--100: #fefae8;
--loam---web-library_terra-swatches---tangerine--tangerine-500: #381005;
--loam---web-library_terra-swatches---tangerine--tangerine-400: #b53d0a;
--_terra--swatches-remove---tangerine--tangerine-300<deleted|variable-7c0326fd-c9f8-2d96-3b99-cfa68e943a61>: #ff7714;
--loam---web-library_terra-swatches---tangerine--tangerine-200: #fcc9ab;
--_swatches---color--tangarine-50: #fff3ed;
--loam---web-library_swatches---pomegranate--400: #c22e3d;
--loam---web-library_swatches---pomegranate--300: #fb4450;
--loam---web-library_swatches---pomegranate--200: #fcbabe;
--loam---web-library_swatches---pomegranate--100: #fff1f2;
--loam---web-library_terra-swatches---dragonfruit--dragonfruit-500: #46022f;
--loam---web-library_terra-swatches---dragonfruit--dragonfruit-300: #ff70d2;
--loam---web-library_terra-swatches---dragonfruit--dragonfruit-200: #f8b9e4;
--loam---web-library_swatches---dragonfruit--100: #fff0fa;
--loam---web-library_swatches---ube--500: #160038;
--loam---web-library_terra-swatches---ube--ube-300: #a17bf9;
--_swatches---color--ube-900: #32037d;
--_swatches---color--blueberry-50: #ecf6ff;
--_swatches---color--blueberry-300: #83c4ff;
--_swatches---color--blueberry-400: #4ca8fd;
--_swatches---color--lemon-400: #f8cc65;
--_swatches---color--lemon-800: #9d6a09;
--_swatches---color--lemon-900: #7f500a;
--_swatches---color--lemon-950: #623c02;
--_swatches---color--tangarine-100: #ffe9d5;
--_swatches---color--tangarine-300: #ffbe90;
--_swatches---color--tangarine-400: #ffa775;
--_swatches---color--tangarine-800: #9f3e15;
--_swatches---color--tangarine-900: #752b12;
--_swatches---color--tangrine-950: #431407;
--_swatches---color--oat-900: #363430;
--_swatches---color--dragonfruit-50: #fff5fc;
--_swatches---color--dragonfruit-100: #ffe5f7;
--_swatches---color--dragonfruit-300: #ffb8e8;
--_swatches---color--dragonfruit-800: #cc0687;
--_swatches---color--pomegranate-200: #fecdd3;
--_swatches---color--pomegranate-400: #fc7981;
--_swatches---color--slushie-50: #f5fdff;
--_swatches---color--slushie-100: #e0f8ff;
--_swatches---color--slushie-200: #c7f3ff;
--_swatches---color--slushie-400: #7ae3ff;
--_swatches---color--slushie-700: #02a8d4;
--loam---web-library_swatches---dragonfruit--300: #ff70d1;
--loam---web-library_swatches---lemon--400: #9e5801;
--loam---web-library_swatches---lime--400: #7f7f00;
--loam---web-library_swatches---lime--500: #102b02;
--loam---web-library_swatches---slushie--200: #aaeafc;
--loam---web-library_swatches---tangerine--200: #fcc9aa;
--loam---web-library_swatches---tangerine--400: #b53c09;
--loam---web-library_swatches---tangerine--500: #371005;
--loam---web-library_color---neutral--light-gray<deleted|variable-ecceeb49-d453-ebd8-c6f6-56dc67c47ce0>: #dfddd6;
--brand-surface-1: rgb(203, 216, 16); /* Brand surface, dominant on 2 elements — e.g. ""In my professional opinion, C" /* mined from computed styles */ */
--brand-surface-2: rgb(255, 118, 20); /* Brand surface, dominant on 2 elements — e.g. ""Clay should be an essential p" /* mined from computed styles */ */
--brand-surface-3: rgb(66, 157, 255); /* Brand surface, dominant on 2 elements — e.g. ""This job has always been abou" /* mined from computed styles */ */
--brand-surface-4: rgb(139, 4, 92); /* Brand surface, dominant on 2 elements — e.g. "Clay should be an essential pi" /* mined from computed styles */ */
--brand-surface-5: rgb(2, 105, 62); /* Brand surface, dominant on 1 element — e.g. "DestinationsConstantly update " /* mined from computed styles */ */
--brand-surface-6: rgb(221, 44, 83); /* Brand surface, dominant on 1 element — e.g. "Our first AI Hackathon week in" /* mined from computed styles */ */
--clay-bg-app: var(--loam---web-library---colors--background);
--clay-border: #302f2c;
--clay-accent: #3859f9;
--clay-text-primary: #000000;
--clay-text-secondary: #282c35;
--clay-accent-warm: #fa6900;
--clay-accent-cool: #0382f7;
--_swatches---color--white: #ffffff;
--brand-surface-1: rgb(203, 216, 16);
--brand-surface-2: rgb(255, 118, 20);
--brand-surface-3: rgb(66, 157, 255);
--brand-surface-4: rgb(139, 4, 92);
--brand-surface-5: rgb(2, 105, 62);
--brand-surface-6: rgb(221, 44, 83);
--loam---web-library---colors--primary-action: var(--loam---web-library_swatches---neutrals--black);
--loam---web-library---colors--border: #302f2c;
--border: 1px solid rgba(231,231,231,0.25);
--dashed-border: 1px dashed #e7e7e7;
--clay-success: #047e4a;
--clay-info: #038ff7;
--clay-warning: #fcbe11;
--clay-error: #b21a3f;
--_theme--cards---border: #ffffff1a;
--_theme--terra-card---background-three: #ffffff;
--_theme--terra-card---border: var(--loam---web-library_terra-swatches---oat--oat-200);
--loam---web-library_color---secondary--blue: #0073e6;
--clay-bg-surface: rgb(203, 216, 16);
--clay-accent-hover: rgb(255, 118, 20);

/* Typography (141) */
--heading-–-h3--font-size: 1.25rem;
--loam---web-library_typography---type-paragraph-lg--font-size-sm<deleted|variable-9571b88c-f7e6-8499-c3a7-32a45a896135>: 1.1rem;
--loam---web-library_components---input-label--font-size: 0.9rem;
--loam---web-library_components---button--font: var(--loam---web-library_typography---fonts--primary-font);
--loam---web-library_components---button--font-size: 1rem;
--loam---web-library_components---button--line-height: 1.3em;
--loam---web-library_components---button--font-weight: 400;
--loam---web-library_components---button--letter-spacing: 0em;
--heading-–-h2--font-size: 2rem;
--loam---web-library_size---3rem: 3rem;
--loam---web-library_sizes---1-5rem: 1.5rem;
--loam---web-library_sizes---5rem: 5rem;
--loam---web-library_typography---eyebrow--font: var(--loam---web-library_typography---fonts--secondary-font);
--loam---web-library_typography---eyebrow--font-size: clamp(var(--loam---web-library_typography---eyebrow--font-size-min-rem)*1rem,((v… <0.7KB elided>;
--loam---web-library_typography---eyebrow--line-height: 1.2;
--loam---web-library_typography---eyebrow--font-weight: 500;
--loam---web-library_sizes---0-75rem: .75rem;
--fonts--body-font: var(--fonts--primary-font-family);
--heading-–-h1--line-height: 1em;
--heading-h0--font-size: 2.5rem;
--heading-–-h2--line-height: 1.2em;
--_theme--chips---text: var(--_swatches---color--white);
--_theme--terra-card---text-primary: var(--loam---web-library_terra-swatches---oat--oat-500);
--fonts--secondary-font-family: "Canela Web", sans-serif;
--_theme--pricing-cards---text: var(--_swatches---color--black);
--_typography---h1--font-size: var(--loam---web-library_typography--restart---h1--font-size);
--_typography---h1--font-weight: var(--loam---web-library_typography--restart---h1--font-weight);
--_typography---h1--letter-spacing: var(--loam---web-library_typography--restart---h1--letter-spacing);
--_typography---paragraph-medium--font-size: var(--loam---web-library_typography--restart---paragraph-medium--font-size);
--_typography---paragraph-medium--line-height: var(--loam---web-library_typography--restart---paragraph-medium--line-height);
--_typography---paragraph-medium--letter-spacing: var(--loam---web-library_typography--restart---paragraph-medium--letter-spacing);
--_typography---h2--font-size: var(--loam---web-library_typography--restart---h2--font-size);
--_typography---h2--line-height: var(--loam---web-library_typography--restart---h2--line-height);
--_typography---h2--font-weight: var(--loam---web-library_typography--restart---h2--font-weight);
--_typography---h2--letter-spacing: var(--loam---web-library_typography--restart---h2--letter-spacing);
--_theme--terra-card---text-secondary: var(--loam---web-library_terra-swatches---oat--oat-200);
--_typography---paragraph-regular--line-height: var(--loam---web-library_typography--restart---paragraph-regular--line-height);
--_typography---paragraph-regular--letter-spacing: var(--loam---web-library_typography--restart---paragraph-regular--letter-spacing);
--_typography---h3--font: var(--_typography---fonts--primary-font);
--_typography---h3--font-size: var(--loam---web-library_typography--restart---h3--font-size);
--_typography---h3--line-height: var(--loam---web-library_typography--restart---h3--line-height);
--_typography---h3--font-weight: var(--loam---web-library_typography--restart---h3--font-weight);
--_typography---h3--letter-spacing: var(--loam---web-library_typography---h3--letter-spacing);
--_typography---paragraph-small--font-size: var(--loam---web-library_typography--restart---paragraph-small--font-size);
--_typography---paragraph-small--line-height: var(--loam---web-library_typography--restart---paragraph-small--line-height);
--_typography---paragraph-small--letter-spacing: var(--loam---web-library_typography--restart---paragraph-small--letter-spacing);
--loam---web-library_sizes---1-75rem: 1.75rem;
--fonts--primary-font-family: Roobertvf, Arial, sans-serif;
--fonts--body-font-family: Inter,sans-serif;
--_typography---fonts--secondary-font: "Roobert mono", Arial, sans-serif;
--_typography---h1--line-height: var(--loam---web-library_typography--restart---h1--line-height);
--loam---web-library_sizes---0-25rem: .25rem;
--loam---web-library_sizes---0-5rem: .5rem;
--loam---web-library_sizes---1-125rem: 1.125rem;
--loam---web-library_sizes---2-25rem: 2.25rem;
--loam---web-library_sizes---3-5rem: 3.5rem;
--loam---web-library_sizes---4rem: 4rem;
--loam---web-library_typography---fonts--primary-font: Roobert, Arial, sans-serif;
--loam---web-library_sizes---6rem: 6rem;
--loam---web-library_sizes---7rem: 7rem;
--loam---web-library_sizes---8rem: 8rem;
--loam---web-library_sizes---9rem: 9rem;
--loam---web-library_sizes---10rem: 10rem;
--loam---web-library_components---input--line-height: 1.5em;
--heading-h0--letter-spacing: 0px;
--heading-h0--font-weight: 600px;
--loam---web-library_typography---h1--font-size: clamp(var(--loam---web-library_typography---h1--font-size-min-rem)*1rem,((var(--… <0.7KB elided>;
--loam---web-library_typography---h1--font-size-min-rem: 2.8;
--loam---web-library_typography---h1--font-size-max-rem: 5.5;
--loam---web-library_typography---h1--font-weight: 600;
--loam---web-library_typography---h1--line-height: 1;
--loam---web-library_typography---h1--letter-spacing: -.04em;
--loam---web-library_typography---h2--font-size: clamp(var(--loam---web-library_typography---h2--font-size-min-rem)*1rem,((var(--… <0.7KB elided>;
--loam---web-library_typography---h2--font-size-min-rem: 2;
--loam---web-library_typography---h2--font-size-max-rem: 3.8;
--loam---web-library_typography---h2--line-height: 1.1;
--loam---web-library_typography---h3--font-size: clamp(var(--loam---web-library_typography---h3--font-size-min-rem)*1rem,((var(--… <0.7KB elided>;
--loam---web-library_typography---h3--font-size-min-rem: 1.5;
--loam---web-library_typography---h3--font-size-max-rem: 2.3;
--loam---web-library_typography---h4--font-size: clamp(var(--loam---web-library_typography---h4--font-size-min-rem)*1rem,((var(--… <0.7KB elided>;
--loam---web-library_typography---h4--font-size-min-rem: 1.3;
--loam---web-library_typography---h4--line-height: 1.4;
--loam---web-library_typography---h5--font-size: clamp(var(--loam---web-library_typography---h5--font-size-min-rem)*1rem,((var(--… <0.7KB elided>;
--loam---web-library_typography---h6--font-size: clamp(var(--loam---web-library_typography---h6--font-size-min-rem)*1rem,((var(--… <0.7KB elided>;
--loam---web-library_typography---h6--font-size-min-rem: .9;
--loam---web-library_typography---paragraph-xl--font-size: clamp(var(--loam---web-library_typography---paragraph-xl--font-size-min-rem)*1re… <0.8KB elided>;
--loam---web-library_typography---paragraph-lg--font-size: clamp(var(--loam---web-library_typography---paragraph-lg--font-size-min-rem)*1re… <0.8KB elided>;
--loam---web-library_typography---paragraph-lg--font-size-max-rem: 1.25;
--loam---web-library_typography---paragraph-body--font-size: clamp(var(--loam---web-library_typography---paragraph-body--font-size-min-rem)*1… <0.8KB elided>;
--loam---web-library_typography---paragraph-body--line-height: 1.6;
--loam---web-library_typography---paragraph-sm--font-size-min-rem: .75;
--loam---web-library_typography---eyebrow--font-size-min-rem: .7;
--loam---web-library_typography---eyebrow--font-size-max-rem: .8;
--loam---web-library_typography---eyebrow--letter-spacing: 0.1em;
--loam---web-library_typography-v2---h1--font-2: var(--loam---web-library_typography-v2---fonts--primary-font-2);
--loam---web-library_typography-v2---eyebrow--font-2: var(--loam---web-library_typography-v2---fonts--secondary-font-2);
--loam---web-library_typography--restart---h1--font: var(--loam---web-library_typography--restart---fonts--primary-font);
--loam---web-library_typography--restart---h1--font-size: 5.5rem;
--loam---web-library_typography--restart---h1--font-weight: 575;
--loam---web-library_typography--restart---h2--letter-spacing: -.03em;
--loam---web-library_typography--restart---h3--letter-spacing-3: -.02em;
--loam---web-library_typography--restart---paragraph-small--font-size: .875rem;
--loam---web-library_typography--restart---eyebrow--font-3: var(--loam---web-library_typography--restart---fonts--secondary-font);
--_typography---h4--font-weight: 0;
--_typography---paragraph-medium--font-weight: var(--loam---web-library_typography--restart---paragraph-medium--font-weight);
--_typography---paragraph-regular--font-size: var(--loam---web-library_typography--restart---paragraph-regular--font-size);
--_typography---paragraph-regular--font-weight: var(--loam---web-library_typography--restart---paragraph-regular--font-weight);
--_typography---paragraph-small--font-weight: var(--loam---web-library_typography--restart---paragraph-small--font-weight);
--font-size-xs: 12.8px; /* 11 elements — e.g. p "Research target comp", p "Combine multiple dat", p "Track job changes pr" /* mined from computed styles */ */
--font-size-sm: 14px; /* 37 elements — e.g. p "Product", p "Product", p "Use Cases" /* mined from computed styles */ */
--font-size-md: 16px; /* 209 elements — e.g. h3 "SOC 2 Type II", h3 "GDPR", h3 "CCPA" /* mined from computed styles */ */
--font-size-lg: 20px; /* 4 elements — e.g. h3 "“Clay has helped Ant", div "4h/week", div "100+" /* mined from computed styles */ */
--font-size-xl: 32px; /* 6 elements — e.g. h2 "Go to market with un", h3 "Clean and format dat", h3 "Run action steps con" /* mined from computed styles */ */
--font-size-2xl: 44px; /* 5 elements — e.g. h2 "Every GTM data point", h2 "AI that’s contextual", h2 "Orchestrate and act " /* mined from computed styles */ */
--font-size-3xl: 60px; /* 4 elements — e.g. h2 "Turn data into actio", h2 "Turn your growth ide", h3 "Cut costs, access da" /* mined from computed styles */ */
--font-weight-semibold: 550; /* 22 elements — e.g. p "Claygents", p "Waterfall", p "Signals and Intent" /* mined from computed styles */ */
--line-height-tight: 19.6px; /* 22 elements — e.g. p "Claygents", p "Waterfall", p "Signals and Intent" /* mined from computed styles */ */
--line-height-normal: 21px; /* 15 elements — e.g. p "Product", p "Product", p "Use Cases" /* mined from computed styles */ */
--line-height-loose: 24px; /* 196 elements — e.g. a "ProductProduct", a "Use CasesUse Cases", a "SolutionsSolutions" /* mined from computed styles */ */
--clay-font-mono: "Roobert mono", Arial, sans-serif;
--loam---web-library_typography---h2--letter-spacing: -.04em;
--loam---web-library_typography---h3--line-height: 1.2;
--loam---web-library_typography---h3--letter-spacing: -.04em;
--clay-font-weight-semibold: 550;
--clay-font-size-xs: 12.8px;
--clay-font-size-sm: 14px;
--clay-font-size-md: 16px;
--clay-font-size-lg: 20px;
--clay-font-size-xl: 32px;
--clay-font-size-2xl: 44px;
--clay-font-size-3xl: 60px;
--clay-line-height-tight: 19.6px;
--clay-line-height-normal: 21px;
--clay-line-height-loose: 24px;
--loam---web-library_typography---h4--letter-spacing: 0em;
--loam---web-library_typography---paragraph-xl--line-height: 1.4;
--loam---web-library_typography---paragraph-lg--line-height: 1.5;
--loam---web-library_typography---paragraph-sm--font-size: 0.75rem;
--loam---web-library_typography---paragraph-sm--line-height: 1.5;
--loam---web-library_components---input--font-size: 1rem;
--loam---web-library_components---input-label--line-height: 1em;

/* Spacing (71) */
--loam---web-library_components---button--vertical-padding: .7em;
--loam---web-library_components---button--horizontal-padding: 1em;
--loam---web-library_layout---spacing--margin-md: 2em;
--loam---web-library_layout---grid--gap-main: 40px;
--loam---web-library_components---card--padding: clamp(var(--loam---web-library_components---card--padding-min-rem)*1rem,((var(--… <0.7KB elided>;
--loam---web-library_components---section--padding: clamp(var(--loam---web-library_components---section--padding-min-rem)*1rem,((var… <0.7KB elided>;
--loam---web-library_typography---eyebrow--bottom-margin: 1.5em;
--paragraph--default: .87rem;
--spacing--0-5rem: 0.5rem;
--spacing--1rem: 1rem;
--spacing--4rem: 4rem;
--spacing--1-25rem: 1.25rem;
--spacing--3rem: 3rem;
--spacing--2rem: 2rem;
--spacing--1-5rem: 1.5rem;
--spacing--5rem: 5rem;
--spacing--0-25rem: 0.25rem;
--layout--section-padding-lg: var(--spacing--6rem);
--layout--section-padding-md: var(--spacing--4rem);
--layout--section-padding-sm: var(--spacing--3rem);
--spacing--8rem: 8rem;
--spacing--2-5rem: 2.5rem;
--layout--section-padding-xl: var(--spacing--8rem);
--spacing--6rem: 6rem;
--paragraph--small: .875rem;
--form--gap: var(--spacing--1-5rem);
--spacing--0-75rem: 0.75rem;
--spacing--4-5rem: 4.5rem;
--spacing--7rem: 7rem;
--_layout---gap--small: var(--loam---web-library_layout--restart---gap--small);
--_layout---gap--regular: var(--loam---web-library_layout--restart---gap--regular);
--spacing--1-75rem: 1.75rem;
--_layout---gap--large: var(--loam---web-library_layout--restart---gap--large);
--_layout---gap--medium: var(--loam---web-library_layout--restart---gap--medium);
--loam---web-library_layout---grid--gap-md: 24px;
--loam---web-library_layout---grid--gap-sm: 8px;
--loam---web-library_layout---grid--gap-button: 16px;
--loam---web-library_layout---spacing--margin-xs: .5em;
--loam---web-library_layout---spacing--margin-lg: 3em;
--loam---web-library_components---section--padding-min-rem: 3;
--_theme--terra-card---border: var(--loam---web-library_terra-swatches---oat--oat-200);
--loam---web-library_components---section--padding-max-rem: 6;
--loam---web-library_components---card--padding-min-rem: 1;
--loam---web-library_components---card--padding-max-rem: 1.5;
--loam---web-library_typography---h1--bottom-margin: .3em;
--loam---web-library_typography---h2--bottom-margin: .2em;
--loam---web-library_typography---h4--bottom-margin: .4em;
--loam---web-library_typography---h6--bottom-margin: .6em;
--spacing--11rem: 11rem;
--border: 1px solid rgba(231, 231, 231, 0.25);
--dashed-border: 1px dashed #e7e7e7;
--space-sm: 12px; /* 42 elements — e.g. a .u-quote-wrapper, a .u-quote-wrapper, a .u-quote-wrapper /* mined from computed styles */ */
--space-lg: 20px; /* 12 elements — e.g. div .cs-card_button, div .cs-card_button, div .cs-card_button /* mined from computed styles */ */
--space-2xl: 32px; /* 33 elements — e.g. section .section, section .section, section .section /* mined from computed styles */ */
--space-3xl: 130.27px; /* 20 elements — e.g. div .nav__section--container, div .nav__section--container, div .nav__section--container /* mined from computed styles */ */
--clay-space-sm: 12px;
--clay-space-md: 24px;
--clay-space-lg: 20px;
--clay-space-2xl: 32px;
--loam---web-library_typography---h3--bottom-margin: .3em;
--clay-space-3xl: 130.27px;
--clay-space-xs: 0.2em;
--clay-space-xl: 1.75rem;
--spacing--0-875rem: .875rem;
--layout--section-padding-xs: var(--spacing--3rem);
--layout--row-col-gap: 1rem;
--loam---web-library_layout--restart---gap--small: 1rem;
--loam---web-library_layout--restart---gap--regular: 1.25rem;
--loam---web-library_layout--restart---gap--medium: 1.5rem;
--loam---web-library_layout--restart---gap--large: 1.5rem;
--loam---web-library_layout---spacing--margin-sm: 1em;

/* Radius (24) */
--loam---web-library_components---card--border-radius: 0rem;
--loam---web-library_components---button--border-radius: 0.5rem;
--radius--small: 0.25rem;
--radius--large: 1rem;
--loam---web-library_border-radius---radius-xs: var(--loam---web-library_sizes---0-5rem);
--_layout---radius--regular: var(--loam---web-library_layout--restart---radius--regular);
--_layout---radius--large: var(--loam---web-library_layout--restart---radius--large);
--_layout---radius--medium: var(--loam---web-library_layout--restart---radius--medium);
--_layout---radius--small: var(--loam---web-library_layout--restart---radius--small);
--loam---web-library_border-radius---radius-sm: 0.75rem;
--loam---web-library_border-radius---radius-md: 1rem;
--loam---web-library_border-radius---radius-lg: 1.25rem;
--loam---web-library_border-radius---radius-xl: var(--loam---web-library_sizes---1-5rem);
--loam---web-library_border-radius---rounded: 999rem;
--loam---web-library_layout--restart---radius--large: 1.75rem;
--loam---web-library_layout--restart---radius--medium: 1.25rem;
--loam---web-library_layout--restart---radius--regular: .875rem;
--loam---web-library_layout--restart---radius--small: .75rem;
--radius-sm: 4px; /* 4 elements — e.g. button .swiper_nav-button "Previous", button .swiper_nav-button "Next", button .swiper_nav-button "Previous" /* mined from computed styles */ */
--radius-md: 11px; /* 10 elements — e.g. div .cs-pill "Hackathon", div .cs-pill "Case study", div .cs-pill "Case study" /* mined from computed styles */ */
--radius-lg: 11.2px; /* 3 elements — e.g. div .cs-card_button-fill, div .cs-card_button-fill, div .cs-card_button-fill /* mined from computed styles */ */
--radius-full: 12px; /* 16 elements — e.g. a .btn "Back", a .btn, a .btn "Get a demo" /* mined from computed styles */ */
--clay-radius-full: 12px;
--loam---web-library_components---input--border-radius: 0.5rem;

/* Effects (25) */
--loam---web-library_swatches---neutrals--black: var(--loam---web-library_swatches---oat--500);
--loam---web-library_swatches---neutrals--white: var(--loam---web-library_swatches---oat--100);
--loam---web-library_components---container--max-width: calc(var(--loam---web-library_layout---fluid--max)*1rem);
--_theme--terra-card---foreground: var(--loam---web-library_terra-swatches---oat--oat-400);
--i: 0;
--_states---on: 1;
--loam---web-library_swatches---blueberry--100: aliceblue;
--_layout---card--large: var(--loam---web-library_layout--restart---card--large);
--_layout---card--regular: var(--loam---web-library_layout--restart---card--regular);
--_layout---section-vertical--regular: var(--loam---web-library_layout--restart---section-vertical--regular);
--_layout---section-vertical--small: var(--loam---web-library_layout--restart---section-vertical--small);
--_layout---section-vertical--medium: var(--loam---web-library_layout--restart---section-vertical--medium);
--_layout---section-vertical--large: var(--loam---web-library_layout--restart---section-vertical--large);
--loam---web-library_terra-swatches---lime--lime-400: olive;
--_layout---section-horizontal--large: var(--loam---web-library_layout--restart---section-horizontal--large);
--_layout---section-horizontal--medium: var(--loam---web-library_layout--restart---section-horizontal--medium);
--_layout---section-horizontal--regular: var(--loam---web-library_layout--restart---section-horizontal--regular);
--_layout---card--medium: var(--loam---web-library_layout--restart---card--medium);
--_layout---card--small: var(--loam---web-library_layout--restart---card--small);
--loam---web-library_layout---fluid--max: 90;
--loam---web-library_layout---fluid--min: 20;
--clay-shadow-none: none;
--clay-shadow-card: rgba(0, 0, 0, 0.05) 0px 2px 5px;
--clay-shadow-focus: rgb(255, 255, 255) 0px 0px 0px 2px;
--clay-shadow-nav-banner-hover: rgba(0, 0, 0, 0.15) 0px 0px 0px 100px inset;

/* Motion (13) */
----motion-spin: @keyframes spin { 
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}; /* @keyframes spin */
----motion-load: @keyframes load { 
  100% { background-position: -100% 0px; }
}; /* @keyframes load */
----motion-marquee: @keyframes marquee { 
  100% { transform: translateX(-50%); }
}; /* @keyframes marquee */
----motion-fadein: @keyframes fadein { 
  0% { opacity: 0; }
  100% { opacity: 1; }
}; /* @keyframes fadein */
----motion-marquee-up: @keyframes marquee-up { 
  0% { transform: translateY(0%); }
  100% { transform: translateY(-400%); }
}; /* @keyframes marquee-up */
----motion-marquee-down: @keyframes marquee-down { 
  0% { transform: translateY(0%); }
  100% { transform: translateY(400%); }
}; /* @keyframes marquee-down */
----motion-logos-marquee: @keyframes logos-marquee { 
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
}; /* @keyframes logos-marquee */
----motion-pulse: @keyframes pulse { 
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.25); opacity: 0; }
}; /* @keyframes pulse */
----motion-bouncy: @keyframes bouncy { 
  0% { transform: rotateZ(0deg); }
  50% { transform: rotateZ(-4deg); }
  100% { transform: rotateZ(0deg); }
}; /* @keyframes bouncy */
--duration-fast: 0.25s; /* 3 elements — e.g. button, div, div /* mined from computed styles */ */
--duration-base: 0.3s; /* 17 elements — e.g. button, button, a /* mined from computed styles */ */
--duration-slow: 0.4s; /* 12 elements — e.g. div, div, div /* mined from computed styles */ */
--ease-default: ease; /* 212 elements — e.g. button, button, button /* mined from computed styles */ */
```

## Appendix B: Token Source Metadata

```
tokenSource: extracted-css-vars
confidence: high
totalExtracted: 707 CSS custom properties
curatedTokens: 41 mapped to standard --clay-* roles
originalNamesPreserved: true
reconstructedTokens: 6 brand-surface-* colours (from computed styles, medium confidence)

fontDeclarations:
  - Roobertvf (variable, 300–900) — primary, extracted
  - Canela Web (300, 400, 400 italic) — secondary, extracted
  - Roobert (400, 400i, 500, 500i, 600, 600i) — legacy/library, extracted
  - Roobert mono (300–900 variable) — mono, extracted
  - Inter (400, 500, 600, 700) — legacy body fallback, extracted
  - Canela (100 italic) — display variant, extracted

computedStylesUsed:
  - h1, h2, h3, body, button_primary, card, badge, dropdown, avatar confirmed
  - border-radius census: 4px (4 el), 11px (10 el), 11.2px (3 el), 12px (16 el primary buttons)
  - button radius: 12px confirmed canonical from 16 elements including primary CTAs

breakpointsExtracted: 479px, 767px, 768px, 990px, 991px, 992px, 1150px

warnings:
  - --clay-space-3xl (130.27px) is off 4px grid — Webflow clamp calculation artifact
  - 764 near-duplicate colour pairs found — only 13 mapped to roles; excess hidden
  - --loam---web-library_components---button--border-radius (.5rem) overridden in production to 12px
  - --loam---web-library_components---card--border-radius (0rem) overridden in production to 16px
  - brand-surface-* tokens synthesised from computed dominant colours; not found as explicit CSS variables

librariesDetected: Webflow (primary), Tailwind (utility classes present), Bootstrap (detected)
```