# Status — JoshCoach

## What works now (local-first MVP, `index.html`)
- Daily check-in: feeling + what-needs-attention + one-small-next-step.
- Rotating daily focus card (7 seeded reflection cards).
- Reflections saved to localStorage (up to a year), with a clear empty state.
- Streak counter (consecutive days) + reflection count.
- Export reflections as JSON.
- No accounts, no cloud, no AI.

## Also in the repo
- Earlier **Next.js + Prisma** scaffold (richer, DB-backed). Requires a valid `DATABASE_URL`
  to build (`vercel-build` runs prisma migrate/seed). Kept for reference, not the live MVP.

## Next steps
- Optional gentle reminders / "time of day" tone.
- A weekly "looking back" summary of feelings.
- Import reflections from JSON.
- Pick a single direction (static MVP vs Next app) and consolidate.
