"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "jc-reminder";

type ReminderState = {
  enabled: boolean;
  time: string;
  lastFiredDate: string | null;
};

const defaultState: ReminderState = {
  enabled: false,
  time: "20:00",
  lastFiredDate: null,
};

function loadState(): ReminderState {
  if (typeof window === "undefined") return defaultState;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultState;
  try {
    const parsed = JSON.parse(raw) as ReminderState;
    if (typeof parsed.time !== "string") return defaultState;
    return parsed;
  } catch {
    return defaultState;
  }
}

function saveState(state: ReminderState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function notify() {
  if (typeof window === "undefined") return;
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification("JoshCoach reminder", {
        body: "Time for a quick review session.",
      });
      return;
    }
  }
  alert("JoshCoach reminder: time for a quick review session.");
}

export function ReminderCard() {
  const [state, setState] = useState<ReminderState>(defaultState);

  useEffect(() => {
    setState(loadState());
  }, []);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!state.enabled) return;

    const interval = window.setInterval(() => {
      const now = new Date();
      const [hours, minutes] = state.time.split(":").map(Number);
      if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      const today = now.toISOString().slice(0, 10);

      if (currentTime === state.time && state.lastFiredDate !== today) {
        notify();
        setState((prev) => ({ ...prev, lastFiredDate: today }));
      }
    }, 30000);

    return () => window.clearInterval(interval);
  }, [state.enabled, state.time, state.lastFiredDate]);

  return (
    <Card className="card-sheen">
      <CardHeader>
        <CardTitle>Local Reminder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          Optional daily reminder while the app is open.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="time"
            value={state.time}
            onChange={(event) =>
              setState((prev) => ({ ...prev, time: event.target.value }))
            }
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button
            variant={state.enabled ? "default" : "outline"}
            onClick={async () => {
              if ("Notification" in window && Notification.permission === "default") {
                await Notification.requestPermission();
              }
              setState((prev) => ({ ...prev, enabled: !prev.enabled }));
            }}
          >
            {state.enabled ? "Reminder on" : "Enable reminder"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          This reminder only runs while this tab is open.
        </p>
      </CardContent>
    </Card>
  );
}
