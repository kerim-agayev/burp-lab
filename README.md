# Burp Lab

Qəsdən zəif (deliberately vulnerable) Next.js + Prisma + Neon təlim saytı.
**Yalnız öz testimiz üçün.** Hər dərsdə bir zəiflik: `/vuln/...` (zəif) və `/secure/...` (düzəldilmiş).

## Təhlükəsizlik qaydaları (məcburi)

1. Bazada yalnız **saxta data**. Real ad/parol/email/kart YOX.
2. Deploy olunanda **Vercel Authentication açıq** olmalıdır (yalnız sahib girə bilsin).
3. `.env` **heç vaxt commit olunmur** (`.gitignore`-dadır).
4. Yalnız bu lab üçün ayrıca Neon layihəsi — başqa heç nə o bazada olmasın.

## Qurulum (lokal)

```powershell
# 1. Neon connection string-i .env-ə yaz (.env.example-dən köçür):
#    DATABASE_URL="postgresql://...-pooler.neon.tech/...?sslmode=require"

# 2. Paketləri qur
npm install

# 3. Cədvəlləri bazada yarat
npm run db:push

# 4. Saxta datanı doldur
npm run db:seed

# 5. İşə sal
npm run dev
# → http://localhost:3000
```

## Burp ilə

Burp-un daxili brauzerində `http://localhost:3000` aç. `http://localhost` proxy-dən keçir.
SQLi dərsi: `http://localhost:3000/vuln/sqli?category=Gifts`

## Deploy (sonra)

1. Bu repo-nu GitHub-a push et (`kerim-agayev`).
2. vercel.com → Add New → Project → bu repo-nu Import et.
3. Environment Variables → `DATABASE_URL` əlavə et (Neon pooled string).
4. Settings → Deployment Protection → **Vercel Authentication: ON**.
5. Deploy.
