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
          <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <p className="px-3 py-4 text-sm text-muted-foreground">No monitors yet</p>
    );
  }

  return (
    <div className="space-y-1 p-2">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onSelectTask(task.id)}
          className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-muted"
        >
          <span className="truncate">{task.title}</span>
          {task.config.frequency && (
            <Badge variant="secondary" className="ml-2 shrink-0">
              {task.config.frequency}
            </Badge>
          )}
        </button>
      ))}
    </div>
  );
}
