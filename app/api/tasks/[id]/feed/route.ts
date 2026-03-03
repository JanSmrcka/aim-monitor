import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { monitoringTaskFromStoredTask } from "@/lib/task-spec";
import { mockFeedProvider } from "@/lib/feeds/mock-provider";
import { NextResponse } from "next/server";
import type { MonitoringTask } from "@/lib/types";

function parseLimit(value: string | null): number {
  const parsed = value ? Number.parseInt(value, 10) : 20;
  if (!Number.isFinite(parsed)) return 20;
  return Math.min(Math.max(parsed, 1), 50);
}

function seedTaskFromQuery(url: URL, id: string): MonitoringTask {
  const title = url.searchParams.get("title")?.trim();
  const scope = url.searchParams.get("scope")?.trim();
  const frequency = url.searchParams.get("frequency")?.trim();
  const keywords = url.searchParams
    .get("keywords")
    ?.split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return {
    title: title || `Monitor ${id.slice(0, 6)}`,
    scope: scope || "topic",
    frequency:
      frequency === "realtime" ||
      frequency === "hourly" ||
      frequency === "daily" ||
      frequency === "weekly"
        ? frequency
        : "daily",
    keywords: keywords && keywords.length > 0 ? keywords : [title || "monitor"],
  };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const url = new URL(req.url);
  const limit = parseLimit(url.searchParams.get("limit"));
  const cursor = url.searchParams.get("cursor") ?? undefined;

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

  const monitorTask =
    task && task.userId === session.user.id
      ? monitoringTaskFromStoredTask(task)
      : seedTaskFromQuery(url, id);

  const feed = await mockFeedProvider.getMonitorFeed(monitorTask, { limit, cursor });

  return NextResponse.json(feed);
}
