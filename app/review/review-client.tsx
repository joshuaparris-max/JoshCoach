"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MCQuestion } from "@/components/quiz/MCQuestion";
import { ShortAnswer } from "@/components/quiz/ShortAnswer";
import { QualityRating, QUALITY_LABELS_MAP } from "@/components/quiz/QualityRating";

interface ReviewItemPayload {
  reviewItemId: string;
  questionId: string;
  type: "mcq" | "short_answer";
  question: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
  lessonTitle: string;
}

interface ReviewClientProps {
  items: ReviewItemPayload[];
}

export function ReviewClient({ items }: ReviewClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [quality, setQuality] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<number[]>([]);

  const current = items[currentIndex];
  const progressValue = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.round((currentIndex / items.length) * 100);
  }, [currentIndex, items.length]);

  const isMcq = current?.type === "mcq";
  const hasAnswer = isMcq ? Boolean(selectedOption) : shortAnswer.trim().length > 0;

  const averageQuality = results.length
    ? Math.round((results.reduce((sum, value) => sum + value, 0) / results.length) * 10) / 10
    : 0;
  const lowQualityCount = results.filter((value) => value <= 2).length;
  const strongCount = results.filter((value) => value >= 4).length;

  const handleCheckAnswer = useCallback(() => {
    if (!hasAnswer) return;
    setShowFeedback(true);
  }, [hasAnswer]);

  const handleSubmitReview = useCallback(async () => {
    if (quality === null || !current) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/review/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewItemId: current.reviewItemId,
          quality,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update review item.");
      }
      setResults((prev) => [...prev, quality]);
      setSelectedOption("");
      setShortAnswer("");
      setQuality(null);
      setShowFeedback(false);
      setCurrentIndex((prev) => prev + 1);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to update review item."
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [current, quality]);

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
          handleSubmitReview();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, current?.options?.length, handleCheckAnswer, handleSubmitReview, isMcq, showFeedback]);

  if (!current) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All done!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            You have completed all due reviews for today.
          </p>
          {results.length > 0 ? (
            <div className="rounded-md border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Session recap</p>
              <p>Average quality: {averageQuality}</p>
              <p>Strong recall (4-5): {strongCount}</p>
              <p>Needs focus (0-2): {lowQualityCount}</p>
            </div>
          ) : null}
          <Button asChild>
            <Link href="/">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const isCorrect = isMcq
    ? selectedOption === current.correctAnswer
    : quality !== null && quality >= 3;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {current.lessonTitle}
        </p>
        <h1 className="display-font text-4xl font-semibold">Review Queue</h1>
      </div>

      <Card className="card-sheen">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Review {currentIndex + 1} of {items.length}
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
              <Button onClick={handleCheckAnswer} disabled={!hasAnswer}>
                Check answer
              </Button>
            ) : (
              <Button
                onClick={handleSubmitReview}
                disabled={quality === null || isSubmitting}
              >
                {currentIndex + 1 === items.length ? "Finish review" : "Next review"}
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/">Back to dashboard</Link>
            </Button>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>
    </div>
  );
}
