import type { UIMessage } from "ai";

export function makeUserMessage(content: string, id = "msg-u1"): UIMessage {
  return {
    id,
    role: "user",
    content,
    parts: [{ type: "text", text: content }],
  };
}

export function makeAssistantMessage(content: string, id = "msg-a1"): UIMessage {
  return {
    id,
    role: "assistant",
    content,
    parts: [{ type: "text", text: content }],
  };
}

export function makeAssistantWithTool(
  toolName: string,
  args: Record<string, unknown>,
  id = "msg-t1"
): UIMessage {
  return {
    id,
    role: "assistant",
    content: "",
    parts: [
      {
        type: "tool-invocation",
        toolInvocationId: `call-${id}`,
        toolName,
        args,
        state: "result",
        result: {},
      },
    ],
  };
}

export function makeAssistantWithTextAndTool(
  text: string,
  toolName: string,
  args: Record<string, unknown>,
  id = "msg-tt1"
): UIMessage {
  return {
    id,
    role: "assistant",
    content: text,
    parts: [
      { type: "text", text },
      {
        type: "tool-invocation",
        toolInvocationId: `call-${id}`,
        toolName,
        args,
        state: "result",
        result: {},
      },
    ],
  };
}
