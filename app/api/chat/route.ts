import { streamText, smoothStream, stepCountIs } from "ai";
import { azure } from "@/lib/azure";
import { auth } from "@/lib/auth";
import { systemPrompt } from "@/lib/system-prompt";
import { tools } from "@/lib/tools";
import { toModelMessages } from "@/lib/to-model-messages";

const chatModel = process.env.AZURE_CHAT_MODEL || "gpt-5-hiring";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const rawMessages = (body as Record<string, unknown>).messages;
  if (!Array.isArray(rawMessages)) {
    return Response.json({ error: "invalid_messages" }, { status: 400 });
  }

  const messages = toModelMessages(rawMessages);

  try {
    const result = streamText({
      model: azure.responses(chatModel),
      system: systemPrompt,
      messages: messages as unknown as Parameters<typeof streamText>[0]["messages"] & [],
      tools,
      stopWhen: stepCountIs(10),
      providerOptions: {
        openai: {
          reasoningEffort: "medium",
          reasoningSummary: "detailed",
        },
        azure: {
          reasoningEffort: "medium",
          reasoningSummary: "detailed",
        },
      },
      experimental_transform: smoothStream(),
    });

    return result.toUIMessageStreamResponse({
      headers: {
        "Transfer-Encoding": "chunked",
        Connection: "keep-alive",
      },
      sendReasoning: true,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "unknown";
    return Response.json({ error: "prompt_error", detail: msg }, { status: 400 });
  }
}
