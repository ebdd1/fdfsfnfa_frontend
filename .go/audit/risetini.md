# Project audit: KostFind Web (Frontend)

Generated: 2026-07-04T00:12:00Z
Path: /root/KostFind/stitch_kostfind_real_time_property_platform/kostfind_web
Auditor: gorisetini v2

---

## Executive summary

KostFind Web adalah React 19 SPA dengan TypeScript dan Vite, menggunakan Zustand untuk state management dan TanStack React Query untuk server state. Project menunjukkan architecture yang solid dengan code splitting, security headers, dan offline support. Namun ada beberapa area yang perlu perhatian segera: tidak ada test coverage, beberapa lint errors, accessibility issues (aria-label missing), dan HIGH vulnerability di `ws` package. Tech debt terlihat di 3 komponen yang sangat besar (400-1100 lines) yang perlu dipecah.

---

## Tech stack

| Category   | Technology         | Version  | Notes                                    |
|------------|-------------------|----------|------------------------------------------|
| Framework  | React             | 19.2.6   | SPA, bukan Next.js                       |
| Language   | TypeScript        | ~6.0.2   | Target ES2023                            |
| Build      | Vite              | 8.x      | Dev server + bundler                      |
| Routing    | React Router DOM  | 7.17.0   | Client-side routing dengan React.lazy     |
| State      | Zustand           | 5.0.14   | Global state (auth, settings, toasts)    |
| Server State | TanStack Query  | 5.101.0  | Caching, mutations                       |
| Styling    | Tailwind CSS      | 4.3.1    | Design system dengan brand colors        |
| Animation  | Framer Motion     | 12.42.2  | Page transitions, modals                 |
| Maps       | Mapbox GL + Leaflet | various | Property location visualization          |
| HTTP       | Axios             | 1.17.0   | API client dengan interceptors            |
| Real-time  | Socket.IO Client  | 4.8.3    | Chat, notifications, presence            |
| Validation | Zod               | 4.4.3    | Schema validation                         |
| Icons      | Lucide React      | 1.18.0   | Icon library                             |
| Deployment | Vercel            | -        | vercel.json configured                   |
| Analytics  | Vercel Analytics  | latest   | Speed & visitor insights                 |

---

## Struktur

Directory tree (3 level max, exclude node_modules/dist/.git):

```
/src
├── main.tsx              # Entry point
├── App.tsx               # Root component, routing, code-splitting
├── index.css             # Global styles, CSS variables, focus styles
├── assets/
├── components/           # 49 TSX files
│   ├── admin/            # Admin dashboard components
│   ├── dashboard/        # Dashboard components
│   ├── landing/          # Landing page sections
│   ├── Navbar.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── SearchPage.tsx
│   ├── DetailPage.tsx
│   ├── MapView.tsx
│   ├── MapboxMapView.tsx (1017 lines!)
│   └── ...
├── pages/                # Page containers (5 TSX files)
├── hooks/                # Custom hooks (12 files)
│   ├── useSession.ts
│   ├── useProperties.ts
│   ├── useOrders.ts
│   ├── useConversations.ts
│   ├── useRealtime.ts
│   ├── useNotifications.ts
│   ├── useWatchlist.ts
│   └── ...
├── services/
│   ├── api/              # API services (11 files)
│   │   ├── axios.ts      # Base config, interceptors, auth
│   │   ├── auth.service.ts
│   │   ├── property.service.ts
│   │   ├── order.service.ts
│   │   ├── conversation.service.ts
│   │   ├── notification.service.ts
│   │   ├── watchlist.service.ts
│   │   ├── settings.service.ts
│   │   ├── admin.service.ts
│   │   ├── owner.service.ts
│   │   └── upload.service.ts
│   ├── socket.ts         # Socket.IO client
│   ├── geolocation.service.ts
│   └── offlineQueue.ts    # IndexedDB offline support
├── stores/               # Zustand stores (4 files)
│   ├── authStore.ts
│   ├── settingsStore.ts
│   ├── toastStore.ts
│   └── connectionStore.ts
├── types/
│   └── index.ts
├── lib/
│   ├── passwordPolicy.ts
│   └── securityLogger.ts
└── config/
    └── brandColors.ts
```

Entry points:
- `/src/main.tsx` - React app bootstrap
- `/src/App.tsx` - Router configuration + code splitting

Pattern: Feature-based dengan service layer (API services terpisah dari UI components)

Naming: camelCase untuk files dan functions

File counts:
- Components (TSX): 49
- Services (TS): 14
- Hooks (TS): 12
- Stores (TS): 4
- Types (TS): 1
- Total source files: ~84

---

## Database

**Frontend-only project** - tidak ada database langsung. Data dari backend API.

Backend inference (dari API services):
- PostgreSQL di Railway (api-production-fafbf.up.railway.app)
- Schema tidak tersedia di project ini

---

## API

Route count: ~40+ endpoints (dari 11 service files)

Auth method: Bearer JWT token
- Token di localStorage via authStore
- Axios interceptor menambahkan `Authorization: Bearer <token>`
- Auto-logout pada 401 response

Response format: JSON

**API Services Summary:**

| Service | Endpoints | Methods |
|---------|-----------|---------|
| auth.service | 5 | login, register, getMe, logout, updateMe |
| property.service | 9+ | getAll, getById, create, addMedia, getRooms, addRooms, deleteRoom, deleteProperty, deletePropertiesBulk |
| order.service | 11 | create, mine, accept, reject, submitPayment, confirmPayment, rejectPayment, cancel, complete, all |
| conversation.service | 6 | getMyConversations, create, getMessages, sendMessage, markRead, markMessageAsRead |
| notification.service | 3 | mine, markRead, markAllRead |
| watchlist.service | 3 | getBySeeker, add, remove |
| admin.service | 10+ | listUsers, updateUser, listListings, updateListing, getStats, listConversations, getConversationMessages, all orders/settings |
| settings.service | 3 | getPublic, getAdminAll, update |
| upload.service | 1 | uploadImage |
| owner.service | 1 | updateRoomStatus |

**Real-time:** Socket.IO untuk chat, typing indicators, presence, notifications push

---

## Testing

Framework: **NONE** - Tidak ada test framework dikonfigurasi
Test files: **0** - Tidak ada test files di project
Coverage: **tidak terukur** - Tidak bisa diukur karena tidak ada test runner

**Dependencies untuk test yang tersedia (tidak dikonfigurasi):**
- `@testing-library/react` - tidak terinstall
- `vitest` atau `jest` - tidak terinstall

**ASSUMPTION:**
- Testing tidak dilakukan sama sekali di project ini
- Rekomendasi: Setup Vitest + React Testing Library untuk unit tests

---

## Infrastructure

CI/CD: **NOT FOUND**
- Tidak ada `.github/workflows/`
- Tidak ada GitLab CI, Jenkins, CircleCI

Docker: **NOT FOUND**
- Tidak ada Dockerfile
- Tidak ada docker-compose.yml

Deployment target: **Vercel**
- Build command: `npm run build`
- Output directory: `dist`
- Framework detection: vite

Environment:
- `.env.example`: **TIDAK ADA** - tidak ada template untuk env vars
- `.env` ada dengan VITE_API_URL dan VITE_MAPBOX_TOKEN
- `.env` di-.gitignore (OK)

Health check: tidak ada dedicated endpoint (SPA)

---

## Security posture

**Findings:**

### [HIGH] ws package DoS vulnerability
- Evidence: `npm audit` output menunjukkan `ws 8.0.0 - 8.20.1` dengan High severity
- Impact: Memory exhaustion DoS via tiny fragments
- Cause: `engine.io-client` tergantung pada `ws` versi rentan
- Recommended: `/gowork --fix` - jalankan `npm audit fix`

### [LOW] Hardcoded Team/Project IDs
- File: `/vercel-doctor.js:5-6`
- Evidence: `TEAM_ID` dan `PROJECT_ID` hardcoded
- Impact: Low - ini infrastructure IDs, bukan secrets
- Recommended: /gowork --fix jika ingin dynamis

### [INFO] Local .env files dengan OIDC tokens
- Files: `.env.local`, `.env.production`
- Evidence: Vercel CLI created tokens
- Impact: Tokens tidak di-track git (aman), tapi perlu rotation periodik
- Recommended: Monitor dan rotate secara berkala

### [PASS] .gitignore configured
- `.env` dan `.env*` sudah di-.gitignore

### [PASS] Security headers
- vercel.json dengan CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy

### [PASS] No XSS vectors
- Tidak ada `eval()`, `innerHTML`, `dangerouslySetInnerHTML` usage

### [PASS] Axios interceptors
- Bearer token di setiap request
- Auto-logout pada 401

---

## Code quality

Linting: **ESLint configured** (53 errors ditemukan)
- Tool: @eslint/js + typescript-eslint + react-hooks
- Scripts: `npm run lint`

Type safety: **PARTIAL**
- tsconfig: `verbatimModuleSyntax`, `noUnusedLocals`, `noUnusedParameters` enabled
- **MISSING: `strict: true`** - strictNullChecks dan noImplicitAny tidak aktif

Prettier: **NOT FOUND** - tidak ada prettier config

TODO/FIXME count: **0** - codebase bersih dari markers

Files > 500 lines: **8 files**
| File | Lines |
|------|-------|
| AdminDashboardPage.tsx | 1161 |
| UserDashboardPage.tsx | 1105 |
| MapboxMapView.tsx | 1017 |
| DashboardPage.tsx | 774 |
| LandingPage.tsx | 527 |
| AddPropertyModal.tsx | 523 |
| AdminSettingsPanel.tsx | 522 |
| InboxPage.tsx | 510 |

Methods > 100 lines: **7 functions/components**
| File | Component | Lines |
|------|-----------|-------|
| UserDashboardPage.tsx | UserDashboardPage | 1081 |
| AdminDashboardPage.tsx | AdminDashboardPage | 402 |
| MapboxMapView.tsx | MapboxMapView | 540 |
| AdminDashboardPage.tsx | OverviewSection | 141 |
| AdminDashboardPage.tsx | UsersSection | 205 |
| MapboxMapView.tsx | LayerPanel | 203 |
| AdminDashboardPage.tsx | VerifySection | 117 |

**Findings:**

### [HIGH] 3 oversized components perlu dipecah
- File: `UserDashboardPage.tsx` (1105 lines), `AdminDashboardPage.tsx` (1161 lines), `MapboxMapView.tsx` (1017 lines)
- Issue: Single component dengan banyak responsibilities
- Impact: Hard untuk maintain, test, dan understand
- Recommended: /gowork --refactor untuk extract sub-components

### [MEDIUM] 53 ESLint errors perlu fix
- Location: Multiple files
- Issues: `set-state-in-effect` warnings, impure function calls (Date.now() in render)
- Impact: Potential bugs dan code smells
- Recommended: /gopolish phase 5a - fix lint errors

### [MEDIUM] Missing `strict: true` di tsconfig
- File: `tsconfig.app.json`
- Impact: Type safety tidak maksimal, runtime errors potensial
- Recommended: /gopolish phase 5a - enable strict mode

### [LOW] No Prettier configuration
- Impact: Formatting inconsistency possible
- Recommended: /gopolish phase 5a - add Prettier dengan eslint-config-prettier

### [GOOD] No lodash imports
- Tree-shaking effective, bundle clean

### [GOOD] Code splitting implemented
- React.lazy() untuk semua page components
- Vite manual chunking di vite.config.ts

---

## Accessibility

Frontend framework: **React 19**

**Findings:**

### [CRITICAL] Icon-only buttons missing aria-label
- Location: LandingPage.tsx (lines 208, 302, 438), Navbar.tsx (lines 233-242, 121)
- Issue: Icon buttons tidak accessible untuk screen reader
- Impact: Blind users tidak bisa understand button purpose
- Recommended: /gopolish phase 5d - add aria-label ke semua icon buttons

### [HIGH] Form inputs menggunakan outline-none
- Location: LoginPage.tsx (134, 160), RegisterPage.tsx (183, 202, 221, 241), LandingPage.tsx (172)
- Issue: focus:outline-none menghilangkan browser focus indicator
- Impact: Keyboard users kehilangan visual focus feedback
- Recommended: /gopolish phase 5d - replace outline-none dengan visible focus ring

### [HIGH] Error messages missing aria-describedby
- Location: LoginPage.tsx (106-115)
- Issue: Error messages tidak linked ke inputs
- Impact: Screen reader tidak announce errors
- Recommended: /gopolish phase 5d - add aria-describedby dan aria-invalid

### [MEDIUM] Warning color fails contrast
- Location: tailwind.config.js - `#f59e0b` (amber)
- Issue: Contrast ratio 1.9:1 dengan white background (target min 3:1)
- Impact: Low vision users tidak bisa baca warning text
- Recommended: /gopolish phase 5d - adjust warning color

### [MEDIUM] Missing skip-to-content link
- Location: Global
- Issue: Keyboard users harus tab lewat semua nav items
- Recommended: /gopolish phase 5d - add skip link

### [MEDIUM] Search labels tidak associated
- Location: LandingPage.tsx (170, 187, 198)
- Issue: Labels ada tapi tidak programmatically connected via htmlFor/id
- Recommended: /gopolish phase 5d - add htmlFor/id associations

### [LOW] Role toggle missing aria-pressed
- Location: RegisterPage.tsx (146-168)
- Issue: aria-pressed untuk indicate active state
- Recommended: /gopolish phase 5d - add aria-pressed

### [GOOD] Proper landmark usage
- header, main, nav, footer properly used

### [GOOD] Heading hierarchy mostly correct
- h1 → h2 → h3 structure maintained

### [GOOD] Color contrast untuk primary colors
- Primary (#003594) on white: 9.0:1 - PASS WCAG AA

### [GOOD] Reduced motion support
- prefers-reduced-motion respected di index.css

---

## Bundle size + performance

Total dist folder: **2.9M**

**Largest bundles:**
| Bundle | Size |
|--------|------|
| DashboardPage | 92K |
| AdminDashboardPage | 83K |
| UserDashboardPage | 69K |
| authStore | 43K |
| SearchPageContainer | 32K |
| LandingPageContainer | 22K |

**Largest dependencies:**
- mapbox-gl: ~500KB+
- framer-motion
- react-map-gl
- socket.io-client
- leaflet

Tree-shaking: **EFFECTIVE**
- No lodash imports found
- No namespace imports (import * as) found

Code splitting: **GOOD**
- React.lazy() implemented untuk semua pages
- Vite manual chunking untuk vendor bundles

**Findings:**

### [HIGH] Mapbox bundle sangat besar
- File: `MapboxMapView.tsx` (1017 lines, 540 line component)
- Issue: Mapbox GL ~500KB sendiri
- Impact: Initial load lambat di mobile
- Recommended: Lazy load map hanya saat needed, use dynamic import

### [MEDIUM] Dashboard bundles > 60K
- Files: DashboardPage (92K), AdminDashboardPage (83K)
- Issue: Bundle size untuk dashboard pages
- Recommended: Analyze apakah semua dependency necessary, consider tree-shake

### [MEDIUM] authStore di separate chunk (43K)
- Issue: Auth store seharusnya kecil
- Possible cause: Unnecessary dependencies imported
- Recommended: /gopolish phase 5h - audit store dependencies

---

## Prioritized action plan

### Kritis (harus segera)

1. **[HIGH] ws DoS vulnerability** → `/gowork --fix` - jalankan `npm audit fix`
2. **[CRITICAL] Icon buttons tanpa aria-label** → `/gopolish phase 5d` - accessibility audit fix

### Penting (minggu ini)

3. **[HIGH] Oversized components (3 files > 1000 lines)** → `/gowork --refactor` - split menjadi sub-components
4. **[HIGH] Focus outline-none issue** → `/gopolish phase 5d` - replace dengan visible focus ring
5. **[MEDIUM] Error messages missing aria-describedby** → `/gopolish phase 5d` - add accessibility attributes
6. **[MEDIUM] 53 ESLint errors** → `/gopolish phase 5a` - fix all lint errors
7. **[MEDIUM] Warning color contrast fail** → `/gopolish phase 5d` - adjust color palette

### Perlu perhatian (bulan ini)

8. **[MEDIUM] Missing `strict: true`** → `/gopolish phase 5a` - enable TypeScript strict mode
9. **[MEDIUM] Missing skip-to-content link** → `/gopolish phase 5d` - add skip navigation
10. **[MEDIUM] No Prettier config** → `/gopolish phase 5a` - add Prettier integration
11. **[MEDIUM] Mapbox lazy loading** → `/gopolish phase 5h` - optimize bundle
12. **[MEDIUM] Search labels tidak associated** → `/gopolish phase 5d` - fix label/input associations

### Nice to have (nanti)

13. **[LOW] Dashboard bundle optimization** → `/gopolish phase 5h` - audit dependencies
14. **[LOW] No .env.example** → `/gopolish phase 5a` - create env template
15. **[LOW] No CI/CD pipeline** → `/goarch` - setup GitHub Actions

---

## Rekomendasi skill sequence

Berdasarkan audit ini, urutan skill yang optimal:

1. **`/gowork --fix`** - Fix `ws` vulnerability (HIGH priority, 5 menit)
2. **`/gopolish phase 5d`** - Accessibility fixes (aria-labels, focus styles, contrast) - HIGH priority
3. **`/gopolish phase 5a`** - TypeScript strict mode + ESLint fixes (MEDIUM priority)
4. **`/gowork --refactor`** - Split oversized components (HIGH priority, 1-2 hari)
5. **`/gopolish phase 5h`** - Bundle optimization untuk Mapbox (MEDIUM priority)
6. **`/goarch`** - Setup CI/CD pipeline (LOW priority)

---

## ASSUMPTION

- **Testing**: Coverage tidak terukur karena tidak ada test framework. Rekomendasi: setup Vitest sebelum /gowork --refactor agar bisa refactor dengan confidence.
- **Backend schema**: Schema tidak available di project ini, hanya inferred dari API services.
- **Bundle sizes**: Measured dari dist folder, bukan gzipped. Actual network transfer lebih kecil.
- **Lighthouse scores**: Tidak diukur, perlu `/browse` atau `/lighthouse` audit untuk actual performance metrics.
