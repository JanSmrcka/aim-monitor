type RawPart = Record<string, unknown>;
type RawMsg = Record<string, unknown>;

// Extract tool name from part type "tool-{name}"
function toolNameFromType(type: string): string {
  return type.slice(5); // strip "tool-"
}

/**
 * Convert UIMessages from Chat class to ModelMessage[] for streamText.
 *
 * AI SDK v4 UIMessage parts use:
 *   type: "tool-{name}", toolCallId, input, output, state: "output-available"
 * ModelMessage expects:
 *   assistant content: {type:"tool-call", toolCallId, toolName, input}
 *   tool content:      {type:"tool-result", toolCallId, toolName, output:{type,...}}
 */
export function toModelMessages(msgs: RawMsg[]) {
  const result: Array<{ role: string; content: string | Array<unknown> }> = [];

  for (const msg of msgs) {
    if (!msg || typeof msg !== "object") continue;

    // User messages
    if (msg.role === "user") {
      // v4 UIMessage: text in parts; legacy: text in content
      const parts = msg.parts as RawPart[] | undefined;
      const text =
        parts
          ?.filter((p) => p.type === "text" && typeof p.text === "string")
          .map((p) => p.text as string)
          .join("") ||
        (typeof msg.content === "string" ? msg.content : undefined);
      if (text) {
        result.push({ role: "user", content: text });
      }
      continue;
    }

    // Assistant messages
    if (msg.role === "assistant") {
      const parts = msg.parts as RawPart[] | undefined;
      if (!parts?.length) {
        if (typeof msg.content === "string" && msg.content) {
          result.push({ role: "assistant", content: msg.content });
        }
        continue;
      }

      const content: Array<unknown> = [];
      const toolResults: Array<unknown> = [];

      for (const part of parts) {
        if (!part || typeof part !== "object" || !part.type) continue;
        const type = String(part.type);

        // Text parts
        if (type === "text" && part.text) {
          content.push({ type: "text", text: part.text });
          continue;
        }

        // Tool parts: type starts with "tool-" (e.g. "tool-present_options")
        if (type.startsWith("tool-") && part.toolCallId) {
          const state = String(part.state ?? "");
          if (state === "output-available" || state === "output-error") {
            const toolName = toolNameFromType(type);
            content.push({
              type: "tool-call",
              toolCallId: part.toolCallId,
              toolName,
              input: part.input ?? {},
            });

            const output =
              state === "output-error"
                ? {
                    type: "error-text",
                    value:
                      typeof part.errorText === "string" && part.errorText
                        ? part.errorText
                        : "Tool execution error",
                  }
                : {
                    type: "json",
                    value: part.output ?? {},
                  };

            toolResults.push({
              type: "tool-result",
              toolCallId: part.toolCallId,
              toolName,
              output,
            });
          }
        }
        // Skip step-start, reasoning, source-*, file, etc.
      }

      if (content.length > 0) {
        result.push({ role: "assistant", content });
        if (toolResults.length > 0) {
          result.push({ role: "tool", content: toolResults });
        }
      }
    }
    // Skip unknown roles
  }

  return result;
}
