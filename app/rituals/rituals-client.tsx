"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RitualPayload {
  id: string;
  title: string;
  description: string;
  cadence: "daily" | "weekly" | string;
  logs: string[];
}

interface RitualsClientProps {
  rituals: RitualPayload[];
  todayKey: string;
  weekKey: string;
}

export function RitualsClient({ rituals, todayKey, weekKey }: RitualsClientProps) {
  const [items, setItems] = useState(rituals);
  const [saving, setSaving] = useState<string | null>(null);

  const daily = items.filter((ritual) => ritual.cadence === "daily");
  const weekly = items.filter((ritual) => ritual.cadence === "weekly");

  async function toggleRitual(ritual: RitualPayload, completed: boolean, dateKey: string) {
    setSaving(ritual.id);
    try {
      const response = await fetch("/api/rituals/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ritualId: ritual.id, dateKey, completed }),
      });
      if (!response.ok) {
        throw new Error("Failed to update ritual.");
      }

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== ritual.id) return item;
          const nextLogs = completed
            ? Array.from(new Set([...item.logs, dateKey]))
            : item.logs.filter((log) => log !== dateKey);
          return { ...item, logs: nextLogs };
        })
      );
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Rituals</p>
        <h1 className="display-font text-4xl font-semibold">Connection Checklist</h1>
        <p className="text-muted-foreground">
          Keep small rituals consistent to build safety and momentum.
        </p>
      </div>

      <Card className="card-sheen">
        <CardHeader>
          <CardTitle>Daily rituals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {daily.map((ritual) => {
            const completed = ritual.logs.includes(todayKey);
            return (
              <div
                key={ritual.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border/60 bg-card/70 p-4"
              >
                <div>
                  <p className="text-base font-semibold">{ritual.title}</p>
                  <p className="text-sm text-muted-foreground">{ritual.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={completed ? "default" : "outline"}
                  onClick={() => toggleRitual(ritual, !completed, todayKey)}
                  disabled={saving === ritual.id}
                >
                  {completed ? "Done" : "Mark done"}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="card-sheen">
        <CardHeader>
          <CardTitle>Weekly rituals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weekly.map((ritual) => {
            const completed = ritual.logs.includes(weekKey);
            return (
              <div
                key={ritual.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-border/60 bg-card/70 p-4"
              >
                <div>
                  <p className="text-base font-semibold">{ritual.title}</p>
                  <p className="text-sm text-muted-foreground">{ritual.description}</p>
                </div>
                <Button
                  size="sm"
                  variant={completed ? "default" : "outline"}
                  onClick={() => toggleRitual(ritual, !completed, weekKey)}
                  disabled={saving === ritual.id}
                >
                  {completed ? "Done" : "Mark done"}
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
