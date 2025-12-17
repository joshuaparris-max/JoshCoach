import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReminderCard } from "@/components/dashboard/ReminderCard";

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

function calculateStreak(dates: Date[]) {
  if (dates.length === 0) return 0;

  const dateSet = new Set(dates.map((date) => getDateKey(date)));
  let streak = 0;
  const cursor = new Date();

  while (dateSet.has(getDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default async function DashboardPage() {
  const now = new Date();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfWindow = new Date(startOfToday);
  endOfWindow.setDate(endOfWindow.getDate() + 6);
  endOfWindow.setHours(23, 59, 59, 999);

  const reviewsDue = await db.reviewItem.count({
    where: {
      dueAt: {
        lte: now,
      },
    },
  });

  const upcomingItems = await db.reviewItem.findMany({
    where: {
      dueAt: {
        gte: startOfToday,
        lte: endOfWindow,
      },
    },
    select: { dueAt: true },
  });

  const countsByDate = upcomingItems.reduce<Record<string, number>>((acc, item) => {
    const key = getLocalDateKey(item.dueAt);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const upcomingDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfToday);
    date.setDate(date.getDate() + index);
    const key = getLocalDateKey(date);
    return {
      key,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      count: countsByDate[key] ?? 0,
    };
  });

  const reviewsDueTomorrow = upcomingDays[1]?.count ?? 0;

  const lessons = await db.lesson.findMany({
    include: {
      topic: true,
      attempts: {
        select: { id: true },
      },
    },
    orderBy: [{ topic: { order: "asc" } }, { order: "asc" }],
  });

  const nextLesson = lessons.find((lesson) => lesson.attempts.length === 0) ?? null;

  const lastAttempt = await db.quizAttempt.findFirst({
    orderBy: { createdAt: "desc" },
    include: { lesson: true },
  });

  const recentAttempts = await db.questionAttempt.findMany({
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const recentReviews = await db.reviewItem.findMany({
    where: { lastReviewedAt: { not: null } },
    select: { lastReviewedAt: true },
    orderBy: { lastReviewedAt: "desc" },
    take: 200,
  });

  const streak = calculateStreak([
    ...recentAttempts.map((attempt) => attempt.createdAt),
    ...recentReviews
      .map((review) => review.lastReviewedAt)
      .filter((date): date is Date => Boolean(date)),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border/70 bg-card/80 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">
            Daily ritual
          </p>
          <h1 className="display-font text-4xl font-semibold">Today&apos;s Plan</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Keep the learning loop tight: read, quiz, review. Small reps, lasting recall.
          </p>
        </div>
        <Badge variant="secondary">Streak: {streak} day{streak === 1 ? "" : "s"}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-sheen">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Reviews Due</CardTitle>
            {reviewsDue > 0 ? <Badge variant="secondary">Overdue</Badge> : null}
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              You have {reviewsDue} review{reviewsDue === 1 ? "" : "s"} due.
            </p>
            <p className="text-xs text-muted-foreground">
              {reviewsDueTomorrow} due by tomorrow night.
            </p>
            <Button asChild>
              <Link href="/review">
                {reviewsDue > 0 ? "Start review" : "View review queue"}
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-sheen">
          <CardHeader>
            <CardTitle>Next Lesson</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextLesson ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">{nextLesson.topic.title}</p>
                  <p className="text-lg font-semibold">{nextLesson.title}</p>
                </div>
                <Button asChild>
                  <Link href={`/lessons/${nextLesson.id}`}>Continue lesson</Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                You have completed all lessons. Review to keep memories fresh.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="card-sheen">
        <CardHeader>
          <CardTitle>Upcoming Review Load</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {upcomingDays.map((day) => {
              const max = Math.max(1, ...upcomingDays.map((d) => d.count));
              const height = Math.max(10, Math.round((day.count / max) * 64));
              return (
                <div key={day.key} className="flex flex-col items-center gap-2 text-xs">
                  <div className="flex h-20 items-end">
                    <div
                      className="w-6 rounded-full bg-[linear-gradient(180deg,_hsl(var(--primary))_0%,_hsl(174_60%_40%)_100%)]"
                      style={{ height }}
                      title={`${day.count} due`}
                    />
                  </div>
                  <span className="text-muted-foreground">{day.label}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            A quick glance at the next seven days of reviews.
          </p>
        </CardContent>
      </Card>

      <Card className="card-sheen">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="secondary" asChild>
            <Link href="/topics">Browse topics</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/review">Review due items</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/rituals">Log rituals</Link>
          </Button>
          {lastAttempt ? (
            <Button asChild>
              <Link href={`/lessons/${lastAttempt.lessonId}`}>
                Resume: {lastAttempt.lesson.title}
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <ReminderCard />
    </div>
  );
}
