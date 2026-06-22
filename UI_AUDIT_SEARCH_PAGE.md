# Search Page — UI/UX Audit Report
**Date:** 2026-06-21
**Skill Used:** ui-ux-pro-max v2.5.0
**File Audited:** `src/components/SearchPage.tsx` (419 lines)
**Container:** `src/pages/SearchPageContainer.tsx`
**Reference:** `design-system/MASTER.md`

---

## Executive Summary

```
OVERALL GRADE: B+ — Good Foundation, Enhancement Opportunities

✓ Strengths:
  - Clean 3-column layout (filters | results | map)
  - Good hover states dengan card lift effect
  - Empty state designed (no dead end)
  - Map simulation adds visual interest
  - Filter pills dengan toggle
  - Responsive mobile-first dengan drawer filter
  - Watchlist toggle dengan heart icon

⚠️ Issues Found:
  - Brand colors: emerald vs primary (#004ac6) — 20+ violations
  - Glassmorphism: backdrop-blur used (prohibited by MASTER.md)
  - Font sizes: many 10px instances below minimum
  - Missing autocomplete (ux-guidelines)
  - Map is fake/mock (no real geolocation)
  - No sorting options (price, newest, rating)
  - No pagination (all results loaded at once)
  - Filter sidebar tidak show active filter count
```

---

## Detailed Findings

### Category 1: Brand Colors Compliance

| Status | ❌ NON-COMPLIANT |
|--------|------------------|

**Issue:** Uses `emerald-*` instead of brand primary/secondary.

**Evidence:**

| Line | Current | Should Be |
|------|---------|-----------|
| 51 | `bg-emerald-600` | `bg-primary` |
| 88 | `bg-emerald-50 text-emerald-600` | `bg-primary/10 text-primary` |
| 110 | `focus:ring-emerald-500` | `focus:ring-primary` |
| 125 | `focus:ring-emerald-500` | `focus:ring-primary` |
| 145 | `accent-emerald-600` | `accent-primary` |
| 149 | `text-emerald-700 bg-emerald-50` | `text-primary bg-primary/10` |
| 166 | `border-emerald-500 bg-emerald-50/50 text-emerald-800` | brand colors |
| 250 | `border-emerald-500` | `border-primary` |
| 265 | `bg-emerald-400` | `bg-secondary` |
| 266 | `bg-emerald-500` | `bg-secondary` |
| 278 | `backdrop-blur-sm` | (remove glassmorphism) |
| 286 | `bg-emerald-800` | `text-secondary` |
| 298 | `bg-emerald-50 text-emerald-800` | brand colors |
| 321 | `text-emerald-600 bg-emerald-50` | brand colors |
| 332 | `text-emerald-600` | `text-secondary` |
| 350 | `backdrop-blur-md` | (remove glassmorphism) |
| 352 | `text-emerald-600` | `text-primary` |
| 373 | `bg-emerald-600 ring-emerald-500` | brand colors |
| 393 | `border-emerald-500 ring-emerald-500` | brand colors |
| 404 | `bg-emerald-600 text-emerald-700` | brand colors |

---

### Category 2: Anti-Patterns — Glassmorphism

| Status | ❌ NON-COMPLIANT |
|--------|------------------|

**Evidence:**

| Line | Code | Issue |
|------|------|-------|
| 73 | `backdrop-blur-sm` | Mobile filter backdrop |
| 278 | `backdrop-blur-sm` | Watchlist button |
| 285 | `backdrop-blur-sm` | Available count label |
| 350 | `backdrop-blur-md` | Map header box |
| 392 | `backdrop-blur-sm` | Properties overlay |

---

### Category 3: Typography — Font Size Violations

| Status | ❌ NON-COMPLIANT |
|--------|------------------|

| Line | Element | Size | Should Be |
|------|---------|------|-----------|
| 93 | Subtitle | 10px | 14px |
| 106 | Label | 12px | 14px |
| 110 | Select text | 12px | 14px |
| 121 | Label | 12px | 14px |
| 147 | Price labels | 10px | 14px |
| 149 | Max price badge | 10px | 14px |
| 156 | Label | 12px | 14px |
| 164 | Facility pills | 11px | 14px |
| 184 | Reset button | 12px | 14px |
| 214 | Results count | 12px | 14px |
| 226 | Empty state | 12px | 14px |
| 263 | Badge text | 10px | 14px |
| 268 | Badge label | 10px | 14px |
| 285 | Availability | 10px | 14px |
| 296 | Type badge | 10px | 14px |
| 316 | Facility tags | 10px | 14px |
| 321 | "Lainnya" badge | 10px | 14px |
| 351 | Map label | 10px | 14px |
| 371 | Map pin price | 10px | 14px |
| 401 | Map list address | 10px | 14px |

---

### Category 4: UX Enhancement Opportunities

Based on ui-ux-pro-max guidelines:

#### 4.1 Missing: Autocomplete Search

| Status | ❌ MISSING |
|--------|------------|

**Issue:** No autocomplete suggestions as user types.

**UX Guideline (ux-guidelines.csv):**
```
Issue: Autocomplete
Description: Help users find results faster
Do: Show predictions as user types
Severity: Medium
```

**Current:** User must type full query and wait.

**Recommendation:**
```tsx
// Add debounced autocomplete dropdown
const [suggestions, setSuggestions] = useState<string[]>([]);

<input onChange={handleSearch} />
{suggestions.length > 0 && (
  <ul className="absolute z-50 bg-white rounded-xl shadow-lg border...">
    {suggestions.map(s => <li key={s}>{s}</li>)}
  </ul>
)}
```

#### 4.2 Missing: Sorting Options

| Status | ❌ MISSING |
|--------|------------|

**Issue:** No way to sort results (price low-high, newest, rating).

**Current:** Results appear in arbitrary order.

**Recommendation:**
```tsx
<select onChange={(e) => setSortBy(e.target.value)}>
  <option value="relevance">TerRelevan</option>
  <option value="price_asc">Harga: Rendah ke Tinggi</option>
  <option value="price_desc">Harga: Tinggi ke Rendah</option>
  <option value="newest">Terbaru</option>
</select>
```

#### 4.3 Missing: Pagination

| Status | ⚠️ PARTIAL |
|--------|------------|

**Issue:** All results loaded at once — could be slow with 100+ listings.

**Current:** `filteredProperties.map(...)` renders all.

**Recommendation:**
```tsx
// Virtual scrolling or "Load More" button
const [visibleCount, setVisibleCount] = useState(12);

{filteredProperties.slice(0, visibleCount).map(...)}
{visibleCount < filteredProperties.length && (
  <button onClick={() => setVisibleCount(c => c + 12)}>
    Lihat {filteredProperties.length - visibleCount} lagi
  </button>
)}
```

#### 4.4 Missing: Active Filter Count Badge

| Status | ❌ MISSING |
|--------|------------|

**Issue:** Filter button doesn't show number of active filters.

**Current:** User must mentally track active filters.

**Recommendation:**
```tsx
<button className="relative ...">
  <SlidersHorizontal />
  {activeFilterCount > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full text-xs">
      {activeFilterCount}
    </span>
  )}
</button>
```

#### 4.5 Map: Fake/Placeholder

| Status | ⚠️ DESIGN ISSUE |
|--------|------------------|

**Issue:** Map uses static Unsplash image + mock pin positions, not real geolocation.

**Current:**
```tsx
pinPositions: Record<string, { top: string; left: string }> = {
  'p1': { top: '30%', left: '40%' }, // Hardcoded fake positions
}
bg-[url('https://images.unsplash.com/...')] // Static image
```

**Recommendation Options:**
1. **Remove map entirely** — focus on card grid
2. **Integrate real map** — Google Maps / Mapbox with actual coordinates
3. **Keep as "Simulated"** with clear label that it's not real

**Decision needed:** Depends on business requirements.

---

### Category 5: Accessibility

| Status | ⚠️ MOSTLY COMPLIANT |
|--------|---------------------|

| Check | Status | Notes |
|-------|--------|-------|
| Color contrast ≥ 4.5:1 | ⚠️ PARTIAL | Some 10px gray text may fail |
| Focus states | ✅ PASS | `focus:ring-4` classes |
| Alt text | ✅ PASS | Property images have alt |
| ARIA labels | ⚠️ PARTIAL | Icon buttons OK, but filter section needs role |
| Keyboard navigation | ✅ PASS | Tab order logical |
| prefers-reduced-motion | ❌ MISSING | `animate-ping` present (line 265) |

---

### Category 6: Component Audit

#### 6.1 Filter Sidebar

| Status | ✅ GOOD |
|--------|---------|

**Good:**
- Clean label hierarchy
- Range slider with price display
- Facility toggle pills
- Reset button
- Mobile drawer with backdrop

**Issues:**
- Font sizes below minimum
- Brand colors not used

#### 6.2 Property Card

| Status | ✅ GOOD |
|--------|---------|

**Good:**
- Image with aspect ratio
- Hover scale effect
- Watchlist toggle
- Price formatting with Intl
- "Sisa X Kamar" availability badge

**Issues:**
- Border radius 28px (`rounded-[28px]`) — very large, consider 16-20px
- Font sizes below minimum

#### 6.3 Map Panel

| Status | ⚠️ NEEDS DECISION |
|--------|-------------------|

**Good:**
- Airbnb-style price pins
- Hover synchronization with cards
- Overlay property list

**Issues:**
- Fake/placeholder content
- Not responsive (hidden on mobile anyway)

---

## UX Improvement Recommendations (Priority Order)

### High Priority

1. **Fix brand colors** — Replace all `emerald-*` with `primary`/`secondary`
   - Impact: Brand consistency
   - Effort: MEDIUM

2. **Fix font sizes** — Enforce minimum 14px
   - Impact: Readability
   - Effort: LOW (CSS rule)

3. **Add active filter count badge** to filter button
   - Impact: UX clarity
   - Effort: LOW

### Medium Priority

4. **Add sorting dropdown** (price, newest, relevance)
   - Impact: User control
   - Effort: LOW

5. **Add pagination or virtual scroll**
   - Impact: Performance with many results
   - Effort: MEDIUM

6. **Remove glassmorphism** — Replace with solid backgrounds
   - Impact: Performance on low-end devices
   - Effort: LOW

7. **Add autocomplete to search input**
   - Impact: Faster search (ux-guidelines)
   - Effort: MEDIUM (debounce + suggestions)

### Low Priority (Decision Needed)

8. **Map panel decision:**
   - Option A: Remove entirely
   - Option B: Implement real geolocation
   - Option C: Keep as "simulated" with clear label

---

## Pre-Delivery Checklist Compliance

| Item | Status | Notes |
|------|--------|-------|
| Hover states (200ms) | ✅ PASS | `transition-all duration-300` |
| Focus states | ✅ PASS | `focus:ring-4` |
| Contrast ≥ 4.5:1 | ⚠️ PARTIAL | 10px gray text |
| Responsive | ✅ PASS | md: lg: breakpoints |
| Loading states | ✅ PASS | Loader2 spinner |
| Error states | ✅ PASS | AlertCircle + retry |
| Empty states | ✅ PASS | "Tidak ada kost" |
| Alt text | ✅ PASS | Images have alt |
| ARIA labels | ⚠️ PARTIAL | Need role="search" |
| cursor-pointer | ✅ PASS | All buttons |
| prefers-reduced-motion | ❌ MISSING | animate-ping present |

---

## Comparison: Dashboard Home vs Search Page

| Category | Dashboard Home | Search Page |
|----------|---------------|-------------|
| Brand colors | ❌ Non-compliant | ❌ Non-compliant |
| Glassmorphism | ❌ 5 instances | ❌ 5 instances |
| Font < 14px | ❌ 25+ violations | ❌ 20+ violations |
| Layout | ✅ Good | ✅ Good |
| UX features | ⚠️ Basic | ⚠️ Missing sorting |
| Map simulation | N/A | ⚠️ Fake/placeholder |

**Verdict:** Both pages have similar compliance issues. Recommend batch fix for brand colors and font sizes.

---

## Summary Table

| Category | Grade | Findings |
|----------|-------|----------|
| Brand Colors | ❌ F | 20+ emerald violations |
| Anti-Patterns | ❌ F | 5 glassmorphism instances |
| Typography | ❌ F | 20+ font < 14px |
| UX Features | ⚠️ C | Missing sort, autocomplete |
| Accessibility | ⚠️ B | Mostly OK, needs prefers-reduced |
| Layout | ✅ A | Clean 3-column responsive |
| Components | ✅ B+ | Good card design |

**OVERALL: B+** — Strong layout and component design, needs brand compliance and UX enhancements.

---

## Action Plan

### Immediate (This Session)

1. Fix brand colors in SearchPage.tsx
2. Fix font sizes (minimum 14px)
3. Remove glassmorphism (backdrop-blur)
4. Add active filter count badge

### This Week

5. Add sorting dropdown
6. Add prefers-reduced-motion support
7. Consider pagination for large result sets

### Decision Needed

8. Map panel: remove, real implement, or keep as simulated?

---

**Audit Completed:** 2026-06-21
**Next Steps:** Implement fixes or audit other pages
**Auditor:** Claude (Principal Engineer)
