"use client";

import { Badge } from "@/components/ui/badge";

interface TaskItem {
  id: string;
  title: string;
  config: { frequency?: string; scope?: string };
}

interface TaskListProps {
  tasks: TaskItem[];
  isLoading: boolean;
  onSelectTask: (id: string) => void;
}

export function TaskList({ tasks, isLoading, onSelectTask }: TaskListProps) {
  if (isLoading) {
    return (
      <div data-testid="tasklist-skeleton" className="space-y-2 p-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-xl bg-zinc-800/70" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="px-3 py-4">
        <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 px-3 py-4">
          <p className="text-sm text-zinc-300">No monitors yet</p>
          <p className="mt-1 text-xs text-zinc-500">Start a monitor to build your first tracking spec.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 p-2">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onSelectTask(task.id)}
          className="group w-full rounded-xl border border-zinc-800/80 bg-zinc-900/70 px-3 py-2.5 text-left transition hover:border-amber-300/35 hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-zinc-100 transition group-hover:text-amber-100">
                {task.title}
              </p>
              {task.config.scope ? (
                <p className="mt-0.5 truncate text-xs text-zinc-500">{task.config.scope}</p>
              ) : (
                <p className="mt-0.5 text-xs text-zinc-600">No scope defined yet</p>
              )}
            </div>

            {task.config.frequency && (
              <Badge
                variant="secondary"
                className="ml-2 shrink-0 border border-amber-300/20 bg-amber-300/10 text-[10px] uppercase tracking-[0.14em] text-amber-200"
              >
                {task.config.frequency}
              </Badge>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
