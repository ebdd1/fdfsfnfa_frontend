# User Dashboard Mobile Viewport Design Guide

Specific UI/UX overrides for the pencari/seeker dashboard on mobile devices.

## 📱 Viewport & Layout Hierarchy

- **Mobile Viewport Target**: Optimized for 375px - 480px width range.
- **Root Layout**: Grid or flex container must transition from `flex flex-col` on mobile to `md:flex-row` on tablet/desktop.
- **Bottom Navigation Bar**:
  - Visible only on `< 768px` (`md:hidden`).
  - Position: `fixed bottom-0 left-0 right-0 z-30`.
  - Background: `bg-white shadow-lg` with `pb-[env(safe-area-inset-bottom)]` to support notch padding.
  - No backdrop blur (glassmorphism) allowed to preserve mobile GPU/battery.
  - Touch Target: Each button must span `flex-1` with padding to ensure a minimum interactive target of `48px x 48px`.

## 🎨 Spacing & Colors

- **Paddings**:
  - Section Wrapper: `px-4 pt-4 pb-20` (additional bottom padding to prevent nav overlap).
  - Cards (greeting, stats, agreements): `p-4 sm:p-5` instead of desktop `p-6`.
- **Primary Color Fallback**: Use Tailwind variables (`[var(--primary-600)]`) to coordinate with dynamic primary color set in backend. Ensure no trailing double brackets (`]]`) remain.
- **Verified Badges**:
  - Background must be solid `bg-white px-2 py-0.5 shadow-sm` instead of transparent backdrop blur.

## 🔠 Typography & Readability (Indonesia Focus)

- **Minimum Font Size**: Core readable text must not drop below 14px (`text-sm`).
- **Exceptions**: Minor metadata, timestamps, and tiny status pills can use 12px (`text-xs font-semibold`). Absolutely no font sizes smaller than 12px (`text-[9px]`, `text-[10px]`, `text-[11px]`).
- **Heading Line Heights**: Headings (`h1`, `h2`) on mobile must use `leading-tight` or `leading-snug` to prevent wrapping conflicts with long Indonesian words.

## ♿ Accessibility (A11y) & Performance

- **Reduce Motion**: Media query checks for `prefers-reduced-motion` must be respected in transitions (e.g. drawer and notification sheets).
- **ARIA Attributes**: Icon buttons on mobile (e.g., Hamburger `Menu`, `Search`, `MessageSquare`, and `Bell` trigger) must include descriptive `aria-label` tags.
