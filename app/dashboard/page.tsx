import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { monitoringTaskFromStoredTask } from "@/lib/task-spec";
import { MonitorBoard } from "@/components/dashboard/MonitorBoard";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const tasks = await prisma.monitoringTask.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      userId: true,
      title: true,
      config: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const normalized = tasks.map((task) => {
    const spec = monitoringTaskFromStoredTask(task);
    return {
      id: task.id,
      title: task.title,
      scope: spec.scope ?? null,
      frequency: spec.frequency ?? null,
      updatedAt: task.updatedAt.toISOString(),
    };
  });

  return <MonitorBoard tasks={normalized} />;
}
