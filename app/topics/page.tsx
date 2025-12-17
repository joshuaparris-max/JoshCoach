import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { average, masteryFromEasinessFactor } from "@/lib/analytics";

export default async function TopicsPage() {
  const topics = await db.topic.findMany({
    include: {
      lessons: {
        include: {
          questions: {
            include: {
              reviewItems: true,
            },
          },
          attempts: {
            select: { id: true },
          },
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Curriculum
        </p>
        <h1 className="display-font text-4xl font-semibold">Topics</h1>
        <p className="text-muted-foreground">
          Focus on one skill at a time, then reinforce it with quizzes.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {topics.map((topic) => {
          const completed = topic.lessons.filter(
            (lesson) => lesson.attempts.length > 0
          ).length;
          const total = topic.lessons.length;
          const progress = total ? Math.round((completed / total) * 100) : 0;
          const questionMastery: number[] = [];
          for (const lesson of topic.lessons) {
            for (const question of lesson.questions) {
              questionMastery.push(
                masteryFromEasinessFactor(question.reviewItems[0]?.easinessFactor)
              );
            }
          }
          const mastery = questionMastery.length
            ? Math.round(average(questionMastery))
            : 0;

          return (
            <Card key={topic.id} className="card-sheen">
              <CardHeader>
                <CardTitle>{topic.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{topic.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground">
                  {completed} of {total} lessons completed
                </p>
                <p className="text-xs text-muted-foreground">
                  Mastery: {mastery}% based on review performance
                </p>
                <Link
                  href={`/topics/${topic.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View topic
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
