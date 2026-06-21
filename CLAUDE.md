# KostFind — Project Instructions for Claude Code

## 📁 Project Structure

```
kostfind_web/
├── src/
│   ├── components/        # React components
│   ├── pages/             # Page containers
│   ├── services/          # API & Socket.IO services
│   ├── hooks/             # Custom React hooks
│   ├── stores/            # Zustand state management
│   └── types/             # TypeScript types
├── design-system/         # Design system documentation
│   ├── MASTER.md          # Main design system
│   └── pages/             # Page-specific overrides
└── .claude/
    └── skills/
        └── ui-ux-pro-max/ # UI/UX Pro Max Skill
```

---

## 🎨 Design System

**SEBELUM membangun atau mengubah UI apapun:**

1. **Baca `design-system/MASTER.md`** untuk colors, typography, spacing, components
2. **Cek `design-system/pages/[page-name].md`** untuk override halaman spesifik
3. **Jika ada konflik:** Prioritaskan page-specific override di atas MASTER

**Stack:**
- React 19 + TypeScript
- Tailwind CSS 4.3.1 (NO inline styles)
- Lucide React untuk icons (NO emoji sebagai icon)
- Framer Motion untuk animation (optional)

---

## 🎨 Brand Colors (WAJIB DIPAKAI)

```css
Primary:   #004ac6  /* Blue Trust — CTA, links, active states */
Secondary: #006c49  /* Green Safe — success, verified badges */
Warning:   #f59e0b  /* Amber — attention, pending */
Danger:    #ba1a1a  /* Red — errors, destructive actions */
```

**Jangan ganti warna ini tanpa persetujuan eksplisit!**

---

## ✅ Pre-Delivery Checklist (Setiap Komponen UI)

Sebelum consider komponen "done":

- [ ] Hover states implemented (transition 200ms)
- [ ] Focus states visible (ring-2 ring-primary)
- [ ] Contrast ratio ≥ 4.5:1 untuk text
- [ ] Responsive tested: 375px, 768px, 1440px
- [ ] Loading states designed
- [ ] Error states designed
- [ ] Empty states designed
- [ ] No console errors/warnings
- [ ] Alt text untuk images
- [ ] ARIA labels untuk icon-only buttons
- [ ] `cursor-pointer` pada clickable elements
- [ ] Respects `prefers-reduced-motion`

---

## 🚫 Anti-Patterns (AVOID)

❌ **Glassmorphism** — Performance issue + accessibility issue  
❌ **Purple gradients** — Bukan brand KostFind  
❌ **Over-animation** — Keep subtle  
❌ **Emoji sebagai icon** — Use Lucide React  
❌ **Font < 14px** — Readability issue untuk Bahasa Indonesia  

---

## 🔧 Development Workflow

### Saat Build UI Baru

```
Prompt pattern yang benar:
"Saya sedang membangun [Nama Halaman] untuk KostFind.
Baca design-system/MASTER.md.
Cek juga design-system/pages/[page-name].md jika ada.
Sekarang, buatkan [deskripsi UI]..."
```

### Stack Reminder

**Always specify stack explicitly:**
"Build using React 19 + TypeScript + Tailwind"

Jangan biarkan default ke HTML+Tailwind biasa.

---

## 🔐 Security Notes

**Halaman Auth (Login/Register):**
- Visual trust perception penting (lihat `design-system/pages/auth.md`)
- Backend security: bcrypt, JWT, CSRF, HTTPS (lihat audit OWASP)

**Chat/Realtime:**
- JWT auth di Socket.IO handshake (sudah implemented)
- Server-side user ID validation (jangan trust client)

---

## 📱 Responsive Breakpoints

```
sm:  640px   (landscape phones)
md:  768px   (tablets)
lg:  1024px  (desktops)
xl:  1280px  (large desktops)
2xl: 1536px  (extra large)
```

**Test viewports:** 375px (mobile), 768px (tablet), 1440px (desktop)

---

## 🛠️ Available Skills

- `ui-ux-pro-max` — Design system & UI reasoning
- Use via: `/ui` or natural language request for UI components

---

## 📝 Git Workflow

- Branch: `main`
- Deploy: Auto via Vercel (frontend) + Railway (backend)
- Commit style: `feat:`, `fix:`, `perf:`, `debug:`

---

**Maintained by:** Development Team  
**Last Updated:** 2026-06-21
