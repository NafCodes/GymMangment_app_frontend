# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Production build
npm run preview   # Preview production build
```

Open at **390px wide** (iPhone 14 in Chrome DevTools) — the app is mobile-only.

## Stack

- **React** + **Vite** — functional components, hooks only
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js` needed)
- **React Router v7** (`BrowserRouter`)
- **qrcode.react** (`QRCodeSVG`) for QR generation
- **localStorage only** — no backend, no auth

## Architecture

All data lives in `localStorage` via helpers in `src/data/seedData.js`:
- `bjj_students` — array of student objects
- `bjj_attendance` — `{ "YYYY-MM-DD": [studentId, ...] }`
- `bjj_waivers` — standalone waiver records (walk-ins)
- `bjj_initialized` — flag to prevent re-seeding

`initializeStorage()` is called once in `App.jsx` `useEffect` and seeds 8 demo students with 3 months of attendance history if the flag isn't set.

**Waiver expiry rule**: all waivers expire on January 1st of the year following signing, regardless of when they were signed. `getWaiverStatus(student)` returns `'valid' | 'expiring' | 'expired' | 'missing'`.

## Routing

`/sign-waiver` is rendered **outside** the bottom nav shell — it's the student-facing page linked from the QR code. All coach screens (`/`, `/students`, `/students/:id`, `/attendance`, `/waivers`) share the `BottomNav` layout.

## Design tokens (in `src/index.css`)

| Purpose | Value |
|---|---|
| Background | `#0A0A0A` |
| Surface/card | `#161616` |
| Border | `#2a2a2a` |
| Red accent (UMN Maroon) | `#C8102E` |
| Gold highlight | `#FFD700` |
| Heading font | `Bebas Neue` (Google Fonts) |
| Body font | `DM Sans` (Google Fonts) |
