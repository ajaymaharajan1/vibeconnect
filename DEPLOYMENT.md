# 🚀 VibeConnect — PostgreSQL Production & Realtime Deployment Guide

VibeConnect has been upgraded to **PostgreSQL**, making it 100% compatible with production cloud platforms (Render, Vercel, Supabase, Neon, Railway, Docker VPS).

---

## 🌐 Option 1: PaaS Deployment (Render PostgreSQL + Vercel) — 100% Free

### Step 1: Create Free PostgreSQL Database on Render.com
1. Log into **[Render.com](https://render.com)**.
2. Click **New +** → Select **PostgreSQL**.
3. Name: `vibeconnect-postgres` → Region: Choose closest → Database: `vibeconnect_db`.
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** or **External Database URL**:
   `postgresql://vibeuser:password@dpg-xxxx.render.com/vibeconnect_db`

### Step 2: Deploy Backend Service on Render.com
1. Click **New +** → Select **Web Service**.
2. Connect your `vibeconnect` GitHub repository (`https://github.com/ajaymaharajan1/vibeconnect.git`).
3. Set fields:
   - **Root Directory**: `backend`
   - **Build Command**: `npm ci && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma db push && npx ts-node prisma/seed.ts && node dist/index.js`
4. Add Environment Variables:
   - `DATABASE_URL`: *(Paste your Render/Neon/Supabase PostgreSQL connection string)*
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: `vibeconnect_production_secret_key_2026`
   - `ALLOWED_ORIGINS`: `*`
5. Click **Create Web Service**. Render will connect to PostgreSQL, run `prisma db push`, seed the database, and launch your API! Copy your backend URL:
   `https://vibeconnect-api.onrender.com`

### Step 3: Deploy Frontend App on Vercel.com
1. Go to **[Vercel.com](https://vercel.com)** → Click **Add New...** → **Project**.
2. Import `vibeconnect` repository.
3. Settings:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Edit → Select `frontend`.
   - **Environment Variable**:
     - `NEXT_PUBLIC_API_URL` = `https://vibeconnect-api.onrender.com`
4. Click **Deploy**. Vercel will publish your live app at `https://vibeconnect.vercel.app`!

---

## 🐳 Option 2: 1-Click Docker VPS Deployment (DigitalOcean / AWS)

Run a unified PostgreSQL + Backend + Frontend stack on any Linux VPS:

```bash
git clone https://github.com/ajaymaharajan1/vibeconnect.git
cd vibeconnect
docker compose up -d --build
```

---

## 🛡️ Health Verification

Check backend API health:
```bash
curl https://vibeconnect-api.onrender.com/health
```

Expected Response:
```json
{
  "status": "ok",
  "app": "VibeConnect Backend API",
  "environment": "production",
  "timestamp": "2026-09-01T10:00:00.000Z"
}
```
