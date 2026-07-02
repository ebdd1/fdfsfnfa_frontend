# Landing Page - Design Overrides

> **OVERRIDE FILE:** Rules here override `MASTER.md` for this page only.

**Page:** Landing Page (`/`)
**Style:** Flat Design + Bento Grids - Warm, Trustworthy, Approachable
**Generated:** 2026-06-29

---

## Style Summary

**Style:** Flat Design + Bento Grids
- Clean, minimal, trustworthy
- Rounded corners (12-24px)
- Soft shadows
- Warm teal colors
- Friendly typography

**Mood:** "Warm home for students looking for kost"

---

## Color Palette Override

| Role | Hex | Usage |
|------|-----|-------|
| Primary | `#0F766E` | Trust teal - logo, headings, primary actions |
| Primary Light | `#14B8A6` | Light teal - hover states, accents |
| Primary Dark | `#134E4A` | Dark teal - text on light backgrounds |
| Accent | `#0369A1` | CTA blue - secondary actions |
| Background | `#F0FDFA` | Light teal bg - section backgrounds |
| Surface | `#FFFFFF` | White - cards, inputs |
| Success | `#22C55E` | Green - verified badges, success states |
| Warning | `#F59E0B` | Amber - attention states |

---

## Typography Override

**Font Pairing:** Fredoka + Nunito (Google Fonts)

```css
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');

--font-heading: 'Fredoka', sans-serif;
--font-body: 'Nunito', sans-serif;
```

**Rules:**
- Headings: `font-family: 'Fredoka'`, `font-weight: 700`
- Body: `font-family: 'Nunito'`, `font-weight: 400-600`
- Rounded, friendly feel
- NOT Inter, Roboto, system-ui

---

## Component Specs Override

### Buttons

```css
.btn-primary {
  background: #0F766E;
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: #134E4A;
}

.btn-secondary {
  background: transparent;
  color: #0F766E;
  border: 2px solid #0F766E;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}
```

### Cards (Bento Style)

```css
.card-bento {
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  transition: box-shadow 200ms ease;
}

.card-bento:hover {
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}
```

### Inputs

```css
.input-friendly {
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input-friendly:focus {
  border-color: #14B8A6;
  outline: none;
}
```

---

## Anti-AI-Slop Checklist

These patterns MUST NOT appear:

- [ ] ❌ Purple/violet gradients
- [ ] ❌ 3-column icon-in-circle feature grid
- [ ] ❌ Inter/Roboto/system-ui as primary font
- [ ] ❌ Centered-everything layout
- [ ] ❌ Generic copy ("Welcome to...", "Unlock the power...")
- [ ] ❌ Decorative blobs/shapes
- [ ] ❌ Glassmorphism
- [ ] ❌ Emoji as primary icons

**Required (Anti-AI-Slop):**
- [ ] ✓ Fredoka + Nunito fonts (not generic)
- [ ] ✓ Teal trust colors (not blue-purple)
- [ ] ✓ Bento grid layout (not uniform columns)
- [ ] ✓ Authentic Indonesian copy
- [ ] ✓ Problem/Solution section with real pain points
- [ ] ✓ Student testimonials with local names

---

## Section Structure

1. **Navigation** - Sticky, clean, trust-building
2. **Hero** - Warm headline, search form, featured card
3. **Stats Bar** - Teal background, trust numbers
4. **Problem/Solution** - Bento cards, red/green contrast
5. **Features** - Bento grid (varied sizes)
6. **Featured Kost** - Card grid with real properties
7. **Testimonials** - Student quotes, star ratings
8. **CTA** - Teal background, warm invitation
9. **Trust Badges** - Simple text + icons
10. **Footer** - Clean, minimal

---

## Design Principles

1. **Trust First** - Teal colors signal reliability
2. **Warm & Approachable** - Rounded fonts, soft shadows
3. **Student-Centric** - Indonesian copy, local context
4. **Problem-Aware** - Acknowledge pain points, offer solutions
5. **No Hype** - Authentic, not salesy

---

## Pre-Delivery Verification

- [ ] View on http://localhost:5173/
- [ ] Check: Fredoka + Nunito fonts loaded
- [ ] Check: Teal color scheme visible
- [ ] Check: Bento grid layout (varied card sizes)
- [ ] Check: Problem/Solution section
- [ ] Check: Student testimonials with Indonesian names
- [ ] Check: No AI slop patterns
- [ ] Check: Mobile responsive (375px, 768px)
- [ ] Check: Accessible contrast ratios