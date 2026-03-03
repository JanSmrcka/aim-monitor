"use client";

import { Badge } from "@/components/ui/badge";

interface TaskItem {
  id: string;
  title: string;
  scope?: string | null;
  frequency?: string | null;
  config?: { frequency?: string; scope?: string };
}

interface TaskListProps {
  tasks: TaskItem[];
  isLoading: boolean;
  onSelectTask: (id: string) => void;
  selectedTaskId?: string;
}

export function TaskList({ tasks, isLoading, onSelectTask, selectedTaskId }: TaskListProps) {
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
        (() => {
          const scope = task.scope ?? task.config?.scope;
          const frequency = task.frequency ?? task.config?.frequency;
          const isActive = selectedTaskId === task.id;

          return (
            <button
              key={task.id}
              onClick={() => onSelectTask(task.id)}
              className={`group w-full overflow-hidden rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50 ${
                isActive
                  ? "border-amber-300/55 bg-zinc-900 shadow-[0_0_0_1px_rgba(251,191,36,0.2)_inset]"
                  : "border-zinc-800/80 bg-zinc-900/70 hover:border-amber-300/35 hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p
                    title={task.title}
                    className={`max-w-full whitespace-normal break-words text-sm font-medium leading-snug transition ${
                      isActive ? "text-amber-100" : "text-zinc-100 group-hover:text-amber-100"
                    }`}
                  >
                    {task.title}
                  </p>
                  {scope ? (
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{scope}</p>
                  ) : (
                    <p className="mt-0.5 text-xs text-zinc-600">No scope defined yet</p>
                  )}
                </div>

                {frequency && (
                  <Badge
                    variant="secondary"
                    className="ml-2 shrink-0 border border-amber-300/20 bg-amber-300/10 text-[10px] uppercase tracking-[0.14em] text-amber-200"
                  >
                    {frequency}
                  </Badge>
                )}
              </div>
            </button>
          );
        })()
      ))}
    </div>
  );
}
