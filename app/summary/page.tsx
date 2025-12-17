import Link from "next/link";
import { db } from "@/lib/db";
import { average, calculateStreak, masteryFromEasinessFactor } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export default async function SummaryPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(today);
  start.setDate(start.getDate() - 6);

  const quizAttempts = await db.quizAttempt.findMany({
    where: { createdAt: { gte: start } },
    orderBy: { createdAt: "desc" },
  });

  const reviewItems = await db.reviewItem.findMany({
    where: { lastReviewedAt: { gte: start } },
    select: { lastReviewedAt: true },
  });

  const dailyRitualCount = await db.ritual.count({
    where: { cadence: "daily" },
  });

  const ritualLogs = await db.ritualLog.findMany({
    where: { date: { gte: start } },
  });

  const streak = calculateStreak([
    ...quizAttempts.map((attempt) => attempt.createdAt),
    ...reviewItems
      .map((item) => item.lastReviewedAt)
      .filter((date): date is Date => Boolean(date)),
    ...ritualLogs.map((log) => log.date),
  ]);

  const dayKeys = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + index);
    return getDateKey(date);
  });

  const ritualCounts = ritualLogs.reduce<Record<string, number>>((acc, log) => {
    const key = getDateKey(log.date);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const ritualAdherence = dailyRitualCount
    ? Math.round((average(dayKeys.map((key) => (ritualCounts[key] ?? 0) / dailyRitualCount)) || 0) * 100)
    : 0;

  const topics = await db.topic.findMany({
    include: {
      lessons: {
        include: {
          questions: {
            include: {
              reviewItems: true,
            },
          },
        },
      },
    },
    orderBy: { order: "asc" },
  });

  const masteryByTopic = topics.map((topic) => {
    const questionMastery: number[] = [];
    for (const lesson of topic.lessons) {
      for (const question of lesson.questions) {
        const reviewItem = question.reviewItems[0];
        questionMastery.push(masteryFromEasinessFactor(reviewItem?.easinessFactor));
      }
    }
    const mastery = questionMastery.length ? Math.round(average(questionMastery)) : 0;
    return { id: topic.id, title: topic.title, mastery };
  });

  const weakestTopics = masteryByTopic
    .filter((topic) => topic.mastery < 70)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Weekly summary
        </p>
        <h1 className="display-font text-4xl font-semibold">Your Week in Review</h1>
        <p className="text-muted-foreground">
          Small steps add up. Review your rhythms and focus areas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-sheen">
          <CardHeader>
            <CardTitle>Activity streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{streak} days</p>
            <p className="text-sm text-muted-foreground">Any quiz, review, or ritual.</p>
          </CardContent>
        </Card>
        <Card className="card-sheen">
          <CardHeader>
            <CardTitle>Ritual adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{ritualAdherence}%</p>
            <p className="text-sm text-muted-foreground">Daily rituals completed.</p>
          </CardContent>
        </Card>
        <Card className="card-sheen">
          <CardHeader>
            <CardTitle>Quiz attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{quizAttempts.length}</p>
            <p className="text-sm text-muted-foreground">Attempts in the last 7 days.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="card-sheen">
        <CardHeader>
          <CardTitle>Weakest areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weakestTopics.length === 0 ? (
            <p className="text-sm text-muted-foreground">Great work! No weak topics yet.</p>
          ) : (
            <div className="space-y-2">
              {weakestTopics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{topic.title}</span>
                  <span className="text-sm font-semibold">{topic.mastery}%</span>
                </div>
              ))}
            </div>
          )}
          <Button variant="outline" asChild>
            <Link href="/topics">Review topics</Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="card-sheen">
        <CardHeader>
          <CardTitle>Reflection prompt</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>What is one idea you want to apply this week?</p>
          <p>What is one ritual that felt most helpful?</p>
          <p>Where do you want to slow down or ask for support?</p>
        </CardContent>
      </Card>
    </div>
  );
}
