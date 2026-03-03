import { streamText, smoothStream, convertToModelMessages } from "ai";
import { azure } from "@/lib/azure";
import { auth } from "@/lib/auth";
import { systemPrompt } from "@/lib/system-prompt";
import { tools } from "@/lib/tools";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  const result = streamText({
    model: azure.responses("gpt-5-hiring"),
    system: systemPrompt,
    messages: convertToModelMessages(messages),
    tools,
    maxSteps: 10,
    providerOptions: {
      openai: {
        reasoningEffort: "medium",
        reasoningSummary: "detailed",
      },
    },
    experimental_transform: smoothStream(),
  });

  return result.toUIMessageStreamResponse({ sendReasoning: true });
}
