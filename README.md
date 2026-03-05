# Signls – Daily Wellness Tracker

Signls is a **mobile-first web app** for tracking your daily wellness check-ins with a gentle, conversational AI reflection.

- **Stack**: Next.js 16 (App Router) + React, Tailwind CSS 4, Supabase, Google Gemini, Vercel
- **Design**: Dark green (`#1B5E20`) & white, clean and minimal, tuned for phones but works great on desktop.

---

## 1. Getting started

```bash
cd signls
npm install
npm run dev
```

Then open `http://localhost:3000`.

---

## 2. Environment variables

Create a `.env.local` file in the project root based on `.env.example`:

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL` – your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – your Supabase anon public API key
- `GEMINI_API_KEY` – a Google AI Studio / Gemini API key

These variables will be used automatically by the app (no extra wiring needed).

---

## 3. Supabase setup

1. **Create a project**
   - Go to Supabase and create a new project (free tier is fine).
   - Copy the **Project URL** and **anon public key** into `.env.local`.

2. **Create `entries` table**

In the Supabase SQL editor, run:

```sql
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  created_at timestamptz not null default now(),
  sleep_quality integer not null,
  energy_level integer not null,
  mood integer not null,
  stress integer not null,
  healthy_eating integer not null,
  symptoms text
);
```

3. **Row level security**

```sql
alter table entries enable row level security;

create policy "Users can view their own entries"
  on entries
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on entries
  for insert
  with check (auth.uid() = user_id);
```

This ensures that each signed-in user can only see and insert their own entries.

4. **Authentication**

In the Supabase dashboard under **Authentication → Providers**, ensure **Email** is enabled. The app uses **email + password** sign up / login.

---

## 4. App behavior

- **Auth**
  - `/signup` – email/password signup.
  - `/login` – email/password login.
  - `/` – home dashboard (requires auth; unauthenticated users are redirected to `/login`).

- **Home page**
  - Morning check-in form with sliders:
    - Sleep quality (1–10)
    - Energy level (1–10)
    - Mood (1–10)
    - Stress (1–10)
    - Healthy eating (1–10)
    - Symptoms (free-text, optional)
  - On submit:
    - Saves the entry to the `entries` table in Supabase (scoped to the logged-in user).
    - Calls the `/api/gemini-response` route to get a **2–3 sentence** conversational reflection.
    - Shows the AI response in a card labeled “Today’s reflection”.
    - Refreshes and shows your **last 7 entries** in a history list under the form.

---

## 5. Google Gemini API

The route `src/app/api/gemini-response/route.ts` calls the Gemini API using `GEMINI_API_KEY`. If the key is missing or the API call fails, the app falls back to a gentle, generic message so the UI never breaks.

To get an API key:

1. Go to Google AI Studio / Google Cloud console.
2. Create or reuse a Gemini API key.
3. Put that key in `GEMINI_API_KEY` in `.env.local`.

---

## 6. Deploying on Vercel

1. Push this project to a GitHub / GitLab / Bitbucket repo (optional but recommended).
2. In Vercel:
   - **New Project → Import** this repo (or link from local using `vercel` CLI).
   - Framework will be auto-detected as **Next.js**.
3. In the project’s **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Trigger a deployment.

Once deployed, your Signls app will be available at your Vercel URL. You can then log in, record check-ins, and see AI reflections from anywhere.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
