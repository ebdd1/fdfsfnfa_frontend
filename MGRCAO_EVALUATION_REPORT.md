# KostFind — MGRCAO Production Readiness Report

**Evaluasi:** 2026-06-23  
**Auditor:** Principal Engineer  
**Target:** 10K registered user, production-ready  

---

## Executive Summary

```
╔═══════════════════════════════════════════════════════════════════╗
║                    KOSTFIND EVALUATION RESULTS                     ║
╠═══════════════════════════════════════════════════════════════════╣
║  UI/UX Weight        : ❌ BERAT    — Optimization needed         ║
║  Backend 10K         : ⚠️ FIXABLE  — Ready with fixes            ║
║  Rendering Strategy  : ❌ MIGRATE  — SEO blind spot critical     ║
╠═══════════════════════════════════════════════════════════════════╣
║  Overall Grade       : ⚠️ B-        (with fixes: B+)           ║
║  Production Ready    : ❌ 3-4 weeks estimated to readiness      ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 1. UI/UX Weight Analysis

### Bundle Size Assessment

| Component | Status | Impact |
|-----------|--------|--------|
| **mapbox-gl** | ❌ ~500KB+ upfront | HIGH |
| **framer-motion** | ⚠️ Full import | MEDIUM |
| **leaflet + CSS** | ❌ CSS upfront | MEDIUM |
| **Code Splitting** | ❌ NONE | HIGH |
| **Route lazy load** | ❌ All static imports | HIGH |

**Critical Issue:**
```typescript
// App.tsx:8-18 — ALL pages loaded upfront
import { DashboardPage } from './components/DashboardPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { InboxPage } from './components/InboxPage';
// ... no React.lazy() found in entire codebase
```

### Image Handling

| Aspect | Status | Finding |
|--------|--------|---------|
| Lazy loading | ❌ 1/20+ | Only chat images |
| Width/Height | ❌ 0/100+ | None have explicit dimensions |
| CLS prevention | ⚠️ Partial | CSS aspect-ratio only |

### Missing Components

| Component | Status | Impact |
|-----------|--------|--------|
| Error Boundary | ❌ MISSING | White screen crashes |
| 404 Page | ❌ MISSING | Redirects to `/` silently |
| Skeleton Loaders | ❌ MISSING | CLS + poor UX |
| LandingPage Loading | ❌ MISSING | No feedback on load |

### SEO Gaps

| Component | Status |
|-----------|--------|
| sitemap.xml | ❌ MISSING |
| OG meta tags | ❌ MISSING |
| react-helmet | ❌ NOT INSTALLED |
| Structured data | ❌ MISSING |
| Canonical URLs | ❌ MISSING |

---

## 2. Backend Capacity Analysis (10K Users)

### Traffic Profile

```
10K Registered Users:
├── Monthly Active (MAU): 3,000-5,000 (30-50%)
├── Daily Active (DAU): 500-1,000 (10-15% MAU)
└── Peak Concurrent: 100-300 users (19:00-22:00)

Request Rate @ 300 concurrent:
├── Listing browse: 15-25 req/s
├── Socket.IO events: 10-20 events/s
├── File uploads: 1-3 req/s
└── Total: 30-50 req/s
```

### Database Indexes Assessment

| Table | Status | Issue |
|-------|--------|-------|
| Property | ⚠️ Partial | Missing composite `(city, status)` |
| Room | ⚠️ Partial | Missing `priceMonthly` index |
| Message | ❌ CRITICAL | **NO PAGINATION** |
| User | ✅ Good | Has `email` index |
| Conversation | ⚠️ Partial | Missing `updatedAt` index |

### CRITICAL: Message Pagination Missing

```typescript
// conversations.service.ts:117-124
async findMessages(conversationId: string) {
  return this.prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    include: { sender: true },
    // ❌ NO LIMIT, NO CURSOR
  });
}
```

**Impact:** 10,000 message conversation = unbounded query = DB crash

### Connection Pool

| Aspect | Status |
|--------|--------|
| Prisma config | ❌ Default (9 connections) |
| Railway DATABASE_URL | ❌ No `connection_limit` param |
| Recommendation | Set `connection_limit=50` |

### Socket.IO / Redis

| Aspect | Status |
|--------|--------|
| Redis adapter code | ✅ Implemented |
| REDIS_URL env var | ❌ NOT SET |
| Presence tracking | ❌ In-memory only |
| Horizontal scaling | ❌ Single instance |

### What Works Well

- ✅ **No N+1 queries** — All use eager loading with `include`
- ✅ **Rate limiting** — 30 global, 10 auth req/min
- ✅ **Proper Prisma usage** — Transactions, proper relations

---

## 3. Rendering Strategy Analysis

### Current State: Pure CSR (SPA)

```bash
# curl https://kostfindweb.vercel.app/listings
<!DOCTYPE html>
<html>
  <head><title>KostFind</title></head>
  <body>
    <div id="root"></div>     ← GOOGLE SEES EMPTY DIV
    <script src="/assets/index-xxx.js"></script>
  </body>
</html>
```

### SEO Impact Assessment

| Halaman | SEO Critical? | CSR Impact | Recommended |
|---------|---------------|------------|-------------|
| `/listings` | ✅ VERY | ❌ ZERO indexing | **SSR** |
| `/listings/:id` | ✅ VERY | ❌ ZERO indexing | **ISR** |
| `/` (Homepage) | ✅ VERY | ❌ Partial | **SSG** |
| `/blog/*` | ✅ VERY | ❌ ZERO | **SSG** |
| `/login` | ❌ No | ✅ OK | CSR |
| `/register` | ❌ No | ✅ OK | CSR |
| `/dashboard/*` | ❌ No | ✅ OK | CSR |
| `/conversations` | ❌ No | ✅ OK (realtime) | CSR |

### Recommendation: Next.js Hybrid (Jalur B)

```
┌─────────────────────────────────────────────────────────────┐
│                 MIGRATION ROADMAP                            │
├─────────────────────────────────────────────────────────────┤
│ SPRINT 1 (Week 1) — Quick Wins                             │
│ ├── Route-based code splitting                             │
│ ├── Lazy load map components                               │
│ ├── Add message pagination                                 │
│ └── Add error boundary                                     │
├─────────────────────────────────────────────────────────────┤
│ SPRINT 2 (Week 2) — UX Polish                              │
│ ├── Skeleton loaders                                       │
│ ├── 404 page                                               │
│ ├── LandingPage loading state                              │
│ └── Image lazy loading                                     │
├─────────────────────────────────────────────────────────────┤
│ SPRINT 3 (Week 3-4) — SEO Foundation                      │
│ ├── sitemap.xml generator                                  │
│ ├── OG meta tags                                           │
│ ├── Connection pool config                                  │
│ └── REDIS_URL activation                                   │
├─────────────────────────────────────────────────────────────┤
│ PHASE 2 (Month 2) — Rendering Migration                   │
│ ├── Setup Next.js App Router                               │
│ ├── /listings → SSR                                       │
│ ├── /listings/:id → ISR (300s)                            │
│ └── Homepage → SSG                                         │
├─────────────────────────────────────────────────────────────┤
│ PHASE 3 (Month 3+) — Full Migration                        │
│ ├── Port remaining pages                                   │
│ ├── Monitor SEO indexing progress                          │
│ └── Performance optimization                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Prioritized Action Items

### Week 1 — CRITICAL (Est. 8 hours)

| # | Task | Impact | Files |
|---|------|--------|-------|
| 1 | **Message pagination** | Backend won't crash | `conversations.service.ts` |
| 2 | **Route code splitting** | Bundle -50% | `App.tsx` |
| 3 | **Lazy load maps** | Bundle -40% | `MapView.tsx`, `MapboxMapView.tsx` |
| 4 | **Error boundary** | No white screens | `App.tsx` |
| 5 | **Connection pool** | DB reliability | Railway env |

### Week 2 — HIGH (Est. 10 hours)

| # | Task | Impact | Files |
|---|------|--------|-------|
| 6 | Skeleton loaders | UX + CLS | Components |
| 7 | 404 page | UX | `App.tsx` |
| 8 | LandingPage loading | UX | `LandingPageContainer.tsx` |
| 9 | Image lazy loading | LCP | Property cards |
| 10 | Image dimensions | CLS | All img tags |

### Week 3-4 — MEDIUM (Est. 8 hours)

| # | Task | Impact | Files |
|---|------|--------|-------|
| 11 | sitemap.xml | SEO | `public/sitemap.xml` |
| 12 | OG meta tags | Social | `App.tsx` |
| 13 | Font-display swap | FOIT | `index.html` |
| 14 | Preload hints | LCP | `index.html` |
| 15 | REDIS_URL | Scaling | Railway |

### Month 2 — STRATEGIC (Est. 2 weeks)

| # | Task | Impact | Scope |
|---|------|--------|-------|
| 16 | Next.js setup | Foundation | Project |
| 17 | /listings SSR | SEO | SearchPage |
| 18 | /listings/:id ISR | SEO | DetailPage |
| 19 | Homepage SSG | LCP | LandingPage |

---

## 5. Cost Estimation

### Monthly Production Cost (10K Users)

| Service | Plan | Cost |
|---------|------|------|
| Vercel Pro | Frontend + SSR | $20/mo |
| Railway | Backend (0.5-1 vCPU) | $15-25/mo |
| Railway PostgreSQL | Database | $5-10/mo |
| Railway Redis | Socket scaling | $5-10/mo |
| Domain | Annual | ~Rp 150K/yr |

```
TOTAL: $45-65/month (~Rp 700K-1.050K)
```

---

## 6. Success Metrics

### Week 1 Targets

- [ ] Bundle size < 300KB initial (gzipped)
- [ ] Message pagination working
- [ ] Error boundary in place
- [ ] No white screen crashes

### Week 4 Targets

- [ ] Lighthouse Mobile Score ≥ 60
- [ ] LCP < 4 seconds
- [ ] CLS < 0.25
- [ ] Sitemap submitted to Google

### Month 3 Targets

- [ ] Google indexing listing pages
- [ ] Lighthouse Mobile Score ≥ 75
- [ ] Organic traffic increasing
- [ ] Backend handles 300 concurrent

---

## Files Referenced

### Frontend (kostfind_web)
```
src/main.tsx                          — App entry, QueryClient
src/App.tsx                           — Routes, meta tags
vite.config.ts                        — Build config (NO code splitting)
src/components/MapView.tsx            — Leaflet (NO lazy load)
src/components/MapboxMapView.tsx      — Mapbox (NO lazy load)
src/pages/LandingPageContainer.tsx    — MISSING loading state
```

### Backend (kostfind_api)
```
prisma/schema.prisma                  — Database indexes
src/modules/conversations/conversations.service.ts  — NO pagination
src/realtime/realtime.gateway.ts      — Redis adapter (NOT enabled)
src/prisma/prisma.service.ts          — NO connection pool config
src/app.module.ts                     — Rate limiting ✅
```

### Configuration
```
vercel.json                           — Security headers ✅
```

---

## Conclusion

**KostFind is NOT production-ready yet.**

**Key blockers:**
1. Bundle size too large (maps loaded upfront)
2. No code splitting
3. Message pagination missing (will crash)
4. Pure CSR = ZERO SEO for listing pages

**Estimated time to production-ready: 3-4 weeks**

**Recommended path: Next.js Hybrid Migration (Jalur B)**

> "SEO adalah sumber utama traffic marketplace — tanpa SSR untuk halaman listing, KostFind tidak akan pernah muncul di hasil pencarian Google untuk 'kost murah di [kota]'."