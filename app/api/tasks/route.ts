import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const tasks = await prisma.monitoringTask.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  if (!body.title || !body.config) {
    return NextResponse.json({ error: "title and config required" }, { status: 400 });
  }

  const task = await prisma.monitoringTask.create({
    data: {
      userId: session.user.id,
      title: body.title,
      config: body.config,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
