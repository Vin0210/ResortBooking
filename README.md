# Azure Cove — Reusable Business Website Template

A modern, mobile-first website system for local businesses (resorts, hotels,
restaurants, clinics, event venues). Built once, re-themed per client.

**Live demo business:** Azure Cove Beach Resort (resort/hotel vertical).

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19 + Vite |
| Language | JavaScript (JSX) |
| Styling | Plain CSS (design tokens in `src/index.css`) |
| Routing | React Router v7 |
| Animation | Framer Motion (used sparingly) |
| Icons | Lucide React |
| Backend | Supabase (Postgres, Auth, Storage, RLS) |
| Hosting | Vercel (recommended) |

## Quick Start

```bash
npm install
npm run dev        # local dev server
npm run build      # production build
npm run lint       # eslint
```

The app runs in **demo mode** out of the box: no Supabase credentials needed.
Data is served from a local persisted demo store so you can showcase the site
and admin dashboard to clients immediately.

## Connecting Supabase (production)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the whole of [`supabase/schema.sql`](supabase/schema.sql)
   — it creates all tables, RLS policies, storage buckets, and seed data.
3. Create an admin user under **Authentication → Users**.
4. Copy `.env.example` to `.env` and fill in:
   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart `npm run dev`. The data layer (`src/services/api.js`) now talks to
   Supabase instead of the demo store.

Only the anon key is exposed to the frontend — all writes are protected by
Row Level Security. Never put the service_role key in this project.

## Features

### Public website
- Home (hero, intro, featured rooms, amenities, gallery preview, CTA)
- About · Rooms & Cottages · Room Details · Gallery (filters + lightbox)
- Booking request form (validation, price estimate, no payment needed)
- Contact page (form, map, socials)
- Per-page SEO titles/descriptions, Open Graph, JSON-LD structured data,
  `robots.txt`, `sitemap.xml`, semantic HTML, lazy-loaded images

### Admin dashboard (`/admin`)
- Supabase Auth login (demo mode: any email + 4-char password)
- Dashboard stats (total/pending/confirmed bookings, new inquiries)
- Booking management: confirm / reject / cancel, view customer details
- Inquiry management: resolve / reopen
- Room management: add, edit, delete, pricing, capacity, availability, photo upload
- Gallery management: upload, caption, categorize, delete
- Amenity management
- Business settings (name, contacts, address, socials, map, description)

## Re-theming for a New Client

1. `src/config/business.js` — name, tagline, contacts, address, socials, map, SEO URL
2. `src/index.css` — brand palette in `:root` CSS variables
3. `index.html` — static SEO title/description + JSON-LD structured data
4. `public/sitemap.xml` — client domain
5. `public/images/` — replace placeholder photos
6. Optional: `scripts/generate-placeholders.mjs` regenerates demo images

## Project Structure

```
src/
├── admin/          Admin dashboard (auth, dashboard, bookings, rooms, gallery, amenities, settings)
├── components/     Navbar, Footer, Hero, Gallery, BookingForm, Contact, RoomCard, Amenities, common/
├── config/         business.js — single source of truth for client content
├── data/           demoData.js — seed data for demo mode
├── hooks/          useAuth (Supabase auth + demo fallback), usePageMeta (SEO)
├── pages/          Home, About, Rooms, RoomDetails, Gallery, Booking, Contact, NotFound
├── services/       supabase.js (client), api.js (data layer), demoStore.js (offline fallback)
└── utils/          format.js
supabase/schema.sql — full database schema + RLS + storage + seed
```
