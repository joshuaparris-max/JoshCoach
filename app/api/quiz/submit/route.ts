import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateNextReview } from "@/lib/scheduler";
import type { AnswerPayload } from "@/lib/types";

export async function POST(req: NextRequest) {
  const { lessonId, answers } = (await req.json()) as {
    lessonId: string;
    answers: AnswerPayload[];
  };

  if (!lessonId || !Array.isArray(answers)) {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }

  const attempt = await db.quizAttempt.create({
    data: {
      lessonId,
      score: answers.filter((answer) => answer.correct).length,
      total: answers.length,
    },
  });

  for (const answer of answers) {
    await db.questionAttempt.create({
      data: {
        quizAttemptId: attempt.id,
        questionId: answer.questionId,
        answer: answer.answer,
        correct: answer.correct,
        quality: answer.quality,
      },
    });

    const existing = await db.reviewItem.findUnique({
      where: { questionId: answer.questionId },
    });

    if (existing) {
      const update = calculateNextReview(
        answer.quality,
        existing.easinessFactor,
        existing.intervalDays,
        existing.repetitions
      );

      await db.reviewItem.update({
        where: { id: existing.id },
        data: {
          ...update,
          lastReviewedAt: new Date(),
        },
      });
    } else {
      const update = calculateNextReview(answer.quality, 2.5, 0, 0);

      await db.reviewItem.create({
        data: {
          questionId: answer.questionId,
          ...update,
          lastReviewedAt: new Date(),
        },
      });
    }
  }

  return NextResponse.json({ success: true, attemptId: attempt.id });
}
