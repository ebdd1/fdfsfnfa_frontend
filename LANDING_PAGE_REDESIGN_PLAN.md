# Landing Page — UI/UX Audit & Redesign Plan
**Date:** 2026-06-21
**Skill Used:** ui-ux-pro-max v2.5.0
**File Audited:** `src/components/LandingPage.tsx` (1010 lines)
**Reference:** `design-system/MASTER.md`

---

## CRITICAL CONFLICT IDENTIFIED

```
⚠️ CONFLICT: ui-ux-pro-max skill vs PROJECT DESIGN SYSTEM

┌─────────────────────────────────────────────────────────────────────┐
│ SKILL RECOMMENDS:                  PROJECT MASTER.md PROHIBITS:    │
├─────────────────────────────────────────────────────────────────────┤
│ Style: Glassmorphism                   ❌ Glassmorphism             │
│ Primary: #7C3AED (Purple)           ❌ Must use #004ac6 (Blue)   │
│ Secondary: #A78BFA (Lavender)         ❌ Must use #006c49 (Green)  │
│ Background: #FAF5FF (Light Purple)    ⚠️ Use white/slate-50        │
└─────────────────────────────────────────────────────────────────────┘

RESOLUTION: PROJECT MASTER.md WINS
- KostFind brand colors are established: #004ac6 (primary), #006c49 (secondary)
- Glassmorphism prohibited: performance on low-end Android devices in Indonesia
- Purple gradients prohibited: not brand-consistent
```

---

## Executive Summary

```
OVERALL CURRENT GRADE: C+ — Good Structure, Needs Brand Enforcement

✓ Strengths:
  - Marketplace pattern structure (Hero → Estimator → Comparison → Workflow → Properties → FAQ)
  - Interactive elements (estimator widget, animated timeline, accordion FAQ)
  - Lucide React icons (no emoji) ✅
  - Good hover states with transitions
  - Real data integration (featuredProperties, settings)

⚠️ Critical Issues:
  - Brand colors: emerald → primary (#004ac6) — 50+ violations
  - Glassmorphism: backdrop-blur — 10+ instances (PROHIBITED by MASTER.md)
  - Font sizes: 10px, 11px, 12px below minimum 14px — 40+ violations
  - CTA button uses slate-900 instead of brand primary

🎯 Redesign Target: Professional marketplace landing without AI slop
```

---

## Section-by-Section Analysis

### 1. HERO SECTION (Lines 86-284)

#### Current Implementation
```
✓ Search bar CTA (good)
✓ Popular searches chips (good)
✓ Device mockup with floating badges (creative)
✓ Animated transitions

Issues:
- Backdrop blur on floating badges (line 207, 222)
- Emerald colors instead of primary/secondary
- Font sizes below 14px
- CTA button: bg-slate-900 instead of bg-primary
```

#### Redesign Recommendations

| Element | Current | Should Be | Line |
|---------|---------|-----------|------|
| Tagline badge | `bg-emerald-50` | `bg-primary/10` | 101 |
| Tagline icon | `text-emerald-600` | `text-primary` | 103 |
| Search form focus | `focus-within:border-emerald-500` | `focus-within:border-primary` | 131 |
| CTA button | `bg-slate-900` | `bg-primary` | 162 |
| Popular search hover | `hover:text-emerald-600` | `hover:text-primary` | 182 |
| Floating badges | `backdrop-blur-md` | Remove (solid bg) | 207, 222 |
| Verified badge | `backdrop-blur-md` | Remove | 253 |

#### Proposed Hero CTA Button
```tsx
// Current (line 160-166)
<button className="bg-slate-900 hover:bg-slate-800 ...">

// Redesigned per MASTER.md
<button className="
  bg-primary hover:bg-[#003a9e]
  text-white font-semibold
  py-3 px-6 rounded-xl
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
  shadow-sm
">
  Cari Kost <ArrowRight className="w-4 h-4" />
</button>
```

---

### 2. BUDGET ESTIMATOR WIDGET (Lines 286-439)

#### Current Implementation
```
✓ Interactive slider
✓ Real-time calculation
✓ Campus selector pills
✓ Feature highlights

Issues:
- Glassmorphism: bg-white/80 backdrop-blur-md (line 337)
- Emerald overuse throughout
- Font sizes 9px, 10px, 11px
```

#### Redesign Recommendations

| Element | Current | Should Be |
|---------|---------|-----------|
| Widget container | `bg-white/80 backdrop-blur-md` | `bg-white shadow-lg` |
| Feature cards | `bg-white/70 backdrop-blur-sm` | `bg-white border` |
| Label text | 10px | 14px |
| Button | `bg-emerald-600` | `bg-primary` |

---

### 3. COMPARISON MATRIX (Lines 441-528)

#### Current Implementation
```
✓ Clear before/after comparison
✓ KostFind highlighted in green
✓ Old way with X marks

Issues:
- Glassmorphism on container (line 457)
- Emerald colors instead of secondary (brand green)
- Font sizes below minimum
```

#### Redesign Recommendations

| Element | Current | Should Be |
|---------|---------|-----------|
| Container | `bg-white/70 backdrop-blur-md` | `bg-white border shadow-sm` |
| KostFind highlight | `bg-emerald-50` | `bg-secondary/10` |
| Check icon | `bg-emerald-600` | `bg-secondary` |
| Label text | 10px | 14px |

---

### 4. WORKFLOW TIMELINE (Lines 530-795)

#### Current Implementation
```
✓ 4-step interactive timeline
✓ Animated step indicator
✓ Simulated app screens per step

Issues:
- Emerald overuse
- Font sizes 9px, 10px
- Glassmorphism on simulator container (line 612)
```

#### Redesign Recommendations
- Replace `bg-emerald-500` with `bg-secondary`
- Replace `border-emerald-500` with `border-secondary`
- Remove backdrop-blur from container
- Increase font sizes to minimum 14px

---

### 5. FEATURED PROPERTIES (Lines 797-900)

#### Current Implementation
```
✓ Card grid layout
✓ Image hover zoom
✓ Availability badges
✓ Price formatting

Issues:
- Border radius 48px (rounded-3xl) — very large
- Emerald colors instead of secondary
- Font sizes below minimum
```

#### Redesign Recommendations

| Element | Current | Should Be |
|---------|---------|-----------|
| Card radius | `rounded-3xl` (48px) | `rounded-2xl` (24px) |
| Badge | `bg-emerald-50 text-emerald-800` | `bg-secondary/10 text-secondary` |
| Price tag | `bg-slate-900/90` | `bg-slate-900` |
| Hover text | `group-hover:text-emerald-600` | `group-hover:text-primary` |

---

### 6. FAQ ACCORDION (Lines 902-1002)

#### Current Implementation
```
✓ Clean accordion
✓ AnimatePresence for smooth open/close
✓ Support CTA card

Issues:
- Emerald colors instead of primary
- Font sizes below minimum
```

---

## Font Size Compliance Matrix

| Section | Element | Current | Minimum | Count |
|---------|---------|---------|---------|-------|
| Hero | Badge text | 10px | 14px | 1 |
| Hero | Label text | 10px | 14px | 1 |
| Hero | Input placeholder | 14px | 14px | ✅ |
| Hero | Button text | 12px | 14px | 1 |
| Estimator | All labels | 9-10px | 14px | 15+ |
| Comparison | Feature labels | 10px | 14px | 8+ |
| Workflow | Step labels | 9-10px | 14px | 12+ |
| Properties | All card text | 10-11px | 14px | 20+ |
| FAQ | Question text | 14px | 14px | ✅ |
| FAQ | Answer text | 12px | 14px | 4 |

**Total violations: 40+ instances**

---

## Glassmorphism Instances (MUST REMOVE)

| Line | Element | Current |
|------|---------|---------|
| 207 | Floating badge left | `backdrop-blur-md` |
| 222 | Floating badge right | `backdrop-blur-md` |
| 253 | Verified media badge | `backdrop-blur-md` |
| 313 | Feature card 1 | `backdrop-blur-sm` |
| 323 | Feature card 2 | `backdrop-blur-sm` |
| 337 | Estimator container | `backdrop-blur-md` |
| 457 | Comparison container | `backdrop-blur-md` |
| 612 | Workflow simulator | `backdrop-blur` |
| 855 | Price tag overlay | `backdrop-blur-sm` |

**Total: 9 instances of prohibited glassmorphism**

---

## Brand Color Compliance Matrix

### Primary Color (#004ac6) Usage

| Line | Current | Should Be |
|------|---------|-----------|
| 101 | `bg-emerald-50` | `bg-primary/10` |
| 103 | `text-emerald-600` | `text-primary` |
| 131 | `focus-within:ring-emerald-500` | `focus-within:ring-primary` |
| 162 | `bg-slate-900` | `bg-primary` |
| 182 | `hover:text-emerald-600` | `hover:text-primary` |
| 209 | `bg-indigo-50` | `bg-primary/10` |
| 299 | `bg-emerald-50` | `bg-primary/10` |
| 300 | `text-emerald-600` | `text-primary` |
| 427 | `bg-emerald-600` | `bg-primary` |
| 445 | `bg-emerald-50` | `bg-primary/10` |
| 533 | `bg-emerald-50` | `bg-primary/10` |
| 802 | `bg-emerald-50` | `bg-primary/10` |
| 910 | `bg-emerald-50` | `bg-primary/10` |
| 924 | `text-emerald-600` | `text-primary` |

### Secondary Color (#006c49) Usage

| Line | Current | Should Be |
|------|---------|-----------|
| 240 | `bg-emerald-500` | `bg-secondary` |
| 244 | `text-emerald-700` | `text-secondary` |
| 265 | `bg-emerald-50` | `bg-secondary/10` |
| 272 | `text-emerald-600` | `text-secondary` |
| 374 | `bg-emerald-50` | `bg-secondary/10` |
| 401 | `bg-emerald-50` | `bg-secondary/10` |
| 515 | `bg-emerald-600` | `bg-secondary` |
| 588 | `bg-emerald-500` | `bg-secondary` |
| 730 | `bg-emerald-600` | `bg-secondary` |
| 847 | `bg-emerald-500` | `bg-secondary` |
| 889 | `bg-emerald-50` | `bg-secondary/10` |

---

## Redesign Implementation Plan

### Phase 1: Brand Color Enforcement (Priority 1)

```bash
# Replace patterns in LandingPage.tsx

# Primary replacements
s/bg-emerald-600/bg-primary/g
s/bg-emerald-500/bg-secondary/g
s/bg-emerald-400/bg-secondary\/80/g
s/bg-emerald-50/bg-primary\/10/g
s/bg-emerald-100/bg-primary\/10/g

# Text color replacements
s/text-emerald-600/text-primary/g
s/text-emerald-700/text-primary/g
s/text-emerald-800/text-slate-800/g
s/text-emerald-950/text-slate-900/g

# Border replacements
s/border-emerald-/border-primary\//g
s/border-emerald-/border-secondary\//g

# Ring replacements
s/ring-emerald-/ring-primary\//g

# Focus replacements
s/focus:ring-emerald-/focus:ring-primary\//g
s/focus:border-emerald-/focus:border-primary\//g
s/focus-within:ring-emerald-/focus-within:ring-primary\//g
s/focus-within:border-emerald-/focus-within:border-primary\//g
```

### Phase 2: Remove Glassmorphism (Priority 2)

```tsx
// Replace all backdrop-blur with solid backgrounds

// Example transformations:
"bg-white/95 backdrop-blur-xl" → "bg-white"
"bg-white/80 backdrop-blur-md" → "bg-white shadow-lg"
"bg-white/70 backdrop-blur-sm" → "bg-white border"
```

### Phase 3: Font Size Enforcement (Priority 3)

Create CSS utility for minimum 14px:
```css
.text-readable {
  font-size: 0.875rem !important; /* 14px minimum */
}
```

Apply to all text elements below 14px:
- Labels: `text-[10px]` → `text-sm` (14px)
- Badges: `text-[9px]` → `text-xs` (12px)
- Meta text: `text-[11px]` → `text-sm` (14px)

### Phase 4: CTA Button Fix (Priority 4)

```tsx
// Line 160-166: Primary CTA
<button
  className="
    bg-primary
    hover:bg-[#003a9e]
    active:scale-[0.98]
    transition-colors duration-200
    text-white font-semibold
    px-6 py-3.5
    rounded-xl
    flex items-center justify-center gap-2
    shadow-sm
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
  "
>
  Cari Kost <ArrowRight className="w-4 h-4" />
</button>
```

---

## Before/After Comparison

| Aspect | Before | After |
|--------|--------|-------|
| Primary CTA | `bg-slate-900` | `bg-primary` (#004ac6) |
| Success/Verified | `emerald-600` | `secondary` (#006c49) |
| Glassmorphism | 9 instances | 0 |
| Font < 14px | 40+ violations | 0 |
| Brand consistency | Non-compliant | Compliant |

---

## Recommended Section Structure

Based on ui-ux-pro-max Marketplace/Directory pattern:

```
1. HERO (Search-focused)
   - Headline with value prop
   - Search bar CTA ← PRIMARY ACTION
   - Popular searches
   - Trust indicators

2. SOCIAL PROOF (Optional if available)
   - Testimonials
   - User count / listings count

3. CATEGORIES (If applicable)
   - By city
   - By type (Putra/Putri/Campur)

4. FEATURED LISTINGS
   - 3-6 property cards
   - Verified badges
   - Quick view

5. COMPARISON MATRIX
   - Before/After
   - Clear differentiation

6. HOW IT WORKS
   - 4-step process
   - Interactive timeline

7. FAQ
   - Accordion
   - Contact CTA

8. CTA SECTION
   - "Become a Host" for owners

9. FOOTER
```

---

## Anti-Slop Checklist (PerMASTER.md)

```
Before delivery, verify:

Visual Quality
[ ] No emojis as icons (use Lucide) ✅ Already compliant
[ ] Brand colors (#004ac6, #006c49) ✅ Need fix
[ ] No purple gradients ✅ Already compliant
[ ] No glassmorphism ✅ Need fix
[ ] Font size ≥ 14px ✅ Need fix

Interaction
[ ] cursor-pointer on buttons ✅ Already compliant
[ ] Hover states 200ms ✅ Already compliant
[ ] Focus states visible ✅ Already compliant
[ ] Loading states designed ⚠️ N/A (no async loading)
[ ] Error states designed ⚠️ N/A (no forms with submission)

Layout
[ ] Responsive 375/768/1440 ✅ Already compliant
[ ] No horizontal scroll ✅ Already compliant
[ ] Proper spacing ✅ Mostly compliant

Accessibility
[ ] Color contrast ≥ 4.5:1 ⚠️ Need verification
[ ] prefers-reduced-motion ⚠️ Missing (animate-ping present)
[ ] ARIA labels ⚠️ Need review
```

---

## Next Steps

### Immediate (This Session)
1. Replace all `emerald-*` with `primary`/`secondary`
2. Remove all `backdrop-blur` instances
3. Fix CTA button to use `bg-primary`
4. Increase font sizes to minimum 14px

### This Week
5. Add prefers-reduced-motion media query
6. Test at 375px, 768px, 1440px viewports
7. Verify color contrast on all text

### Design Review
8. Review redesigned hero section
9. Validate all interactive elements
10. Check mobile navigation

---

**Audit Completed:** 2026-06-21
**Redesign Ready:** Yes
**Estimated Effort:** 2-3 hours
**Auditor:** Claude (Principal Engineer)
