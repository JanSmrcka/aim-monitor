"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TaskList } from "@/components/dashboard/TaskList";
import { Plus, Radar } from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  config: { frequency?: string; scope?: string };
}

interface SidebarProps {
  tasks: TaskItem[];
  isLoading: boolean;
  onNewChat: () => void;
  onSelectTask: (id: string) => void;
}

export function Sidebar({ tasks, isLoading, onNewChat, onSelectTask }: SidebarProps) {
  return (
    <div className="flex h-full w-[280px] min-h-0 flex-col">
      <div className="space-y-3 border-b border-amber-100/10 px-3 py-3">
        <div className="flex items-center justify-between rounded-xl border border-amber-100/15 bg-zinc-900/70 px-3 py-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">Workspace</p>
            <p className="font-heading text-sm font-semibold text-zinc-100">Active Monitors</p>
          </div>
          <Radar className="h-4 w-4 text-amber-300" />
        </div>

        <Button
          onClick={onNewChat}
          className="w-full justify-start rounded-xl bg-amber-300 px-3 text-zinc-950 hover:bg-amber-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Monitor
        </Button>
      </div>

      <div className="px-3 pb-2 pt-3">
        <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-500">Recent monitors</p>
      </div>

      <Separator />
      <ScrollArea className="min-h-0 flex-1">
        {isLoading ? (
          <div data-testid="sidebar-skeleton" className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-xl bg-zinc-800/70" />
            ))}
          </div>
        ) : (
          <TaskList tasks={tasks} isLoading={false} onSelectTask={onSelectTask} />
        )}
      </ScrollArea>
    </div>
  );
}
