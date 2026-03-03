import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { monitoringTaskFromStoredTask, normalizeTaskSpecColumns } from "@/lib/task-spec";
import type { Prisma } from "@/lib/generated/prisma/client";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function isLegacySchemaError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return (
    error.name === "PrismaClientValidationError" &&
    /Unknown argument `(?:scope|keywords|entities|sources|frequency|filters|summary)`/.test(error.message)
  );
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const task = await prisma.monitoringTask.findUnique({ where: { id } });

  if (!task || task.userId !== session.user.id) {
    return new Response("Not found", { status: 404 });
  }

  const spec = monitoringTaskFromStoredTask(task);

  return NextResponse.json({
    ...task,
    ...spec,
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const task = await prisma.monitoringTask.findUnique({ where: { id } });

  if (!task || task.userId !== session.user.id) {
    return new Response("Not found", { status: 404 });
  }

  const body = await req.json();
  if (!isRecord(body)) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const data: Prisma.MonitoringTaskUpdateInput = {};
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.summary === "string") data.summary = body.summary;

  if (isRecord(body.config)) {
    const spec = normalizeTaskSpecColumns(body.config);
    data.config = body.config as unknown as Prisma.InputJsonValue;
    data.scope = spec.scope;
    data.keywords = spec.keywords;
    data.entities = spec.entities === null ? undefined : (spec.entities as Prisma.InputJsonValue);
    data.sources = spec.sources === null ? undefined : (spec.sources as Prisma.InputJsonValue);
    data.frequency = spec.frequency;
    data.filters = spec.filters === null ? undefined : (spec.filters as Prisma.InputJsonValue);
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "no fields to update" }, { status: 400 });
  }

  let updated;
  try {
    updated = await prisma.monitoringTask.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (!isLegacySchemaError(error)) throw error;

    const legacyData: Prisma.MonitoringTaskUpdateInput = {
      ...(typeof body.title === "string" ? { title: body.title } : {}),
      ...(isRecord(body.config)
        ? { config: body.config as unknown as Prisma.InputJsonValue }
        : {}),
    };

    if (Object.keys(legacyData).length === 0) {
      return NextResponse.json({ error: "no fields to update" }, { status: 400 });
    }

    updated = await prisma.monitoringTask.update({
      where: { id },
      data: legacyData,
    });
  }

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const task = await prisma.monitoringTask.findUnique({ where: { id } });

  if (!task || task.userId !== session.user.id) {
    return new Response("Not found", { status: 404 });
  }

  await prisma.monitoringTask.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
