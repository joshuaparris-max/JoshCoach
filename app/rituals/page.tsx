import { db } from "@/lib/db";
import { RitualsClient } from "./rituals-client";

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export default async function RitualsPage() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const rituals = await db.ritual.findMany({
    include: {
      logs: {
        where: {
          date: {
            gte: weekStart,
            lte: weekEnd,
          },
        },
      },
    },
    orderBy: [{ cadence: "asc" }, { order: "asc" }],
  });

  const payload = rituals.map((ritual) => ({
    id: ritual.id,
    title: ritual.title,
    description: ritual.description,
    cadence: ritual.cadence,
    logs: ritual.logs.map((log) => getDateKey(log.date)),
  }));

  return (
    <RitualsClient
      rituals={payload}
      todayKey={getDateKey(today)}
      weekKey={getDateKey(weekStart)}
    />
  );
}
