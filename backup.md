# 📦 DNA BJJ Club Manager — Full Project Backup
> Generated: 2026-05-20 | Branch: main | No commits yet (untracked)

---

## 🗂 Project Overview

**Name:** DNA BJJ Club Manager (`gym-app`)  
**Type:** Mobile-only React PWA (390px / iPhone 14 viewport)  
**Purpose:** Coach-facing tool for a BJJ gym to manage students, attendance, waivers, and QR-based waiver signing  
**Backend:** None — all data persisted in `localStorage`  
**Version:** 0.0.0  

---

## ⚙️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | ^19.2.6 |
| Build Tool | Vite | ^8.0.12 |
| Routing | React Router DOM | ^7.15.1 |
| Styling | Tailwind CSS v4 | ^4.3.0 |
| Tailwind Plugin | @tailwindcss/vite | ^4.3.0 |
| QR Code | qrcode.react (`QRCodeSVG`) | ^4.2.0 |
| React Plugin | @vitejs/plugin-react | ^6.0.1 |
| Type Defs | @types/react, @types/react-dom | ^19.x |
| Linting | ESLint + react-hooks + react-refresh | ^10.x |

**Dev server URL:** `http://localhost:5173`

---

## 📁 File & Folder Structure

```
GymMangment_app_demo/
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── CLAUDE.md
├── README.md
├── .gitignore
├── backup.md                    ← this file
└── src/
    ├── main.jsx                 ← React DOM entry point
    ├── App.jsx                  ← Router root + storage init
    ├── App.css
    ├── index.css                ← Global styles + Tailwind + Google Fonts
    ├── assets/
    │   ├── hero.png
    │   ├── react.svg
    │   └── vite.svg
    ├── data/
    │   └── seedData.js          ← All localStorage helpers + seed data
    ├── pages/
    │   ├── Home.jsx             ← Dashboard (2×2 nav grid)
    │   ├── Students.jsx         ← Student list + add modal
    │   ├── StudentProfile.jsx   ← Individual student detail + stripes + attendance
    │   ├── Attendance.jsx       ← Today's check-in toggle list
    │   ├── Waivers.jsx          ← Waiver status overview per student
    │   ├── Send.jsx             ← QR code + copy/share waiver link
    │   └── SignWaiver.jsx       ← Student-facing waiver signing page
    └── components/
        ├── StudentCard.jsx      ← List row for a student
        ├── BeltStripeBar.jsx    ← 4-slot white stripe progress bar
        ├── WaiverBadge.jsx      ← Status pill (Signed/Expiring/Expired/Missing)
        └── StripeModal.jsx      ← Bottom-sheet: award or remove a stripe
```

---

## 🎨 Design Tokens (`src/index.css`)

| Token | Value | Use |
|-------|-------|-----|
| Background | `#0A0A0A` | Page/app background |
| Surface/Card | `#161616` | Cards, modals, inputs |
| Header | `#111` | Top header bars |
| Border | `#2a2a2a` | Card and input borders |
| Red Accent (UMN Maroon) | `#C8102E` | Primary CTA, active states |
| Gold Highlight | `#FFD700` | Send-to-Students card accent |
| Heading Font | `Bebas Neue` | All section/page titles |
| Body Font | `DM Sans` | All body text |
| Text Primary | `#F0F0F0` | Main text |
| Text Secondary | `#888` | Labels, meta text |
| Text Muted | `#555` | Timestamps, subtle |

**Fonts loaded from:** `https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600&display=swap`

**Max width:** 390px (`app-shell` class, centered in `#root`)

---

## 🗺 Routing (`src/App.jsx`)

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `Home` | Dashboard, 2×2 nav card grid |
| `/students` | `Students` | List of all students + Add modal |
| `/students/:id` | `StudentProfile` | Detail: info, stripes, waiver, 6-mo chart |
| `/attendance` | `Attendance` | Today's check-in toggles + Save button |
| `/waivers` | `Waivers` | Grouped waiver status list |
| `/send` | `Send` | QR code + copy/share waiver URL |
| `/sign-waiver` | `SignWaiver` | **Outside bottom nav** — student-facing |

`initializeStorage()` is called once in `App.jsx`'s `useEffect` on mount.

---

## 💾 Data Layer (`src/data/seedData.js`)

### localStorage Keys

| Key | Type | Description |
|-----|------|-------------|
| `bjj_students` | `Student[]` | Array of all student objects |
| `bjj_attendance` | `{ "YYYY-MM-DD": string[] }` | Map of date → array of present student IDs |
| `bjj_waivers` | `WaiverRecord[]` | Standalone walk-in waiver records |
| `bjj_initialized` | `"true"` | Flag to prevent re-seeding |

### Student Object Shape

```js
{
  id: "stu-1",               // unique string ID
  name: "Marcus Rivera",
  email: "marcus.rivera@dna.edu",
  belt: "Purple",            // "White" | "Blue" | "Purple" | "Brown" | "Black"
  joinDate: "2022-08-15",    // ISO date string
  stripes: [                 // always 4 elements
    { awarded: true,  date: "2026-03-01" },
    { awarded: true,  date: "2026-01-01" },
    { awarded: true,  date: "2025-05-01" },
    { awarded: false, date: null },
  ],
  waiver: {
    signed: true,
    dateSigned: "2026-01-10",
    expires: "2027-01-01",   // always Jan 1 of the following year
  }
}
```

### Standalone Waiver Record Shape

```js
{
  name: "Walk-In Name",
  email: "walkin@email.com",
  dateSigned: "2026-05-20",
  signature: "Walk-In Name"
}
```

### Waiver Expiry Rule
All waivers expire on **January 1st of the year following signing**, regardless of when signed.

### `getWaiverStatus(student)` Return Values

| Return | Condition |
|--------|-----------|
| `'missing'` | `waiver.signed` is falsy |
| `'expired'` | `waiver.expires` date is in the past |
| `'expiring'` | Expires within the next 30 days |
| `'valid'` | Signed and more than 30 days before expiry |

### Belt Color Map (`getBeltColor`)

| Belt | Color |
|------|-------|
| White | `#e5e5e5` |
| Blue | `#3b82f6` |
| Purple | `#a855f7` |
| Brown | `#92400e` |
| Black | `#1f2937` |

### Exported Functions

```js
initializeStorage()        // seeds localStorage if not yet initialized; runs stripe migration
getStudents()              // → Student[]
saveStudents(students)     // persists Student[] to localStorage
getAttendance()            // → { "YYYY-MM-DD": string[] }
saveAttendance(attendance) // persists attendance object
getWaivers()               // → WaiverRecord[]
saveWaivers(waivers)       // persists standalone waivers
getWaiverStatus(student)   // → 'valid'|'expiring'|'expired'|'missing'
getBeltColor(belt)         // → hex color string
```

### Seed Data (8 demo students)

| ID | Name | Belt | Stripes | Waiver Status |
|----|------|------|---------|--------------|
| stu-1 | Marcus Rivera | Purple | 3 | Valid (signed Jan 10) |
| stu-2 | Jordan Lee | Blue | 2 | Valid (signed Mar 5) |
| stu-3 | Sofia Nakamura | Blue | 4 | **Expired** (signed prior year Nov 20) |
| stu-4 | Daniel Okafor | White | 0 | **Missing** |
| stu-5 | Priya Mehta | White | 1 | Valid (signed Jan 15) |
| stu-6 | Tyler Brooks | Blue | 0 | **Missing** |
| stu-7 | Amara Diallo | White | 2 | Valid (signed Jan 9) |
| stu-8 | Kevin Zhao | Purple | 4 | Valid (signed Feb 14) |

Attendance is seeded for **Mon/Wed/Fri** sessions across the past **3 months**, with ~70% random attendance per session.

### `migrateStripes()` (non-destructive)
Runs on every `initializeStorage()` call. Adds `stripes: [{ awarded: false, date: null }, ...]` to any student missing the field — safe to run on old data.

---

## 📄 Pages

### `/` — Home (`Home.jsx`)
- Header: DNA logo (red square, `Bebas Neue`) + club name + subtitle "BJJ CLUB MANAGER"
- 2×2 grid of nav cards linking to all 4 sections
- Cards: Students (red icon), Attendance (red icon), Waivers (red icon), Send to Students (gold icon/border)

### `/students` — Students (`Students.jsx`)
- Back arrow → `/`
- "Add" button (red) → bottom-sheet modal
- Search input (filters by name or belt)
- Student count label
- List of `<StudentCard />` rows
- **Add Student Modal:** name, email, join date, belt select → saves to localStorage

### `/students/:id` — Student Profile (`StudentProfile.jsx`)
- Back arrow → `/students`
- Student info card: avatar (belt-colored initial), name, belt dot + label, `BeltStripeBar`
- Stripes section: 4 tappable stripe slots → `StripeModal` (award or remove with date)
- Waiver card: `WaiverBadge` + signed/expires dates or "scan QR" message
- 6-Month Attendance: bar chart (6 bars, one per month, red bars / dark red for 0)

### `/attendance` — Attendance (`Attendance.jsx`)
- Date label (e.g., "Tuesday, May 20, 2026")
- "X / Y present" counter + All/None shortcuts
- Toggle list: each student row turns green when present (checkbox with checkmark)
- Fixed bottom "Save Attendance" button → turns green with "✓ Saved" on click

### `/waivers` — Waivers (`Waivers.jsx`)
- Groups students by waiver status: **Expiring → Expired → Missing → Valid**
- Each group shows count, icon (✅ ⚠️ ❌), and styled cards
- "Mark Signed" button for `missing` and `expired` students → updates waiver to today + `nextYear-01-01`

### `/send` — Send to Students (`Send.jsx`)
- Centered layout with instructions
- `QRCodeSVG` (size 220, white background, rounded) linking to `{origin}/sign-waiver`
- URL text below QR
- "Copy Link" button (turns green on success) + "Share" button (native share API, conditionally rendered)

### `/sign-waiver` — Sign Waiver (`SignWaiver.jsx`)
- **No bottom nav** — student-facing, standalone page
- Red header bar with club name + "Liability Waiver"
- Scrollable waiver text card (220px max height, pre-wrap)
- Form: Full Name, Email Address, Digital Signature (typed name), auto-filled date
- On submit: matches email to existing student → updates their `waiver` field; always appends a standalone record to `bjj_waivers`
- Success screen: green checkmark circle + "WAIVER SIGNED" + "You may close this page."

---

## 🧩 Components

### `StudentCard.jsx`
Tappable row linking to `/students/:id`.  
Shows: belt color dot (with glow), student name, `BeltStripeBar`, `WaiverBadge`, chevron arrow.

### `BeltStripeBar.jsx`
Props: `stripes` (array of 4), `size` (`'sm'` | `'lg'`)  
Renders 4 pill slots: white if awarded, dark (`#2A2A2A`) if not.  
Max width: 80px (sm) / 120px (lg). Background: `#1A0A00` (dark brown).

### `WaiverBadge.jsx`
Props: `student`, `size` (`'sm'` | `'md'`)  
Calls `getWaiverStatus()` and renders a color-coded pill:
- Valid → green (`#4ade80` on `#14532d`)
- Expiring → gold (`#FFD700` on `#713f12`)
- Expired → red (`#f87171` on `#450a0a`)
- Missing → grey (`#888` on `#1c1c1c`)

### `StripeModal.jsx`
Bottom-sheet modal (dark backdrop + slide-up panel).  
**Award mode:** date picker (max = today) → "Award Stripe" → calls `onConfirm(date)`  
**Remove mode:** confirmation step → "Yes, Remove" → calls `onConfirm(null)`  
Sub-components: `Backdrop` (overlay + container), `Handle` (drag pill)

---

## 🛠 Scripts

```bash
npm run dev       # Start Vite dev server at localhost:5173
npm run build     # Production build (output: dist/)
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

---

## 🎯 Key Business Rules

1. **Waiver expiry** always falls on **January 1st of the year after signing** — not 12 months from signing date.
2. **Attendance is session-based**: attendance records use `YYYY-MM-DD` keys. Multiple students can be marked for the same date.
3. **Stripes are position-locked**: there are always exactly 4 stripe slots. They must be awarded/removed by index (not appended).
4. **Student IDs**: new students get `stu-${Date.now()}` IDs; seed students have `stu-1` through `stu-8`.
5. **Waiver self-service**: students scan a QR code → `/sign-waiver` → email-matched against roster → updates their record automatically.
6. **No auth/roles**: entire app is coach-accessible with no login.

---

## 📱 Viewport & Layout

- **Target device:** iPhone 14 (390px wide) in Chrome DevTools
- `#root` centers the app with `justify-content: center`
- `.app-shell` clamps width to `max-width: 390px` and uses `min-height: 100dvh`
- `overflow-x: hidden` prevents horizontal scroll
- `-webkit-tap-highlight-color: transparent` removes tap flash on mobile

---

## 📦 npm Dependencies Summary

```json
"dependencies": {
  "qrcode.react": "^4.2.0",
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-router-dom": "^7.15.1"
},
"devDependencies": {
  "@eslint/js": "^10.0.1",
  "@tailwindcss/vite": "^4.3.0",
  "@types/react": "^19.2.14",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^6.0.1",
  "eslint": "^10.3.0",
  "eslint-plugin-react-hooks": "^7.1.1",
  "eslint-plugin-react-refresh": "^0.5.2",
  "globals": "^17.6.0",
  "tailwindcss": "^4.3.0",
  "vite": "^8.0.12"
}
```

---

## 🔗 External Resources

- **Google Fonts:** Bebas Neue + DM Sans (loaded via CSS `@import`)
- **Tailwind v4:** uses `@import "tailwindcss"` (no `tailwind.config.js` needed)
- **Vite config:** uses `@tailwindcss/vite` plugin + `@vitejs/plugin-react`

---

*Backup created by Claude Code (claude-sonnet-4-6) on 2026-05-20*
