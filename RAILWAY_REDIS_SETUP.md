# Railway Redis Setup Guide

## Step-by-Step: Add Redis to KostFind Backend

### 1. Login ke Railway Dashboard

Buka: https://railway.app/dashboard

Login dengan akun yang deploy kostfind_api.

---

### 2. Buka Project KostFind

Railway Dashboard → pilih project yang ada `kostfind_api` service.

---

### 3. Add Redis Database Service

Di project dashboard:

1. Klik **"+ New"** button
2. Pilih **"Database"**
3. Pilih **"Redis"**
4. Railway akan provision Redis instance (~30 detik)

Railway auto-generate environment variables:
- `REDIS_URL` — format: `redis://default:password@host:port`
- `REDIS_PRIVATE_URL` — internal Railway network (lebih cepat)

---

### 4. Link Redis ke Backend Service

**Option A: Via Dashboard (Recommended)**

1. Klik service **kostfind_api** (backend)
2. Tab **"Variables"**
3. Klik **"+ New Variable"**
4. Tambahkan:
   ```
   Name:  REDIS_URL
   Value: ${{Redis.REDIS_PRIVATE_URL}}
   ```
   (Railway auto-resolve reference ke Redis internal URL)

**Option B: Manual Copy**

Jika option A tidak jalan:
1. Klik **Redis service** → tab **"Variables"**
2. Copy value **REDIS_PRIVATE_URL**
3. Paste di **kostfind_api** Variables sebagai `REDIS_URL`

---

### 5. Redeploy Backend

Railway auto-redeploy saat env var berubah.

Atau manual trigger:
1. Klik **kostfind_api** service
2. Tab **"Deployments"**
3. Klik **"Redeploy"** pada deployment terakhir

---

### 6. Verify di Logs

Railway Dashboard → **kostfind_api** → tab **"Logs"**

**Success indicator:**
```
[Socket.IO] Redis adapter initialized for horizontal scaling
```

**Fallback indicator (jika REDIS_URL tidak terdetect):**
```
[Socket.IO] REDIS_URL not set — using in-memory adapter (single instance only)
```

**Error indicator:**
```
[Socket.IO] Redis adapter failed to initialize: <error>
```

Jika error:
- Verify `REDIS_URL` format benar
- Cek Redis service status (harus "Active")
- Restart backend service

---

## What This Enables

✅ **Horizontal Scaling**
- Railway bisa scale ke 2+ instances
- User di instance A terima event dari user di instance B
- Typing, presence, messages sync across instances

✅ **Zero Downtime Deploy**
- Deploy baru tidak disconnect semua user
- Socket.IO pub/sub tetap jalan via Redis

---

## Cost Estimate

**Railway Redis:**
- **Hobby plan:** $5/month (512 MB RAM, shared CPU)
- **Pro plan:** $10/month (1 GB RAM, dedicated CPU)

Redis untuk Socket.IO adapter sangat ringan (hanya pub/sub, no persistence):
- 512 MB cukup untuk ~10,000 concurrent users
- Actual usage: ~10-50 MB untuk traffic normal

**Recommendation:** Start with Hobby plan, upgrade kalau traffic tinggi.

---

## Testing Horizontal Scale (Optional)

**Before Redis:**
- Railway scale to 2 replicas
- User A connect → hit instance 1
- User B connect → hit instance 2
- User A kirim pesan → User B **TIDAK TERIMA** ❌

**After Redis:**
- Railway scale to 2 replicas
- User A connect → hit instance 1
- User B connect → hit instance 2
- User A kirim pesan → User B **TERIMA** via Redis pub/sub ✅

**How to test:**
1. Railway Dashboard → **kostfind_api** → **Settings** → **Replicas** → set to 2
2. Buka 2 browser, login 2 user berbeda
3. Kirim pesan bolak-balik → harus tetap sync

---

## Troubleshooting

### Redis connection timeout

**Symptom:**
```
[Socket.IO] Redis adapter failed: connect ETIMEDOUT
```

**Fix:**
- Verify Redis service running (Railway Dashboard → Redis → "Active")
- Restart backend service
- Check Railway network tidak down

---

### REDIS_URL tidak terdetect

**Symptom:**
```
[Socket.IO] REDIS_URL not set — using in-memory adapter
```

**Fix:**
- Verify env var name exact: `REDIS_URL` (uppercase, no space)
- Restart backend setelah tambah env var
- Check `${{Redis.REDIS_PRIVATE_URL}}` reference benar

---

### Messages tidak sync antar instances

**Symptom:**
- Scale to 2 replicas
- Chat tidak sync antar user

**Debug:**
1. Check logs kedua instance: apakah Redis adapter initialized?
2. Verify `REDIS_URL` sama di semua instance
3. Test Redis connection via Railway CLI:
   ```bash
   railway connect Redis
   redis-cli ping
   # Should return: PONG
   ```

---

## Next: Production Checklist

✅ Redis service added & linked  
✅ Backend redeploy with Redis adapter  
✅ Logs show "Redis adapter initialized"  
⏳ Monitor for 24h — check no connection issues  
⏳ Test under load (optional: k6 load test)  
⏳ Scale to 2 replicas (when traffic increases)  

---

**Setup selesai! Chat sekarang production-ready untuk horizontal scale.**
