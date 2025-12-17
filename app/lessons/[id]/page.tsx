import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LessonPageProps {
  params: Promise<{ id: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id } = await params;
  const lesson = await db.lesson.findUnique({
    where: { id },
    include: { topic: true },
  });

  if (!lesson) {
    notFound();
  }

  const [attemptStats, latestAttempt] = await Promise.all([
    db.quizAttempt.aggregate({
      where: { lessonId: id },
      _sum: { score: true, total: true },
      _count: { _all: true },
    }),
    db.quizAttempt.findFirst({
      where: { lessonId: id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalScore = attemptStats._sum.score ?? 0;
  const totalQuestions = attemptStats._sum.total ?? 0;
  const accuracy = totalQuestions ? Math.round((totalScore / totalQuestions) * 100) : 0;
  const attemptCount = attemptStats._count._all;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {lesson.topic.title}
        </p>
        <h1 className="display-font text-4xl font-semibold">{lesson.title}</h1>
      </div>

      <Card className="card-sheen">
        <CardHeader>
          <CardTitle>Lesson Progress</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Attempts
            </p>
            <p className="text-lg font-semibold text-foreground">{attemptCount}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Accuracy
            </p>
            <p className="text-lg font-semibold text-foreground">{accuracy}%</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Last Attempt
            </p>
            <p className="text-lg font-semibold text-foreground">
              {latestAttempt
                ? latestAttempt.createdAt.toLocaleDateString()
                : "Not yet"}
            </p>
          </div>
        </CardContent>
      </Card>

      <article className="prose max-w-none rounded-3xl border border-border/70 bg-card/85 p-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content}</ReactMarkdown>
      </article>

      <div className="flex items-center gap-3">
        <Button asChild>
          <Link href={`/quiz/${lesson.id}`}>Take the quiz</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/topics/${lesson.topicId}`}>Back to topic</Link>
        </Button>
      </div>
    </div>
  );
}
