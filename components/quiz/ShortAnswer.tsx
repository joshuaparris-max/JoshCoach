"use client";

import { Textarea } from "@/components/ui/textarea";

interface ShortAnswerProps {
  question: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showSample?: boolean;
  sampleAnswer?: string;
}

export function ShortAnswer({
  question,
  value,
  onChange,
  disabled,
  showSample,
  sampleAnswer,
}: ShortAnswerProps) {
  return (
    <div className="space-y-4">
      <p className="text-base font-medium">{question}</p>
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder="Write your response..."
      />
      {showSample && sampleAnswer ? (
        <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
          <p className="font-semibold">Sample answer</p>
          <p className="text-muted-foreground">{sampleAnswer}</p>
        </div>
      ) : null}
    </div>
  );
}
