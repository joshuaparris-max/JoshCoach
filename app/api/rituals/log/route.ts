import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function POST(req: NextRequest) {
  const { ritualId, dateKey, completed } = (await req.json()) as {
    ritualId: string;
    dateKey: string;
    completed: boolean;
  };

  if (!ritualId || !dateKey || typeof completed !== "boolean") {
    return NextResponse.json(
      { success: false, error: "Invalid payload" },
      { status: 400 }
    );
  }

  const date = parseDateKey(dateKey);

  if (completed) {
    await db.ritualLog.upsert({
      where: { ritualId_date: { ritualId, date } },
      update: {},
      create: { ritualId, date },
    });
  } else {
    await db.ritualLog.deleteMany({
      where: { ritualId, date },
    });
  }

  return NextResponse.json({ success: true });
}
