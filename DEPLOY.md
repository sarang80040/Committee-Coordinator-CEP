# Deploying to Render

This repo deploys as two Render services from `render.yaml` (Blueprint):

- **committee-coordinator-api** — Node web service (backend, Express + MongoDB)
- **committee-coordinator-web** — Static site (frontend, Vite build)

## One-time setup

1. Push the repo to GitHub.
2. On Render: **New + → Blueprint** → pick this repo. Render reads `render.yaml` and creates both services.
3. Fill the secret env vars Render prompts for (they have `sync: false`):

   **API service:**
   - `MONGO_URI` — MongoDB Atlas connection string
   - `JWT_SECRET` — long random string
   - `FRONTEND_URL` — full URL of the static site (set after first deploy, e.g. `https://committee-coordinator-web.onrender.com`)

   **Web service:**
   - `VITE_API_URL` — full URL of the API service (e.g. `https://committee-coordinator-api.onrender.com`)

4. After both deploy once and you know the URLs, update `FRONTEND_URL` and `VITE_API_URL` to match, then redeploy. The frontend must be rebuilt for `VITE_API_URL` to take effect (Vite inlines it at build time).

## MongoDB Atlas

Whitelist `0.0.0.0/0` in Atlas Network Access (Render IPs are dynamic on free plan), or use Atlas's allow-from-anywhere with strong DB credentials.

## Local dev

Backend: `cd backend && cp .env.example .env` (fill values) → `npm run dev`
Frontend: `cd frontend && npm run dev` (uses `http://localhost:5000` by default; override with `frontend/.env` setting `VITE_API_URL`).

## Notes

- Free Render web services sleep after inactivity; first request after a sleep takes ~30s.
- The CORS allowlist is driven by `FRONTEND_URL` (comma-separate to allow multiple origins).
- SPA routing is handled by `frontend/public/_redirects` and the rewrite rule in `render.yaml`.
