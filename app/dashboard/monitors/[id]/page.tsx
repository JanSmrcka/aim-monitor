import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { monitoringTaskFromStoredTask } from "@/lib/task-spec";
import { redirect, notFound } from "next/navigation";
import { MonitoringPreview } from "@/components/monitoring/MonitoringPreview";
import { MonitorFeedPanel } from "@/components/monitoring/MonitorFeedPanel";
import { Sparkles } from "lucide-react";

export default async function MonitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const { id } = await params;
  const task = await prisma.monitoringTask.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      title: true,
      config: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!task || task.userId !== session.user.id) {
    notFound();
  }

  const storedTask = task as typeof task & { summary?: string | null };
  const spec = monitoringTaskFromStoredTask(storedTask);

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-2 xl:grid-cols-[minmax(0,56%)_minmax(420px,44%)]">
      <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="border-b border-zinc-800/80 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Monitor detail</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-heading text-xl font-semibold leading-snug text-zinc-100">{task.title}</h2>
              {storedTask.summary ? (
                <p className="mt-1 text-sm text-zinc-400">{storedTask.summary}</p>
              ) : (
                <p className="mt-1 text-sm text-zinc-500">Mock feed preview - refreshes every 15s</p>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[11px] font-medium text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Live Mock
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-auto">
          <MonitorFeedPanel taskId={task.id} />
        </div>
      </section>

      <div className="min-h-0 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <MonitoringPreview task={spec} />
      </div>
    </div>
  );
}
