import { db } from "@/lib/db";
import { ReviewClient } from "./review-client";

export default async function ReviewPage() {
  const now = new Date();
  const items = await db.reviewItem.findMany({
    where: {
      dueAt: {
        lte: now,
      },
    },
    include: {
      question: {
        include: {
          lesson: true,
        },
      },
    },
    orderBy: {
      dueAt: "asc",
    },
  });

  const mappedItems = items.map((item) => ({
    reviewItemId: item.id,
    questionId: item.questionId,
    type: item.question.type === "mcq" ? "mcq" : "short_answer",
    question: item.question.question,
    options: item.question.options ? JSON.parse(item.question.options) : null,
    correctAnswer: item.question.correctAnswer,
    explanation: item.question.explanation,
    lessonTitle: item.question.lesson.title,
  }));

  return <ReviewClient items={mappedItems} />;
}
