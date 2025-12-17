import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { QuestionPayload } from "@/lib/types";
import { QuizClient } from "./quiz-client";

interface QuizPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { lessonId } = await params;
  const lesson = await db.lesson.findUnique({
    where: { id: lessonId },
    include: {
      questions: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  const questions: QuestionPayload[] = lesson.questions.map((question) => ({
    id: question.id,
    type: question.type === "mcq" ? "mcq" : "short_answer",
    question: question.question,
    options: question.options ? JSON.parse(question.options) : null,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
  }));

  return (
    <QuizClient
      lessonId={lesson.id}
      lessonTitle={lesson.title}
      questions={questions}
    />
  );
}
