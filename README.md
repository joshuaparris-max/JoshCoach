# 🌱 JoshCoach — Personal Growth Micro-Coach

A gentle, **local-first** daily coaching app for tiny growth: a daily check-in, a small deck of
reflection cards, saved reflections, and a quiet streak. Warm and practical — not clinical, not
cheesy. No accounts, no cloud, no AI.

## The daily check-in

1. **How am I feeling?** (pick a word)
2. **What needs my attention?**
3. **One small faithful next step.**

A rotating "focus card" sets the tone each day. Reflections are saved to **localStorage** and
shown in a gentle history; a streak counter encourages showing up, kindly.

## Run (the MVP)

The working app is a single static file — open it directly:

```bash
start index.html        # Windows — or
python -m http.server 8000
```

> **Note on the two versions in this repo.** The runnable MVP above is intentionally
> dependency-free and local-first. The repository also contains an earlier **Next.js + Prisma**
> scaffold (`app/`, `prisma/`) which requires a PostgreSQL `DATABASE_URL` to build/run — it is
> kept for reference but is **not** the current direction. The local-first static app is the
> live MVP.

## Status

See [STATUS.md](STATUS.md). **Working MVP** — check-in flow, 7 cards, saved reflections, streak,
clear empty states.

## Screenshots
_Add screenshots to `docs/` and link them here._

## Privacy
All reflections stay in your browser. Nothing is transmitted. No AI calls, no auth.
