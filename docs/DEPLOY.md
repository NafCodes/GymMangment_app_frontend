# Deployment Guide

## Frontend (Vercel)

1. Push this repo to GitHub (`NafCodes/GymMangment_app_demo`)
2. Import the project at [vercel.com](https://vercel.com) → Add New Project
3. Set environment variables:

```
VITE_API_URL=https://dnabjjapp-production.up.railway.app
VITE_SUPABASE_URL=https://tjauifnaeirxxwkeqnxu.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key from Supabase Dashboard → Settings → API>
VITE_APP_URL=https://<your-vercel-url>.vercel.app
```

4. Deploy. Copy the production URL.
5. Update `VITE_APP_URL` to match the Vercel URL and redeploy (so waiver QR codes point to production).

Or via CLI:

```bash
vercel --prod
# Set env vars in Vercel dashboard first
```

## Backend (Railway)

After frontend deploy, update Railway variables for `DNA_BJJ_APP`:

```
CORS_ORIGIN=https://<your-vercel-url>.vercel.app
```

Push backend changes (CORS + GET /stripes) to trigger redeploy:

```bash
cd ../DNA_BJJ_APP
git add src/index.js src/routes/stripes.js package.json package-lock.json .env.example
git commit -m "Add CORS middleware and GET /stripes endpoint"
git push origin main
```

For local dev, set `CORS_ORIGIN=http://localhost:5173` on Railway or run the backend locally.

## Verify

```bash
curl https://dnabjjapp-production.up.railway.app/health
# → {"status":"ok"}

# After CORS deploy, should include Access-Control-Allow-Origin:
curl -I -X OPTIONS https://dnabjjapp-production.up.railway.app/students \
  -H "Origin: https://your-app.vercel.app" \
  -H "Access-Control-Request-Method: GET"
```

## E2E checklist (coach tablet)

- [ ] Open Vercel URL → log in with coach Supabase account
- [ ] Add a test student → verify in Supabase `students` table
- [ ] Check in for attendance → verify `attendance` row
- [ ] Award a stripe → verify `stripes` row
- [ ] Scan waiver QR → `/sign-waiver` loads on student phone
- [ ] Log out → redirected to `/login`
- [ ] Add to home screen (Chrome → Add to Home Screen)
