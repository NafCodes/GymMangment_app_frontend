# UMN BJJ Club — Gym Management App

> A mobile-first web demo for coaches and instructors at the University of Minnesota Brazilian Jiu-Jitsu Club.

---

## What This Is

This is a **web-based demo app** built to look and behave like a mobile app. It is designed to be used by **coaches and instructors only** to manage club operations — tracking attendance, managing student profiles, and collecting digital waivers.

It runs entirely in the browser using `localStorage` for data — no backend or database required for the demo.

---

## Features

### 📋 Attendance Tracking
- Take attendance for each training session
- View attendance history per student going back 6 months
- Quickly identify students who have been missing sessions
- Track minimum attendance thresholds to flag at-risk members

### 👤 Student Profiles
- Each student has a profile with their name, belt level, email, and join date
- Profile shows a 6-month attendance summary
- Waiver status is visible directly on the profile (signed, expired, or missing)

### ✍️ Digital Waivers
- Students sign a liability waiver digitally via a QR code
- Waivers are attached to each student's profile automatically (matched by email)
- Waivers **renew every January 1st**, regardless of when they were originally signed
- The waivers screen shows color-coded status: ✅ Valid, ⚠️ Expiring Soon, ❌ Expired/Missing

### 📱 QR Code Waiver Signing
- Coaches can generate a QR code from the Waivers screen
- Students scan the QR code with their phone and are taken to the waiver signing page
- Students fill in their name, email, and digital signature and submit
- The signed waiver is saved and linked to their profile if their email matches

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React | UI framework |
| Tailwind CSS | Styling |
| React Router | Page navigation |
| qrcode.react | QR code generation |
| localStorage | Demo data persistence |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open your browser and set the window to **mobile size (390px wide)**, or use Chrome DevTools device emulation (iPhone 14 recommended).

---

## Demo Data

The app comes pre-loaded with **8 sample students** including:
- Varied belt levels (White → Purple)
- Mixed waiver statuses (signed, expired, missing)
- 3 months of randomized attendance history

This gives the app a realistic look during demos without needing to enter data manually.

---

## App Screens

| Screen | Route | Description |
|---|---|---|
| Dashboard | `/` | Quick stats and action buttons |
| Students | `/students` | Full roster with waiver badges |
| Student Profile | `/students/:id` | Individual profile + attendance + waiver |
| Attendance | `/attendance` | Take today's attendance |
| Waivers | `/waivers` | Waiver status overview + QR generator |
| Sign Waiver | `/sign-waiver` | Student-facing waiver signing page |

---

## Waiver Renewal Policy

- All waivers **expire on January 1st** each year
- It does not matter when during the year a waiver was signed — it always expires the next January 1st
- The system will flag waivers expiring within 30 days so coaches can remind students to re-sign

---

## Notes & Limitations

- This is a **demo only** — all data is stored in `localStorage` and will reset if the browser cache is cleared
- For production use, this would need a real backend, authentication, and secure waiver storage
- The waiver signing page (`/sign-waiver`) is publicly accessible — in production this should include proper identity verification

---

## Intended Users

**Coaches and Instructors** at the UMN BJJ Club. Students only interact with the app through the QR code waiver signing page.

---

## Project Structure

```
/src
  /components       # Reusable UI components (nav, cards, modals)
  /pages            # One file per screen
  /data             # Seed data for demo
  App.jsx
  main.jsx
README.md
```

---

*Built as a web demo for the UMN BJJ Club. Not for production use without additional security and backend infrastructure.*
