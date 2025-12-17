import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TopicDetailProps {
  params: Promise<{ id: string }>;
}

export default async function TopicDetailPage({ params }: TopicDetailProps) {
  const { id } = await params;
  const topic = await db.topic.findUnique({
    where: { id },
    include: {
      lessons: {
        include: {
          attempts: {
            select: { id: true, score: true, total: true, createdAt: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { order: "asc" },
      },
    },
  });

  if (!topic) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Topic focus
        </p>
        <h1 className="display-font text-4xl font-semibold">{topic.title}</h1>
        <p className="text-muted-foreground">{topic.description}</p>
      </div>

      <div className="grid gap-4">
        {topic.lessons.map((lesson) => {
          const latestAttempt = lesson.attempts[0] ?? null;
          const completed = Boolean(latestAttempt);
          return (
            <Card key={lesson.id} className="card-sheen">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{lesson.title}</CardTitle>
                  {completed ? <Badge>Completed</Badge> : <Badge variant="outline">New</Badge>}
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    {completed
                      ? "Review the lesson and reinforce key ideas."
                      : "Start this lesson to begin your learning loop."}
                  </p>
                  {latestAttempt ? (
                    <p className="text-xs text-muted-foreground">
                      Last score: {latestAttempt.score}/{latestAttempt.total} (
                      {Math.round(
                        (latestAttempt.score / Math.max(latestAttempt.total, 1)) * 100
                      )}
                      %) • {latestAttempt.createdAt.toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Open lesson
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
