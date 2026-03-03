"use client";

import type { MonitoringTask } from "@/lib/types";
import { cn } from "@/lib/utils";

const segments = [
  { key: "scope", label: "Scope" },
  { key: "entities", label: "Entities" },
  { key: "sources", label: "Sources" },
  { key: "frequency", label: "Frequency" },
] as const;

function isFieldDefined(task: MonitoringTask, key: string): boolean {
  const val = task[key as keyof MonitoringTask];
  if (val === undefined || val === null) return false;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === "string") return val.length > 0;
  return true;
}

export function ProgressBar({ task }: { task: MonitoringTask }) {
  const completed = segments.filter((s) => isFieldDefined(task, s.key)).length;

  return (
    <div data-testid="progress-bar" className="space-y-2">
      <div className="flex justify-between text-[10px] uppercase tracking-[0.16em] text-zinc-500">
        <span>Progress</span>
        <span>{completed}/{segments.length}</span>
      </div>
      <div className="flex gap-1">
        {segments.map((s) => (
          <div
            key={s.key}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              isFieldDefined(task, s.key) ? "bg-amber-300" : "bg-zinc-800"
            )}
            title={s.label}
          />
        ))}
      </div>
    </div>
  );
}
