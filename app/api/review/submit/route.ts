import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateNextReview } from "@/lib/scheduler";

export async function POST(req: NextRequest) {
  const { reviewItemId, quality } = (await req.json()) as {
    reviewItemId: string;
    quality: number;
  };

  if (!reviewItemId || typeof quality !== "number") {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }

  const item = await db.reviewItem.findUnique({
    where: { id: reviewItemId },
  });

  if (!item) {
    return NextResponse.json(
      { success: false, error: "Review item not found" },
      { status: 404 }
    );
  }

  const update = calculateNextReview(
    quality,
    item.easinessFactor,
    item.intervalDays,
    item.repetitions
  );

  await db.reviewItem.update({
    where: { id: reviewItemId },
    data: {
      ...update,
      lastReviewedAt: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
