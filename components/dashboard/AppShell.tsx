"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useState } from "react";

interface AppShellProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const { data: tasks = [], isLoading } = useTasks();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNewChat = () => {
    // TODO: reset chat state
  };

  const handleSelectTask = (_id: string) => {
    // TODO: load task
  };

  const sidebarContent = (
    <Sidebar
      tasks={tasks}
      isLoading={isLoading}
      onNewChat={handleNewChat}
      onSelectTask={handleSelectTask}
    />
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">{sidebarContent}</div>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="absolute left-2 top-2 z-50">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          {sidebarContent}
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <div className="md:hidden w-8" /> {/* spacer for mobile menu btn */}
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <UserMenu user={user} />
        </header>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
