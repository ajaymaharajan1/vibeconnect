# 🚀 VibeConnect — Realtime Public Deployment Guide

This guide provides step-by-step instructions to deploy VibeConnect to public cloud servers in real time.

---

## 🌐 Option 1: PaaS Deployment (Vercel + Render / Railway) — Recommended

### Step 1: Deploy Backend (Render.com or Railway.app)
1. Push your repository to GitHub.
2. Go to **Render.com** or **Railway.app** → Click **New Web Service**.
3. Select the `backend/` directory.
4. Set the build and start commands:
   - **Build Command**: `npm ci && npx prisma generate && npm run build`
   - **Start Command**: `npx prisma db push && node dist/index.js`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: `your_secure_jwt_secret_key`
   - `ALLOWED_ORIGINS`: `https://your-frontend-domain.vercel.app`
6. Click **Deploy**. Copy your backend URL (e.g. `https://vibeconnect-api.onrender.com`).

### Step 2: Deploy Frontend (Vercel)
1. Go to **Vercel.com** → Click **Add New Project**.
2. Import your GitHub repository and set Root Directory to `frontend/`.
3. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://vibeconnect-api.onrender.com` (Your Render backend URL)
4. Click **Deploy**. Vercel will build and publish your live app URL (e.g. `https://vibeconnect.vercel.app`)!

---

## 🐳 Option 2: Docker VPS Deployment (DigitalOcean / AWS / Linode)

If you are hosting on a Linux VPS (Ubuntu/Debian):

1. **SSH into your server**:
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Docker & Docker Compose**:
   ```bash
   curl -fsSL https://get.docker.com | sh
   apt-get install docker-compose-plugin -y
   ```

3. **Clone Repository & Set Environment**:
   ```bash
   git clone https://github.com/your-username/vibeconnect.git
   cd vibeconnect
   ```

4. **Launch Application Containers**:
   ```bash
   docker compose up -d --build
   ```

5. **Verify Status**:
   - Web App: `http://your-server-ip:3000`
   - Backend API: `http://your-server-ip:5000/health`

---

## 🛡️ Production Verification Commands

Test that your backend and WebSockets are live:
```bash
curl https://vibeconnect-api.onrender.com/health
```

Expected Response:
```json
{
  "status": "ok",
  "app": "VibeConnect Backend API",
  "environment": "production",
  "timestamp": "2026-08-31T16:00:00.000Z"
}
```
