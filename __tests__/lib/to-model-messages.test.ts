import { describe, it, expect } from "vitest";
import { modelMessageSchema } from "ai";
import { toModelMessages } from "@/lib/to-model-messages";

function toolPart(toolName: string, input: object, output: object = input) {
  return {
    type: `tool-${toolName}`,
    toolCallId: `call-${toolName}`,
    state: "output-available",
    input,
    output,
  };
}

describe("toModelMessages", () => {
  it("converts user message with parts", () => {
    const result = toModelMessages([
      { role: "user", parts: [{ type: "text", text: "hello" }] },
    ]);
    expect(result).toEqual([{ role: "user", content: "hello" }]);
  });

  it("converts user message with legacy content field", () => {
    const result = toModelMessages([
      { role: "user", content: "hello" },
    ]);
    expect(result).toEqual([{ role: "user", content: "hello" }]);
  });

  it("converts assistant text-only (parts)", () => {
    const result = toModelMessages([
      {
        role: "assistant",
        content: "hi",
        parts: [{ type: "text", text: "hi" }],
      },
    ]);
    expect(result).toEqual([
      { role: "assistant", content: [{ type: "text", text: "hi" }] },
    ]);
  });

  it("converts assistant text-only (no parts, fallback to content)", () => {
    const result = toModelMessages([
      { role: "assistant", content: "hi" },
    ]);
    expect(result).toEqual([{ role: "assistant", content: "hi" }]);
  });

  it("converts assistant with tool call into assistant + tool messages", () => {
    const result = toModelMessages([
      {
        role: "assistant",
        content: "",
        parts: [
          { type: "text", text: "Let me help" },
          toolPart("present_options", { question: "what?" }),
        ],
      },
    ]);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      role: "assistant",
      content: [
        { type: "text", text: "Let me help" },
        {
          type: "tool-call",
          toolCallId: "call-present_options",
          toolName: "present_options",
          input: { question: "what?" },
        },
      ],
    });
    expect(result[1]).toEqual({
      role: "tool",
      content: [
        {
          type: "tool-result",
          toolCallId: "call-present_options",
          toolName: "present_options",
          output: { type: "json", value: { question: "what?" } },
        },
      ],
    });
  });

  it("skips tool parts with non-completed state", () => {
    const result = toModelMessages([
      {
        role: "assistant",
        content: "",
        parts: [
          { type: "text", text: "thinking..." },
          {
            type: "tool-present_options",
            toolCallId: "c1",
            state: "input-streaming",
            input: undefined,
          },
        ],
      },
    ]);
    // Only text, no tool-call or tool message
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      role: "assistant",
      content: [{ type: "text", text: "thinking..." }],
    });
  });

  it("maps tool output-error to error-text tool result", () => {
    const result = toModelMessages([
      {
        role: "assistant",
        parts: [
          {
            type: "tool-present_options",
            toolCallId: "c1",
            state: "output-error",
            input: { question: "q" },
            errorText: "boom",
          },
        ],
      },
    ]);

    expect(result).toEqual([
      {
        role: "assistant",
        content: [
          {
            type: "tool-call",
            toolCallId: "c1",
            toolName: "present_options",
            input: { question: "q" },
          },
        ],
      },
      {
        role: "tool",
        content: [
          {
            type: "tool-result",
            toolCallId: "c1",
            toolName: "present_options",
            output: { type: "error-text", value: "boom" },
          },
        ],
      },
    ]);
  });

  it("skips step-start and other non-model parts", () => {
    const result = toModelMessages([
      {
        role: "assistant",
        content: "",
        parts: [
          { type: "text", text: "ok" },
          { type: "step-start" },
          { type: "reasoning", text: "hmm" },
        ],
      },
    ]);
    expect(result).toEqual([
      { role: "assistant", content: [{ type: "text", text: "ok" }] },
    ]);
  });

  it("skips assistant with only non-completed tool parts (no content emitted)", () => {
    const result = toModelMessages([
      {
        role: "assistant",
        content: "",
        parts: [
          {
            type: "tool-update_monitoring_task",
            toolCallId: "c1",
            state: "input-available",
            input: { title: "test" },
          },
        ],
      },
    ]);
    expect(result).toEqual([]);
  });

  it("skips unknown roles", () => {
    const result = toModelMessages([
      { role: "system", content: "you are..." },
      { role: "user", content: "hi" },
    ]);
    expect(result).toEqual([{ role: "user", content: "hi" }]);
  });

  it("handles undefined / null / non-object in array", () => {
    const result = toModelMessages([
      null as unknown as Record<string, unknown>,
      undefined as unknown as Record<string, unknown>,
      42 as unknown as Record<string, unknown>,
      { role: "user", content: "ok" },
    ]);
    expect(result).toEqual([{ role: "user", content: "ok" }]);
  });

  it("handles empty messages array", () => {
    expect(toModelMessages([])).toEqual([]);
  });

  it("full multi-turn conversation", () => {
    const result = toModelMessages([
      { role: "user", parts: [{ type: "text", text: "monitor openai" }] },
      {
        role: "assistant",
        parts: [
          { type: "text", text: "Sure!" },
          toolPart("present_options", { question: "type?" }, { question: "type?" }),
          toolPart("update_monitoring_task", { title: "OpenAI" }, { title: "OpenAI" }),
        ],
      },
      { role: "user", parts: [{ type: "text", text: "competitor tracking" }] },
    ]);
    expect(result).toHaveLength(4); // user, assistant, tool, user
    expect(result[0].role).toBe("user");
    expect(result[1].role).toBe("assistant");
    expect(result[2].role).toBe("tool");
    expect((result[2].content as Array<unknown>)).toHaveLength(2); // 2 tool results
    expect(result[3].role).toBe("user");
  });

  it("produces schema-valid model messages for present_options roundtrip", () => {
    const result = toModelMessages([
      { role: "user", content: "hello" },
      {
        role: "assistant",
        parts: [
          {
            type: "tool-present_options",
            toolCallId: "call-1",
            state: "output-available",
            input: {
              question: "Great to meet you! What would you like to monitor?",
              options: [{ label: "Product/Brand", value: "product" }],
            },
            output: {
              question: "Great to meet you! What would you like to monitor?",
              options: [{ label: "Product/Brand", value: "product" }],
            },
          },
          {
            type: "text",
            text: "Great to meet you! What would you like to monitor?",
          },
        ],
      },
      { role: "user", content: "product" },
    ]);

    for (const msg of result) {
      const parsed = modelMessageSchema.safeParse(msg);
      expect(parsed.success).toBe(true);
    }
  });
});
