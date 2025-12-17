"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUALITY_LABELS: Record<number, string> = {
  0: "Complete blackout",
  1: "Incorrect guess",
  2: "Incorrect but felt easy",
  3: "Correct with effort",
  4: "Correct with hesitation",
  5: "Perfect recall",
};

interface QualityRatingProps {
  value: number | null;
  onChange: (value: number) => void;
}

export function QualityRating({ value, onChange }: QualityRatingProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold">Rate your recall quality</p>
      <div className="grid gap-2 sm:grid-cols-3">
        {Object.entries(QUALITY_LABELS).map(([score, label]) => {
          const numericScore = Number(score);
          const isSelected = value === numericScore;
          const labelStyle = isSelected
            ? "text-primary-foreground/80"
            : "text-muted-foreground";
          return (
            <Button
              key={score}
              type="button"
              variant={isSelected ? "default" : "outline"}
              className={cn("justify-start", isSelected && "shadow-sm")}
              onClick={() => onChange(numericScore)}
            >
              <span className="mr-2 font-semibold">{score}</span>
              <span className={cn("text-xs", labelStyle)}>{label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export const QUALITY_LABELS_MAP = QUALITY_LABELS;
