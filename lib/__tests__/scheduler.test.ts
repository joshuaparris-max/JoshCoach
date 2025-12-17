import { describe, test, expect } from "vitest";
import { calculateNextReview } from "../scheduler";

describe("SM-2 Scheduler", () => {
  test("first review schedules for 1 day", () => {
    const result = calculateNextReview(4, 2.5, 0, 0);
    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  test("quality < 3 resets interval", () => {
    const result = calculateNextReview(2, 2.5, 14, 3);
    expect(result.intervalDays).toBe(1);
    expect(result.repetitions).toBe(0);
  });

  test("easiness factor adjusts based on quality", () => {
    const result = calculateNextReview(5, 2.5, 6, 1);
    expect(result.easinessFactor).toBe(2.5);
  });
});
