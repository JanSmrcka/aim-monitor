"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MonitorFeedPreview } from "@/components/monitoring/MonitorFeedPreview";
import { ArrowRight, Plus } from "lucide-react";

interface BoardTask {
  id: string;
  title: string;
  scope: string | null;
  frequency: string | null;
  updatedAt: string;
}

function formatDate(date: string): string {
  const parsed = new Date(date);
  if (!Number.isFinite(parsed.getTime())) return "updated recently";
  return parsed.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MonitorBoard({ tasks }: { tasks: BoardTask[] }) {
  if (tasks.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="w-full max-w-xl rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/55 p-8 text-center">
          <p className="font-heading text-xl font-semibold text-zinc-100">No monitors yet</p>
          <p className="mt-2 text-sm text-zinc-400">Create your first monitor and we will surface a live feed here.</p>
          <Button asChild className="mt-5 rounded-xl bg-amber-300 text-zinc-950 hover:bg-amber-200">
            <Link href="/dashboard/new">
              <Plus className="mr-2 h-4 w-4" />
              New Monitor
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-3 md:p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Dashboard</p>
          <h2 className="font-heading text-xl font-semibold text-zinc-100">Monitor Activity</h2>
        </div>
        <Button asChild className="rounded-xl bg-amber-300 text-zinc-950 hover:bg-amber-200">
          <Link href="/dashboard/new">
            <Plus className="mr-2 h-4 w-4" />
            New Monitor
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        {tasks.map((task) => (
          <article
            key={task.id}
            className="rounded-2xl border border-zinc-800/85 bg-zinc-900/60 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-semibold leading-snug text-zinc-100">{task.title}</h3>
                <p className="mt-0.5 text-xs text-zinc-500">Updated {formatDate(task.updatedAt)}</p>
              </div>
              {task.frequency ? (
                <Badge className="shrink-0 border border-amber-300/20 bg-amber-300/10 text-[10px] uppercase tracking-[0.14em] text-amber-200">
                  {task.frequency}
                </Badge>
              ) : null}
            </div>

            <p className="mb-3 text-sm text-zinc-300">
              {task.scope && task.scope.length > 0 ? task.scope : "No scope set yet"}
            </p>

            <div className="mb-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-2.5">
              <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">Latest 3 updates</p>
              <MonitorFeedPreview
                taskId={task.id}
                seed={{
                  title: task.title,
                  scope: task.scope,
                  frequency: task.frequency,
                }}
              />
            </div>

            <Button asChild variant="ghost" className="w-full justify-between rounded-xl text-zinc-200 hover:bg-zinc-800/70 hover:text-zinc-100">
              <Link href={`/dashboard/monitors/${task.id}`}>
                Open monitor
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
