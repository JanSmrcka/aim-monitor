import type { UIMessage } from "ai";

export function makeUserMessage(text: string, id = "msg-u1"): UIMessage {
  return {
    id,
    role: "user",
    parts: [{ type: "text", text }],
  };
}

export function makeAssistantMessage(text: string, id = "msg-a1"): UIMessage {
  return {
    id,
    role: "assistant",
    parts: [{ type: "text", text }],
  };
}

export function makeAssistantWithTool(
  toolName: string,
  input: Record<string, unknown>,
  id = "msg-t1"
): UIMessage {
  return {
    id,
    role: "assistant",
    parts: [
      {
        type: `tool-${toolName}` as `tool-${string}`,
        toolCallId: `call-${id}`,
        state: "output-available",
        input,
        output: input,
      } as UIMessage["parts"][number],
    ],
  };
}

export function makeAssistantWithTextAndTool(
  text: string,
  toolName: string,
  input: Record<string, unknown>,
  id = "msg-tt1"
): UIMessage {
  return {
    id,
    role: "assistant",
    parts: [
      { type: "text", text },
      {
        type: `tool-${toolName}` as `tool-${string}`,
        toolCallId: `call-${id}`,
        state: "output-available",
        input,
        output: input,
      } as UIMessage["parts"][number],
    ],
  };
}
