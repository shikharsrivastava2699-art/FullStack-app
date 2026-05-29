# FullStack-app

A starter full-stack car research platform built with TypeScript, Express, and React + Vite.

## Phase 1 Status
- Backend: Express + TypeScript server with `/health` endpoint.
- Frontend: React app displays backend health via Vite proxy.
- Dev setup: backend and frontend run independently.

## Running locally

### Backend
```bash
cd backend
npm install
npm run dev
```
Then visit: `http://localhost:5000/health`

The backend also exposes a sample Phase 1 API endpoint at `http://localhost:5000/api/v1/makes`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Then visit the local Vite URL shown in the terminal.

### Notes
- Frontend currently proxies `/health` to `http://localhost:5000` during development.
- Backend environment variables may be configured using `.env` (see `.env.example`).
- This project is currently in Phase 1: basic backend skeleton and frontend health-check integration.

