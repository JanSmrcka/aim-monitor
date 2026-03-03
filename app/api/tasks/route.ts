import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { monitoringTaskFromStoredTask, normalizeTaskSpecColumns } from "@/lib/task-spec";
import type { Prisma } from "@/lib/generated/prisma/client";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tasks = await prisma.monitoringTask.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const normalized = tasks.map((task) => {
    const spec = monitoringTaskFromStoredTask(task);
    return {
      ...task,
      scope: spec.scope ?? null,
      frequency: spec.frequency ?? null,
    };
  });

  return NextResponse.json(normalized);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  if (!isRecord(body) || typeof body.title !== "string" || !isRecord(body.config)) {
    return NextResponse.json({ error: "title and config required" }, { status: 400 });
  }

  const spec = normalizeTaskSpecColumns(body.config);
  const summary = typeof body.summary === "string" ? body.summary : null;

  const task = await prisma.monitoringTask.create({
    data: {
      userId: session.user.id,
      title: body.title,
      config: body.config as unknown as Prisma.InputJsonValue,
      scope: spec.scope,
      keywords: spec.keywords,
      entities: spec.entities === null ? undefined : (spec.entities as Prisma.InputJsonValue),
      sources: spec.sources === null ? undefined : (spec.sources as Prisma.InputJsonValue),
      frequency: spec.frequency,
      filters: spec.filters === null ? undefined : (spec.filters as Prisma.InputJsonValue),
      summary,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
