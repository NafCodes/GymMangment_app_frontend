# Claude Code Prompt — BJJ Club Gym Management App

---

## Project Overview

Build a **mobile-first web demo app** for a Brazilian Jiu-Jitsu (BJJ) club at the University of Minnesota (UMN). This is designed to be used by **coaches and instructors only** — not students. The UI must render in a **phone viewport (390px wide max)**, styled like a native mobile app. No desktop layout needed.

---

## Tech Stack

- **React** (functional components + hooks)
- **Tailwind CSS** for styling
- **React Router** for navigation between screens
- **localStorage** for persisting data in the demo (no backend needed)
- **qrcode.react** for QR code generation
- Mobile-first layout: max-width 390px, centered, full-height, with bottom nav bar

---

## Design Direction

- Dark theme: near-black background (`#0A0A0A`), with a bold **red accent** (`#C8102E`, UMN Maroon) and **gold highlights** (`#FFD700`)
- Font: `Bebas Neue` for headings, `DM Sans` for body text (import from Google Fonts)
- Bottom navigation bar with icons for: Dashboard, Students, Attendance, Waivers
- Cards with subtle borders, no drop shadows — clean and utilitarian
- Mark active/inactive students with colored dot indicators

---

## App Screens & Features

### 1. Dashboard (`/`)
- App header: "UMN BJJ Club" with a small logo/icon
- Quick-stat cards: Total Students, Present Today, Waivers Pending, Waivers Expiring Soon
- Quick-action buttons: "Take Attendance" and "Generate QR Waiver"

---

### 2. Students (`/students`)
- List of all students with name, belt level, and waiver status badge (Signed / Expired / Missing)
- Tap a student to open their **Profile Screen**
- "Add Student" button opens a modal form with fields: Full Name, Email, Belt Level, Join Date
- Students stored in localStorage

---

### 3. Student Profile (`/students/:id`)
- Shows: Name, Belt, Join Date, Email
- **Waiver Status**: Shows whether waiver is signed, the date it was signed, and when it expires (waivers renew every year from Jan 1, regardless of when signed)
- **Attendance History**: A list of the last 6 months of attendance, showing how many sessions they attended per month. Highlight months where they attended 0 sessions.
- Back button to return to Students list

---

### 4. Attendance (`/attendance`)
- Shows today's date at the top
- Full student roster as a checklist — tap each name to toggle present/absent
- Each student row shows their name + a checkbox or toggle
- "Save Attendance" button saves the session to localStorage keyed by date
- Attendance history is used in the Student Profile screen

---

### 5. Waivers (`/waivers`)
- List of all students with their waiver status (color-coded: green = signed & valid, yellow = expiring within 30 days, red = expired or missing)
- Waiver expires every **January 1st** (annual renewal, regardless of when originally signed)
- "Generate QR Code" button — opens a modal showing a QR code that links to the waiver signing page (`/sign-waiver`)
- Coach can also manually mark a waiver as signed from this screen

---

### 6. Waiver Signing Page (`/sign-waiver`)
- This is the **student-facing page** accessed by scanning the QR code
- Displays the full waiver text (use a realistic liability waiver for a BJJ martial arts club)
- Form fields: Full Name, Email, Digital Signature (text field acting as e-signature), Date (auto-filled)
- "I Agree & Sign" button submits and saves to localStorage
- On submit: show a confirmation screen — "Waiver Signed Successfully. Thank you, [Name]."
- If the email matches an existing student, attach the waiver to their profile automatically

---

## Data Models (localStorage)

```js
// Students
[{ id, name, email, belt, joinDate, waiver: { signed: bool, dateSigned, expiresJan1 } }]

// Attendance
{ "YYYY-MM-DD": [studentId, studentId, ...] }

// Waivers (standalone, for walk-ins not yet in system)
[{ name, email, dateSigned, signature }]
```

---

## Seed Data

Pre-populate with **8 sample students** with varied belt levels, some with signed waivers and some without, and 3 months of randomized attendance history so the demo looks realistic out of the box.

---

## File Structure

```
/src
  /components
    BottomNav.jsx
    StudentCard.jsx
    WaiverBadge.jsx
    QRModal.jsx
  /pages
    Dashboard.jsx
    Students.jsx
    StudentProfile.jsx
    Attendance.jsx
    Waivers.jsx
    SignWaiver.jsx
  /data
    seedData.js
  App.jsx
  main.jsx
README.md
```

---

## Notes

- All data is stored in `localStorage` — this is a **demo only**, no backend
- The QR code should link to `window.location.origin + "/sign-waiver"` so it works on any host
- Waivers always expire on **January 1st** of the following year after signing, and renew each year on Jan 1st
- The app should look and feel like a **native iOS app** — bottom nav, tap interactions, full-height screens
- Do NOT build a desktop layout — keep everything constrained to a mobile phone width
