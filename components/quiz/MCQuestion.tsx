"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface MCQuestionProps {
  question: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function MCQuestion({
  question,
  options,
  selected,
  onSelect,
  disabled,
}: MCQuestionProps) {
  return (
    <div className="space-y-4">
      <p className="text-base font-medium">{question}</p>
      <RadioGroup value={selected} onValueChange={onSelect} disabled={disabled}>
        {options.map((option, index) => {
          const id = `option-${index}`;
          return (
            <label
              key={id}
              htmlFor={id}
              className="flex items-center gap-3 rounded-md border border-border p-3 text-sm transition hover:bg-accent"
            >
              <RadioGroupItem id={id} value={String(index)} />
              <span>{option}</span>
            </label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
