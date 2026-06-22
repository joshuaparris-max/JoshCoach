# JoshCoach

A personal **micro-learning coaching app** built with Next.js. It turns short lessons into
lasting habits using a tight **read → quiz → spaced-repetition review** loop, plus daily
"rituals" logging and streak tracking.

The seeded content focuses on **relationship and intimacy skills** for couples —
communication, attunement, desire, and connection — but the engine is content-agnostic:
lessons are plain Markdown, so it can coach almost any topic.

## Who it's for

Anyone who wants to **learn a skill area in small, repeated reps** rather than one-off
reading — here, a couple (or individual) building communication and intimacy skills. It's a
single-user personal tool, not a multi-tenant product.

## Features

- **Dashboard** — "Today's Plan", current streak, reviews due, next lesson, and a 7-day
  review-load chart.
- **Lessons** — Markdown content grouped into topics (`content/lessons/*.md`).
- **Quizzes** — per-lesson quizzes that feed the review system.
- **Spaced repetition** — a review queue with due dates to reinforce recall over time.
- **Rituals** — log recurring practices and keep a streak.
- **Summary** — progress overview.

## Tech stack

- **Next.js** (App Router, TypeScript) + Tailwind
- **Prisma** ORM with a SQL database (see `prisma/schema.prisma`, `prisma/seed.ts`)
- **Vitest** for tests

## How to run

```bash
npm install

# configure the database connection
cp .env.example .env   # if present; otherwise create .env with DATABASE_URL=...

# set up schema + seed content
npx prisma migrate dev
npx prisma db seed

npm run dev            # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm test`.

> **Note:** the app requires a database connection (`DATABASE_URL`). `npm run build` /
> `vercel-build` run Prisma generate/migrate/seed, so they won't complete without one.

## Status

**Working prototype.** Core loop (lessons, quizzes, reviews, rituals, dashboard) is
implemented with a polished UI. Single-user, local/self-hosted; no authentication layer.

## Sensible next improvements

- Add `.env.example` documenting `DATABASE_URL` and any other required vars.
- Optional authentication if it ever needs to be more than single-user.
- A content-authoring guide (lesson + quiz Markdown format).
- Seed-content toggle so the engine can be reused for other subject areas.
