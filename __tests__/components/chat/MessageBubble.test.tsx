import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MessageBubble } from "@/components/chat/MessageBubble";
import type { UIMessage } from "ai";

function makeMsg(role: "user" | "assistant", content: string): UIMessage {
  return {
    id: "msg-1",
    role,
    content,
    parts: [{ type: "text" as const, text: content }],
  };
}

describe("MessageBubble", () => {
  it("renders user message text", () => {
    render(<MessageBubble message={makeMsg("user", "Hello")} append={async () => "msg-id"} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders assistant message text", () => {
    render(<MessageBubble message={makeMsg("assistant", "Hi there")} append={async () => "msg-id"} />);
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("user message has right-aligned styling", () => {
    render(<MessageBubble message={makeMsg("user", "Hello")} append={async () => "msg-id"} />);
    const container = screen.getByText("Hello").closest("[data-role]");
    expect(container?.getAttribute("data-role")).toBe("user");
  });

  it("assistant message has left-aligned styling", () => {
    render(<MessageBubble message={makeMsg("assistant", "Hi")} append={async () => "msg-id"} />);
    const container = screen.getByText("Hi").closest("[data-role]");
    expect(container?.getAttribute("data-role")).toBe("assistant");
  });
});
