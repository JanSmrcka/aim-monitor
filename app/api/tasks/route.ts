import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { monitoringTaskFromStoredTask, normalizeTaskSpecColumns } from "@/lib/task-spec";
import type { Prisma } from "@/lib/generated/prisma/client";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function isLegacySchemaError(error: unknown): boolean {
  const legacyFieldPattern = /(?:scope|keywords|entities|sources|frequency|filters|summary)/;

  if (error instanceof Error) {
    if (
      error.name === "PrismaClientValidationError" &&
      /Unknown argument `(?:scope|keywords|entities|sources|frequency|filters|summary)`/.test(error.message)
    ) {
      return true;
    }
  }

  if (!error || typeof error !== "object") return false;

  const maybeCode = (error as { code?: unknown }).code;
  if (maybeCode !== "P2022") return false;

  const maybeMeta = (error as { meta?: unknown }).meta;
  if (!maybeMeta || typeof maybeMeta !== "object") return true;

  const maybeColumn = (maybeMeta as { column?: unknown }).column;
  return typeof maybeColumn === "string" ? legacyFieldPattern.test(maybeColumn) : true;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tasks = await prisma.monitoringTask.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!isRecord(body) || typeof body.title !== "string" || !isRecord(body.config)) {
    return NextResponse.json({ error: "title and config required" }, { status: 400 });
  }

  const spec = normalizeTaskSpecColumns(body.config);
  const summary = typeof body.summary === "string" ? body.summary : null;

  const fullData = {
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
  } satisfies Prisma.MonitoringTaskUncheckedCreateInput;

  let task;
  try {
    task = await prisma.monitoringTask.create({ data: fullData });
  } catch (error) {
    if (!isLegacySchemaError(error)) throw error;

    task = await prisma.monitoringTask.create({
      data: {
        userId: session.user.id,
        title: body.title,
        config: body.config as unknown as Prisma.InputJsonValue,
      } as Prisma.MonitoringTaskUncheckedCreateInput,
    });
  }

  return NextResponse.json(task, { status: 201 });
}
