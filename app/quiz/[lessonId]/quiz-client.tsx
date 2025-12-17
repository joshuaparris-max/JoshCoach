"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MCQuestion } from "@/components/quiz/MCQuestion";
import { ShortAnswer } from "@/components/quiz/ShortAnswer";
import { QualityRating, QUALITY_LABELS_MAP } from "@/components/quiz/QualityRating";
import type { AnswerPayload, QuestionPayload } from "@/lib/types";

interface QuizClientProps {
  lessonId: string;
  lessonTitle: string;
  questions: QuestionPayload[];
}

export function QuizClient({ lessonId, lessonTitle, questions }: QuizClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [quality, setQuality] = useState<number | null>(null);
  const [answers, setAnswers] = useState<AnswerPayload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = questions[currentIndex];
  const progressValue = useMemo(() => {
    if (questions.length === 0) return 0;
    return Math.round((currentIndex / questions.length) * 100);
  }, [currentIndex, questions.length]);

  const isMcq = current?.type === "mcq";
  const hasAnswer = isMcq ? Boolean(selectedOption) : shortAnswer.trim().length > 0;

  const lowQualityCount = answers.filter((answer) => answer.quality <= 2).length;
  const strongCount = answers.filter((answer) => answer.quality >= 4).length;
  const averageQuality = answers.length
    ? Math.round(
        (answers.reduce((total, answer) => total + answer.quality, 0) / answers.length) * 10
      ) / 10
    : 0;

  const handleCheckAnswer = useCallback(() => {
    if (!hasAnswer) return;
    setShowFeedback(true);
  }, [hasAnswer]);

  const handleNextQuestion = useCallback(() => {
    if (quality === null || !current) return;

    const nextAnswer: AnswerPayload = {
      questionId: current.id,
      answer: isMcq ? selectedOption : shortAnswer,
      correct: isMcq ? selectedOption === current.correctAnswer : quality >= 3,
      quality,
    };

    setAnswers((prev) => [...prev, nextAnswer]);
    setSelectedOption("");
    setShortAnswer("");
    setQuality(null);
    setShowFeedback(false);
    setCurrentIndex((prev) => prev + 1);
  }, [current, isMcq, quality, selectedOption, shortAnswer]);

  useEffect(() => {
    if (!current) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["TEXTAREA", "INPUT"].includes(target.tagName)) return;

      if (!showFeedback && isMcq && ["1", "2", "3", "4"].includes(event.key)) {
        const index = Number(event.key) - 1;
        if (index >= 0 && index < (current.options?.length ?? 0)) {
          setSelectedOption(String(index));
        }
      }

      if (event.key === "Enter") {
        if (!showFeedback) {
          handleCheckAnswer();
        } else {
          handleNextQuestion();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, current?.options?.length, handleCheckAnswer, handleNextQuestion, isMcq, showFeedback]);

  if (!current && answers.length === questions.length) {
    const score = answers.filter((answer) => answer.correct).length;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz complete</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You answered {score} out of {questions.length} questions correctly.
          </p>
          <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">Session recap</p>
            <p>Average quality: {averageQuality}</p>
            <p>Strong recall (4-5): {strongCount}</p>
            <p>Needs focus (0-2): {lowQualityCount}</p>
          </div>
          {submitted ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Results saved. You can head to the review queue or continue learning.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/review">Go to review queue</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/topics">Browse topics</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={async () => {
                  setIsSubmitting(true);
                  setError(null);
                  try {
                    const response = await fetch("/api/quiz/submit", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ lessonId, answers }),
                    });
                    if (!response.ok) {
                      throw new Error("Failed to save quiz results.");
                    }
                    setSubmitted(true);
                  } catch (submitError) {
                    setError(
                      submitError instanceof Error
                        ? submitError.message
                        : "Failed to save quiz results."
                    );
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save quiz results"}
              </Button>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!current) {
    return null;
  }

  const isCorrect = isMcq
    ? selectedOption === current.correctAnswer
    : quality !== null && quality >= 3;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {lessonTitle}
        </p>
        <h1 className="display-font text-4xl font-semibold">Lesson Quiz</h1>
      </div>

      <Card className="card-sheen">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{progressValue}% complete</span>
          </div>
          <Progress value={progressValue} />
        </CardHeader>
        <CardContent className="space-y-6">
          {isMcq ? (
            <MCQuestion
              question={current.question}
              options={current.options ?? []}
              selected={selectedOption}
              onSelect={setSelectedOption}
              disabled={showFeedback}
            />
          ) : (
            <ShortAnswer
              question={current.question}
              value={shortAnswer}
              onChange={setShortAnswer}
              disabled={showFeedback}
              showSample={showFeedback}
              sampleAnswer={current.correctAnswer}
            />
          )}

          {showFeedback ? (
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
                <p className="font-semibold">
                  {isMcq ? (isCorrect ? "Correct" : "Not quite") : "Reflect"}
                </p>
                <p className="text-muted-foreground">{current.explanation}</p>
              </div>
              <QualityRating value={quality} onChange={setQuality} />
              {quality !== null ? (
                <p className="text-xs text-muted-foreground">
                  Selected: {quality} - {QUALITY_LABELS_MAP[quality]}
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            {!showFeedback ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={!hasAnswer}
              >
                Check answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} disabled={quality === null}>
                {currentIndex + 1 === questions.length ? "Finish quiz" : "Next question"}
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/lessons/${lessonId}`}>Back to lesson</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
