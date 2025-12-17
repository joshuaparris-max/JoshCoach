export function masteryFromEasinessFactor(easinessFactor?: number | null) {
  if (!easinessFactor) return 0;
  const minEf = 1.3;
  const maxEf = 2.5;
  const normalized = (easinessFactor - minEf) / (maxEf - minEf);
  return Math.max(0, Math.min(1, normalized)) * 100;
}

export function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateStreak(dates: Date[]) {
  if (dates.length === 0) return 0;

  const dateSet = new Set(dates.map((date) => date.toISOString().slice(0, 10)));
  let streak = 0;
  const cursor = new Date();

  while (dateSet.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
