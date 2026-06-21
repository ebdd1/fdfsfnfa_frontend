# Auth Pages — Login & Register
**Override untuk:** LoginPage.tsx, RegisterPage.tsx  
**Prioritas:** Trust & Security Perception

---

## 🎯 Context

Halaman auth adalah first impression untuk user security. Dari audit OWASP sebelumnya (F-001 s.d F-018), trust perception sangat penting untuk marketplace.

**User concern:** "Apakah data saya aman? Apakah ini situs legitimate?"

---

## 🎨 Design Overrides

### Layout Pattern

**Single-column centered** (bukan split-screen):
- Lebih fokus, less distraction
- Better untuk mobile (mayoritas traffic Indonesia)
- Logo KostFind di top-center untuk brand recognition

```tsx
<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
  <div className="w-full max-w-md">
    {/* Logo */}
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-primary">KostFind</h1>
      <p className="text-sm text-gray-600 mt-2">
        Platform terpercaya untuk cari kost
      </p>
    </div>

    {/* Auth Card */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      {/* Form content */}
    </div>

    {/* Trust indicators below card */}
    <div className="mt-6 text-center text-sm text-gray-500">
      <span>🔒 Data Anda dilindungi dengan enkripsi</span>
    </div>
  </div>
</div>
```

---

## 🔐 Trust Indicators

### Visual Security Cues

1. **Lock icon** di password field
2. **Shield badge** untuk "Verified Platform"
3. **SSL indicator** text di footer
4. **Social proof** (optional): "Dipercaya 10,000+ pengguna"

```tsx
{/* Password field dengan security visual */}
<div className="relative">
  <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
  <input 
    type="password"
    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
    placeholder="Password Anda"
  />
</div>
```

---

## 📝 Form Best Practices

### Input Fields

```tsx
{/* Label jelas, error state merah */}
<div className="space-y-2">
  <label className="block text-sm font-semibold text-gray-700">
    Email <span className="text-danger">*</span>
  </label>
  <input 
    type="email"
    className={`
      w-full px-4 py-3 
      border rounded-lg 
      transition-all duration-200
      ${error 
        ? 'border-danger focus:ring-danger' 
        : 'border-gray-300 focus:ring-primary'
      }
      focus:ring-2 focus:border-transparent
    `}
    placeholder="nama@email.com"
  />
  {error && (
    <p className="text-sm text-danger flex items-center gap-1">
      <AlertCircle className="w-4 h-4" />
      {error}
    </p>
  )}
</div>
```

### Password Strength Indicator

```tsx
{/* Show strength saat user typing */}
<div className="mt-2 flex gap-1">
  <div className={`h-1 flex-1 rounded ${strength >= 1 ? 'bg-danger' : 'bg-gray-200'}`} />
  <div className={`h-1 flex-1 rounded ${strength >= 2 ? 'bg-warning' : 'bg-gray-200'}`} />
  <div className={`h-1 flex-1 rounded ${strength >= 3 ? 'bg-secondary' : 'bg-gray-200'}`} />
</div>
<p className="text-xs text-gray-600 mt-1">
  Minimal 8 karakter, kombinasi huruf dan angka
</p>
```

---

## 🔘 CTA Button

### Primary Action (Login/Register)

```tsx
<button 
  type="submit"
  disabled={isLoading}
  className="
    w-full bg-primary hover:bg-[#003a9e] 
    text-white font-semibold py-3 px-6 rounded-lg 
    transition-all duration-200 
    focus:ring-2 focus:ring-primary focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    flex items-center justify-center gap-2
  "
>
  {isLoading ? (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
      Memproses...
    </>
  ) : (
    'Masuk'
  )}
</button>
```

---

## 🔗 Navigation Links

```tsx
{/* Link ke halaman lain */}
<div className="mt-4 text-center">
  <p className="text-sm text-gray-600">
    Belum punya akun?{' '}
    <Link 
      to="/register" 
      className="text-primary hover:underline font-semibold"
    >
      Daftar sekarang
    </Link>
  </p>
</div>

{/* Forgot password */}
<div className="text-right">
  <Link 
    to="/forgot-password" 
    className="text-sm text-primary hover:underline"
  >
    Lupa password?
  </Link>
</div>
```

---

## ⚠️ Error Handling

### Server Error Display

```tsx
{serverError && (
  <div className="mb-4 p-4 bg-red-50 border border-danger rounded-lg flex items-start gap-3">
    <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
    <div className="text-sm">
      <p className="font-semibold text-danger">Login Gagal</p>
      <p className="text-gray-700 mt-1">{serverError}</p>
    </div>
  </div>
)}
```

### Success State (Optional)

```tsx
{success && (
  <div className="mb-4 p-4 bg-green-50 border border-secondary rounded-lg flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
    <p className="text-sm text-gray-700">{success}</p>
  </div>
)}
```

---

## 🚫 Anti-Patterns untuk Auth

❌ **Social login tanpa explain** — User Indonesia banyak yang skeptis OAuth  
✅ **Tambahkan text:** "Kami tidak akan post apapun tanpa izin Anda"

❌ **Split-screen dengan gambar** — Terlalu banyak distraction  
✅ **Single column centered** — Focus on form

❌ **Auto-redirect tanpa feedback** — User bingung apa yang terjadi  
✅ **Loading state jelas** — "Memproses..." dengan spinner

❌ **Error message technical** — "401 Unauthorized"  
✅ **Error message friendly** — "Email atau password salah. Coba lagi?"

---

## ✅ Auth-Specific Checklist

- [ ] Lock icon di password field
- [ ] Password show/hide toggle (EyeIcon)
- [ ] Password strength indicator (Register)
- [ ] Loading state saat submit (disable button + spinner)
- [ ] Error state merah dengan icon + message
- [ ] Success state hijau (jika applicable)
- [ ] Trust indicator ("🔒 Data Anda aman")
- [ ] Social proof (optional): "10,000+ pengguna"
- [ ] Link "Lupa password?" visible
- [ ] Link ke Register/Login (toggle antar pages)
- [ ] No auto-redirect tanpa user confirmation
- [ ] Form validation client-side (before submit)
- [ ] Accessibility: label for all inputs
- [ ] Accessibility: error announcements

---

**Security Note:** Design ini untuk VISUAL trust perception. Actual security (bcrypt, JWT, CSRF, HTTPS) harus handled di backend — lihat audit OWASP sebelumnya untuk implementasi.
