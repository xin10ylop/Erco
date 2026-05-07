# Erco — Analytics Intake & Prioritisation Prototype

A clickable prototype for Erco Energía's proposed analytics request management
system. Built for the LBS Medellín GE 2026 project. Frontend only — no backend,
no database, no auth. Refreshing the page resets state to the seed data.

## Stack

- Vite + React 18
- React Router
- Tailwind CSS

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Views

- `/` — Landing page
- `/submit` — Submit a request (8-section intake form)
- `/triage` — Triage queue (Analytics Lead view, scoring modal)
- `/request/:id` — Request detail (only reachable from the queue)
