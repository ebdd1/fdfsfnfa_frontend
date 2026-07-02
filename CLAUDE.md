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

### MGRCAO Framework (WAJIB DIIKUTI)
Setiap tugas pengembangan WAJIB mengikuti alur **MGRCAO** (7-Phase: Architecture Analysis, Dependency Mapping, Risk Assessment, Implementation Plan, Code Generation, Review, Optimization). Setiap output wajib menyertakan Output Contract (Analisis Arsitektur, Analisis Dependensi, Review Keamanan, Rencana Implementasi, Kode Hasil, Self Review, QA Checklist).

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

## 🛠️ Skill-Based Workflow

Setiap fase development punya skill yang tepat. Ikuti alur ini agar kerja terstruktur.

### Fase 1: Awal Sprint / Minggu Baru
```
/retro
```
→ Retrospective mingguan: apa berhasil, apa gagal, next week prioritas. Prevent autopilot mode.

---

### Fase 2: Mau Bangun Fitur Baru
```
/office-hours        → Challenge premise, get perspective
/spec                → Convert vague intent ke precise spec
/autoplan            → CEO + design + eng review sekaligus
```
→ Standard planning flow. `/office-hours` nge-challenge — bisa jadi fitur yang dipikir perlu ternyata nggak solve user problem.

---

### Fase 3: Coding / Implementasi
**Frontend React:**
```
/react-expert
```
→ Stuck di hooks, state management, performance optimization.

**Fitur fullstack (frontend + backend):**
```
/fullstack-guardian
```
→ Payment method baru, booking flow baru, role permissions baru.

**Real-time features (Socket.IO):**
```
/websocket-engineer
```
→ Push notification, booking status real-time.

---

### Fase 4: Review & Polish
**Sebelum push/deploy:**
```
/review
```
→ PR diff review: bugs, security, code smells, N+1.

**Visual polish:**
```
/design-review
```
→ Spacing, hierarchy, AI slop patterns, brand color consistency.

**Deep code audit:**
```
/code-reviewer
```

---

### Fase 5: Security (Periodic)
**Quarterly audit:**
```
/security-reviewer
```
→ Full SAST, pentest, compliance.

**Quick OWASP check:**
```
/owasp-security-check
```
→ Anteseden ke security-reviewer, atau sebelum deploy.

---

### Fase 6: QA & Testing
**Full QA + bug fix:**
```
/qa
```
→ Systematic test, reproduce bugs, fix found bugs.

**Screenshot/verify render:**
```
/browse <url>
```
→ Landing page consistency, mobile viewport testing.

**Investigate bug:**
```
/investigate
```
→ Root cause analysis, log tracing.

---

### Fase 7: Deploy
**Ship workflow:**
```
/land-and-deploy
```
→ Detect base branch, run tests, review diff, commit, push, create PR.

**Post-deploy monitoring:**
```
/canary
```
→ Error rates, performance regression.

---

### Fase 8: Context & Docs
**Save progress:**
```
/context-save
```
→ Mau stop session, context survive.

**Store insight:**
```
/learn
```
→ "Mapbox bounds bug lesson", "OWASP findings", etc.

**Generate docs:**
```
/document-generate
```

---

### Alur Visual

```
SPRINT START
/retro
    │
    ▼
PLANNING (fitur baru?)
/office-hours → /spec → /autoplan
    │
    ▼
IMPLEMENTASI
/react-expert | /fullstack-guardian | /websocket-engineer
    │
    ▼
REVIEW & POLISH
/review → /design-review → /code-reviewer
    │
    ▼
SECURITY (periodic)
/security-reviewer → /owasp-security-check
    │
    ▼
QA & DEPLOY
/qa → /browse → /land-and-deploy → /canary
    │
    ▼
CONTEXT & DOCS
/context-save | /learn | /document-generate
```

---

### Prioritas Sekarang (2026-06-24)
Berdasarkan mobile polish sprint:
1. `/design-review` — review landing page + dashboard yang baru di-poles
2. `/qa` — test mobile viewport flows (375px, 768px)
3. `/browse` — screenshot verify landing page rendering
4. `/investigate` — kalau ada bug yang belum fixed

---

## 📝 Git Workflow

- Branch: `main`
- Deploy: Auto via Vercel (frontend) + Railway (backend)
- Commit style: `feat:`, `fix:`, `perf:`, `debug:`

---

**Maintained by:** Development Team
**Last Updated:** 2026-06-24
