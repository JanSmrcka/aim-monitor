"use client";

import { Sidebar } from "@/components/dashboard/Sidebar";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sparkles } from "lucide-react";
import { useTasks } from "@/lib/hooks/use-tasks";
import { useChatContext } from "@/lib/chat-context";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

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
  const { resetChat } = useChatContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const selectedTaskId =
    pathname.startsWith("/dashboard/monitors/") ? pathname.replace("/dashboard/monitors/", "") : undefined;

  const handleNewChat = () => {
    resetChat();
    setSidebarOpen(false);
    router.push("/dashboard");
  };

  const handleSelectTask = (id: string) => {
    setSidebarOpen(false);
    router.push(`/dashboard/monitors/${id}`);
  };

  const sidebarContent = (
    <Sidebar
      tasks={tasks}
      isLoading={isLoading}
      onNewChat={handleNewChat}
      onSelectTask={handleSelectTask}
      selectedTaskId={selectedTaskId}
    />
  );

  return (
    <div className="relative h-dvh overflow-hidden bg-[#06070A] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(217,119,6,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_38%)]" />

      <div className="relative grid h-full grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden min-h-0 border-r border-amber-100/10 bg-zinc-950/80 backdrop-blur-xl md:block">
          {sidebarContent}
        </aside>

        <div className="flex min-h-0 flex-col">
          <header className="border-b border-amber-100/10 bg-zinc-950/65 px-3 py-2 backdrop-blur-xl md:px-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild className="md:hidden">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-zinc-300 hover:bg-zinc-800/70 hover:text-zinc-100"
                    >
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[286px] border-amber-100/10 bg-zinc-950 p-0">
                    {sidebarContent}
                  </SheetContent>
                </Sheet>

                <div>
                  <p className="font-heading text-base font-semibold tracking-wide text-zinc-100">Monitor Ops</p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-amber-300/80">
                    Real-time workspace
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-1 rounded-full border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[11px] font-medium text-amber-200 lg:inline-flex">
                  <Sparkles className="h-3.5 w-3.5" />
                  Live
                </span>
                <UserMenu user={user} />
              </div>
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-hidden px-2 pb-2 pt-2 md:px-3 md:pb-3 md:pt-3">
            <div className="h-full bg-zinc-950/55 backdrop-blur">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
