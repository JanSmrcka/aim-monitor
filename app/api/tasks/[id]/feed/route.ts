import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { monitoringTaskFromStoredTask } from "@/lib/task-spec";
import { mockFeedProvider } from "@/lib/feeds/mock-provider";
import { NextResponse } from "next/server";

function parseLimit(value: string | null): number {
  const parsed = value ? Number.parseInt(value, 10) : 20;
  if (!Number.isFinite(parsed)) return 20;
  return Math.min(Math.max(parsed, 1), 50);
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
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
    return new Response("Not found", { status: 404 });
  }

  const url = new URL(req.url);
  const limit = parseLimit(url.searchParams.get("limit"));
  const cursor = url.searchParams.get("cursor") ?? undefined;

  const monitorTask = monitoringTaskFromStoredTask(task);
  const feed = await mockFeedProvider.getMonitorFeed(monitorTask, { limit, cursor });

  return NextResponse.json(feed);
}
