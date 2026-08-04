# ASHENRITUAL — 100% Free Production Deployment Guide

This guide provides step-by-step instructions for deploying the ASHENRITUAL platform entirely on permanent free-tier services. 

## Stack Overview
- **Frontend**: Vercel (Free Tier)
- **Backend**: Render (Web Service - Free Tier)
- **Database**: Neon (PostgreSQL - Free Tier)
- **AI Engine**: Google Gemini API (Free Tier)

---

## 1. Database Setup (Neon PostgreSQL)

1. Sign up at [Neon.tech](https://neon.tech/)
2. Create a new project named `ashenritual`
3. In the Neon Dashboard, navigate to **Dashboard > Connection Details**
4. Copy the connection string. It will look like:
   `postgresql://[user]:[password]@[host]/[dbname]?sslmode=require`
5. Note this URL down for the Backend Deployment step.

---

## 2. Backend Deployment (Render)

1. Sign up at [Render.com](https://render.com/) and connect your GitHub account.
2. Click **New +** and select **Web Service**.
3. Choose your ASHENRITUAL GitHub repository.
4. Configure the Web Service:
   - **Name**: `ashenritual-api`
   - **Root Directory**: `backend` (Very important!)
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Instance Type**: Free
5. Scroll down to **Environment Variables** and add:

| Key | Value | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `DATABASE_URL` | *(Your Neon URL)* | The pooled connection string from Neon |
| `FRONTEND_URL` | *(Leave empty for now)* | We will update this after deploying the frontend |
| `JWT_SECRET` | *(Generate a secure random string)* | E.g., run `openssl rand -base64 32` |
| `JWT_REFRESH_SECRET` | *(Generate a secure random string)* | Different from `JWT_SECRET` |
| `GOOGLE_GEMINI_API_KEY` | *(Your Gemini API key)* | From Google AI Studio |

6. Click **Create Web Service**. Render will install dependencies, generate the Prisma client, run database migrations automatically (via the `start:prod` script), and start the server.
7. Note down the deployed Render URL (e.g., `https://ashenritual-api.onrender.com`).

---

## 3. Frontend Deployment (Vercel)

1. Sign up at [Vercel.com](https://vercel.com/) and connect your GitHub account.
2. Click **Add New... > Project**.
3. Import your ASHENRITUAL repository.
4. Configure the Project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (Click Edit to change this)
5. Under **Environment Variables**, add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://ashenritual-api.onrender.com/api` (Use your Render URL) |
| `NEXT_PUBLIC_APP_URL` | `https://ashenritual.vercel.app` (Your Vercel domain) |

6. Click **Deploy**. Vercel will automatically build and deploy the Next.js frontend.
7. Note down the deployed Vercel URL.

---

## 4. Final Security Link (CORS)

Now that the Frontend is deployed, we must tell the Backend to accept traffic from it.

1. Go back to your **Render Dashboard**.
2. Open the `ashenritual-api` Web Service.
3. Go to **Environment**.
4. Update or add the `FRONTEND_URL` variable:
   - **Value**: `https://your-vercel-domain.vercel.app` (No trailing slash)
5. Save changes. Render will restart the backend securely bound to your frontend.

---

## Post-Deployment Checklist

- [ ] Visit your Vercel URL and verify the homepage loads.
- [ ] Open the Console (F12) and ensure there are no CORS errors.
- [ ] Navigate to `/shop` and ensure products load from the database.
- [ ] Create a test account (Authentication test).
- [ ] Open the Vesper tab and send a message (Gemini API test).
- [ ] (Optional) Once a product image CDN is chosen (e.g., Cloudinary), update `next.config.ts` to replace the `**` wildcard with the specific CDN domain.
