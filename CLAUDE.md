# CLAUDE.md — burp-lab

Qəsdən zəif (deliberately vulnerable) təlim saytı. `kerim-agayev/burp-suite-learning` öyrənmə layihəsinin praktika hissəsi.
**İstifadəçi ilə Azərbaycan dilində danış** (texniki terminlər ingiliscə). İstifadəçi developer deyil — hər şeyi sıfırdan izah et.

## Nədir
Hər web-security mövzusunu öz saytımızda həm **hücum**, həm **qorunma** kimi öyrənmək üçün. Hər mövzu = bir cüt səhifə:
`app/vuln/<topic>/page.jsx` (zəif) + `app/secure/<topic>/page.jsx` (düzəldilmiş).

## Stack
- Next.js 16 (App Router, JSX — TypeScript YOX, sadəlik üçün), React 19.
- Prisma 6 ORM + Neon Postgres.
- Fayllar: `app/`, `lib/db.js` (Prisma singleton), `prisma/schema.prisma` + `prisma/seed.mjs` (saxta data).

## Təhlükəsizlik qaydaları (məcburi)
1. Bazada yalnız **saxta data**. Real ad/parol/email/kart YOX.
2. `.env` (DATABASE_URL) **heç vaxt commit olunmur** (`.gitignore`-dadır). Heç bir fayla gizli string yazma.
3. Deploy olunan sayt həmişə **Vercel Authentication: ON** olmalıdır (indi açıqdır). Yoxla: public URL yad adamı Vercel SSO-ya yönləndirməlidir.
4. Git: yalnız `kerim-agayev` hesabı (`kerim-agayev-2026` QADAĞAN).

## İşə salmaq (yeni kompda — məsələn ev)
```powershell
git clone https://github.com/kerim-agayev/burp-lab.git
cd burp-lab
# .env yarat: DATABASE_URL-i Vercel-dən götür
#   Vercel → burp-lab → Settings → Environment Variables → DATABASE_URL → Reveal → kopyala
#   (və ya iş kompundakı .env faylından köçür). Nümunə: .env.example
npm install
npm run dev          # http://localhost:3000 (port məşğuldursa 3001/3002...)
```
Baza artıq qurulub və doldurulub (Neon paylaşılan). **Yenidən** `db:push`/`db:seed` yalnız baza boşdursa lazımdır.

## Deploy
- Public (qorumalı): https://burp-lab-mocha.vercel.app
- `main`-ə push → Vercel avtomatik deploy. Env dəyişikliyi sonra Redeploy istəyir.

## Yeni dərs əlavə edəndə
1. `app/vuln/<topic>/page.jsx` + `app/secure/<topic>/page.jsx` yarat.
2. `app/page.jsx`-ə link əlavə et.
3. Lazımsa `prisma/schema.prisma` + `seed.mjs` yenilə, sonra `npm run db:push` + `npm run db:seed`.
4. commit + push.

## Qeyd
Dərs mətnləri, roadmap, jurnal **bu repo-da yox**, `burp-suite-learning` repo-sundadır (`CLAUDE.md`, `lessons/`, `SCHEDULE.md`). Hər dərsdən sonra o repo yenilənir.
