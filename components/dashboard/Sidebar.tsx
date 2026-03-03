"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { TaskList } from "@/components/dashboard/TaskList";
import { Plus } from "lucide-react";

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
    <div className="flex h-full w-[280px] flex-col border-r bg-background">
      <div className="p-3">
        <Button onClick={onNewChat} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Monitor
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div data-testid="sidebar-skeleton" className="space-y-2 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 animate-pulse rounded-md bg-muted" />
            ))}
          </div>
        ) : (
          <TaskList tasks={tasks} isLoading={false} onSelectTask={onSelectTask} />
        )}
      </ScrollArea>
    </div>
  );
}
