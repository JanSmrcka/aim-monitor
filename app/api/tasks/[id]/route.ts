import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
  const updated = await prisma.monitoringTask.update({
    where: { id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.config && { config: body.config }),
    },
  });

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
