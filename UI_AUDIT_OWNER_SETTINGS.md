# Owner Settings (Pengaturan Profil) — UI/UX Audit Report
**Date:** 2026-06-22
**Skill Used:** ui-ux-pro-max
**File Audited:** `src/components/dashboard/OwnerSettings.tsx`
**Reference:** `design-system/MASTER.md`
**Scope:** Section "Pengaturan Akun" pada dashboard pemilik kost (edit profil, rekening bank, manajemen sesi)
**Status:** ✅ Audited + Fixed (this session)

---

## Executive Summary

```
GRADE SEBELUM: C  — Struktur bagus, tapi off-brand + a11y gap
GRADE SESUDAH: A- — Brand-compliant, teks ≥14px, WCAG AA labels

✓ Strengths (sudah ada sebelum fix):
  - Lucide React icons (no emoji)
  - NO glassmorphism (sesuai larangan MASTER)
  - Layout responsive 2/3 + 1/3 (collapse rapi di mobile)
  - State lengkap: loading (spinner), success (toast), error, empty avatar
  - Dirty-check (tombol Simpan disabled saat tidak ada perubahan)
  - Upload avatar dengan preview + hover overlay

✗ Issues ditemukan (sudah diperbaiki):
  - Brand color: full emerald-*, 0 token brand
  - Typography: input 13px, label 12px, hint 11px (< 14px min MASTER)
  - Kontras: label text-slate-400 (~2.5:1) gagal WCAG AA
  - A11y: <label> tanpa htmlFor/id, tombol avatar tanpa aria-label
  - A11y: success/error tidak diumumkan screen reader (no aria-live)
  - Touch target tombol Simpan ~40px (< 44px)
```

---

## Detailed Findings

### Category 1: Brand Colors — ❌ FAIL → ✅ FIXED

**Issue:** MASTER mewajibkan token brand (`primary #004ac6`, `secondary #006c49`).
Section ini memakai `emerald-*` di seluruh elemen aktif.

**Konteks penting:** Bukan hanya section ini — **SELURUH** `src/components/dashboard/*`
memakai `emerald-*` (0 penggunaan token `primary`/`secondary`). Dashboard pemilik punya
identitas hijau yang konsisten secara internal tapi menyimpang dari MASTER.

**Keputusan:** Pertahankan identitas hijau, ganti `emerald-*` → token brand resmi
**`secondary` (#006c49)**. (Bukan biru `primary`, demi konsistensi dengan rest of dashboard.)

| Elemen | Sebelum | Sesudah |
|--------|---------|---------|
| Glow accent header | `bg-emerald-400/10` | `bg-secondary/10` |
| Badge "Mitra Terverifikasi" | `text-emerald-600 bg-emerald-50` | `text-secondary bg-secondary/10` |
| Focus ring 5 input | `focus:*-emerald-500` | `focus:*-secondary` |
| Ikon Rekening Bank | `bg-blue-50 text-blue-600` | `bg-secondary/10 text-secondary` |
| Tombol "Simpan Profil" | `bg-emerald-600 hover:bg-emerald-700` | `bg-secondary hover:bg-[#005538]` |
| Toast "Profil tersimpan!" | `text-emerald-600` | `text-secondary` |

---

### Category 2: Typography — ❌ FAIL → ✅ FIXED

**Issue:** MASTER (anti-pattern "Tiny text") melarang font < 14px untuk body.

| Elemen | Sebelum | Sesudah | Alasan |
|--------|---------|---------|--------|
| Semua input (7 field) | `text-[13px]` | `text-base` (16px) | Min 14px + cegah auto-zoom iOS |
| Semua label form | `text-[12px]` | `text-sm` (14px) | Min body |
| Pesan error | `text-[12px]` | `text-sm` | Min body |
| Toast sukses | `text-[12px]` | `text-sm` | Min body |
| Tombol Simpan | `text-[13px]` | `text-sm` | Min body |
| Tombol Logout | `text-[13px]` | `text-sm` | Min body |
| Deskripsi sesi | `text-[13px]` | `text-sm` | Min body |
| Hint "Klik foto", helper bank | `text-[11px]` | `text-xs` (12px) | Tier caption (boleh 12px) |

> Catatan: Badge verified & hint caption dibiarkan 12px (`text-xs`) — sesuai tier
> "Caption" MASTER (12px, weight 500). Body diangkat ke 14–16px.

---

### Category 3: Contrast (WCAG AA) — ❌ FAIL → ✅ FIXED

**Issue:** Label & hint pakai `text-slate-400` (#94A3B8) di atas putih ≈ 2.5:1, gagal 4.5:1.

| Elemen | Sebelum | Sesudah | Rasio |
|--------|---------|---------|-------|
| Label form (7×) | `text-slate-400` | `text-slate-600` (#475569) | ✅ ~7:1 |
| Hint "Klik foto", helper bank | `text-slate-400` | `text-slate-500` | ✅ ~4.6:1 |
| Ikon dekoratif input | `text-slate-400` | (dibiarkan) | Bukan teks |

---

### Category 4: Accessibility (Form & Screen Reader) — ⚠️ PARTIAL → ✅ FIXED

| Check | Sebelum | Sesudah |
|-------|---------|---------|
| Label terasosiasi input | ❌ `<label>` polos | ✅ `htmlFor` + `id` (5 input editable) |
| Tombol avatar (icon-only) | ❌ tanpa nama | ✅ `aria-label="Ubah foto profil"` |
| Keyboard input numerik | ❌ default | ✅ `inputMode="numeric"` di No. Rekening |
| Pengumuman error | ❌ silent | ✅ wrapper `aria-live="polite"` |
| Pengumuman sukses | ❌ silent | ✅ wrapper `aria-live="polite"` |
| Focus ring tombol | ⚠️ tidak ada | ✅ `focus:ring-2` di Simpan & Logout |
| Field read-only (Email/Hak Akses) | ⚠️ mirip input editable | ✅ ikon `Lock` + bg lebih gelap (visual cue) |

---

### Category 5: Touch & Interaction — ⚠️ MINOR → ✅ FIXED

| Elemen | Sebelum | Sesudah |
|--------|---------|---------|
| Tombol Simpan tinggi | `py-2.5` (~40px) | `py-3` (~44px) ✅ |
| `cursor-pointer` Simpan | ❌ tidak ada | ✅ ditambahkan |
| `disabled:cursor-not-allowed` | ❌ | ✅ ditambahkan |

---

### Category 6: Structure & State — ✅ PASS (tidak diubah)

- Layout responsive 2/3 (form) + 1/3 (sesi) → collapse vertikal di `< md`. ✅
- No glassmorphism / no backdrop-blur. ✅
- Loading (spinner upload + saving), success toast (auto-hide 3s), error inline, empty avatar. ✅
- Dirty-check ganda (profil + bank) sebelum enable tombol. ✅

---

## Pre-Delivery Checklist

| Item | Status |
|------|--------|
| Hover states (200ms) | ✅ `transition-colors` |
| Focus states visible | ✅ ditambahkan ring di tombol |
| Contrast ≥ 4.5:1 | ✅ label→slate-600 |
| Responsive 375/768/1440 | ✅ (perlu verifikasi visual) |
| Loading states | ✅ |
| Error states | ✅ |
| Empty states | ✅ avatar fallback |
| Alt text images | ✅ avatar `alt={name}` |
| ARIA labels icon buttons | ✅ avatar + Lock |
| cursor-pointer | ✅ |
| Font ≥ 14px body | ✅ |
| Brand colors | ✅ secondary |
| prefers-reduced-motion | ⚠️ global (lihat follow-up) |

---

## Follow-up (Di Luar Scope Section Ini)

1. **Sisa dashboard masih emerald** — `Overview.tsx`, `FinanceOverview.tsx`,
   `PropertiesList.tsx`, `AddPropertyModal.tsx` masih pakai `emerald-*` (29× `bg-emerald-50`,
   dst). Untuk konsistensi brand penuh, lakukan migrasi `emerald-*` → `secondary` di seluruh
   `src/components/dashboard/*` sebagai task terpisah.
2. **`prefers-reduced-motion` global** — belum ada di `src/index.css`. MASTER mensyaratkan.
   Tambahkan global media query (1 blok CSS) — berdampak ke seluruh app, bukan hanya file ini.
3. **Verifikasi build** — `npm run build` / `tsc --noEmit` belum dijalankan di sesi ini
   (terblokir permission). Jalankan manual untuk konfirmasi TypeScript bersih.

---

**Audit + Fix selesai:** 2026-06-22
**Auditor:** Claude (ui-ux-pro-max)
