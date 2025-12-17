export interface ReviewUpdate {
  easinessFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: Date;
}

export function calculateNextReview(
  quality: number,
  currentEF: number,
  currentInterval: number,
  currentReps: number
): ReviewUpdate {
  let newEF =
    currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEF = Math.max(1.3, Math.min(2.5, newEF));

  let newInterval: number;
  let newReps: number;

  if (quality < 3) {
    // Lapses reset the repetition streak to rebuild memory traces.
    newInterval = 1;
    newReps = 0;
  } else {
    if (currentReps === 0) {
      newInterval = 1;
    } else if (currentReps === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(currentInterval * newEF);
    }
    newReps = currentReps + 1;
  }

  newInterval = Math.min(newInterval, 180);

  const dueAt = new Date();
  dueAt.setDate(dueAt.getDate() + newInterval);

  return {
    easinessFactor: newEF,
    intervalDays: newInterval,
    repetitions: newReps,
    dueAt,
  };
}
