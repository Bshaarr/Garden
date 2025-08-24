# Platform

Monorepo containing:
- backend: Node.js + Express + Firebase Admin (Firestore)
- frontend: Simple web app (vanilla JS) that consumes backend APIs

## Prerequisites
- Node.js 18+
- Firebase project with service account credentials

## Backend setup
1. Copy backend/.env.example to backend/.env and fill values
2. Install deps:
```
cd backend
npm install
```
3. Run dev server:
```
npm run dev
```

## Frontend setup
Open `frontend/index.html` with a static server or your host (it expects backend at http://localhost:4000 by default).

## Deploy
- Backend: deploy to your Node host (Railway/Render/GCP). Provide environment variables.
- Frontend: host static files (Netlify/Vercel/Nginx).