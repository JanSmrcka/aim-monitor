import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { monitoringTaskFromStoredTask } from "@/lib/task-spec";
import { redirect, notFound } from "next/navigation";
import { MonitoringPreview } from "@/components/monitoring/MonitoringPreview";
import { Lock, Sparkles } from "lucide-react";

export default async function MonitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const { id } = await params;
  const task = await prisma.monitoringTask.findUnique({ where: { id } });

  if (!task || task.userId !== session.user.id) {
    notFound();
  }

  const storedTask = task;
  const spec = monitoringTaskFromStoredTask(storedTask);

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-2 xl:grid-cols-[minmax(0,56%)_minmax(420px,44%)]">
      <section className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="border-b border-zinc-800/80 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Monitor detail</p>
          <div className="mt-1 flex items-start justify-between gap-3">
            <h2 className="font-heading text-xl font-semibold text-zinc-100">{task.title}</h2>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200/20 bg-amber-300/10 px-2.5 py-1 text-[11px] font-medium text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Saved
            </span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-5">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-700/80 bg-zinc-900/55 p-6">
            <div className="mb-4 flex items-center gap-2 text-amber-200">
              <Lock className="h-4 w-4" />
              <p className="text-sm font-medium">Chat locked for this monitor</p>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">
              This monitor is already created and active. Use <span className="text-zinc-100">New Monitor</span>
              {" "}to start another setup flow, or select any saved monitor from the sidebar.
            </p>
            {storedTask.summary ? (
              <div className="mt-5 rounded-xl border border-zinc-700 bg-zinc-900/70 p-4">
                <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">Summary</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-200">{storedTask.summary}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="min-h-0 overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <MonitoringPreview task={spec} />
      </div>
    </div>
  );
}
