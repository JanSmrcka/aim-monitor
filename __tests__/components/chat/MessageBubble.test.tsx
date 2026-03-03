import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { UIMessage } from "ai";

function makeMsg(role: "user" | "assistant", text: string): UIMessage {
  return {
    id: "msg-1",
    role,
    parts: [{ type: "text" as const, text }],
  };
}

function renderWithQuery(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

const noop = () => {};

describe("MessageBubble", () => {
  it("renders user message text", () => {
    renderWithQuery(<MessageBubble message={makeMsg("user", "Hello")} append={noop} />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders assistant message text", () => {
    renderWithQuery(<MessageBubble message={makeMsg("assistant", "Hi there")} append={noop} />);
    expect(screen.getByText("Hi there")).toBeInTheDocument();
  });

  it("user message has right-aligned styling", () => {
    renderWithQuery(<MessageBubble message={makeMsg("user", "Hello")} append={noop} />);
    const container = screen.getByText("Hello").closest("[data-role]");
    expect(container?.getAttribute("data-role")).toBe("user");
  });

  it("assistant message has left-aligned styling", () => {
    renderWithQuery(<MessageBubble message={makeMsg("assistant", "Hi")} append={noop} />);
    const container = screen.getByText("Hi").closest("[data-role]");
    expect(container?.getAttribute("data-role")).toBe("assistant");
  });

  it("shows placeholder for pending present_options tool", () => {
    const message = {
      id: "msg-tool-pending",
      role: "assistant",
      parts: [
        {
          type: "tool-present_options",
          toolCallId: "call-1",
          state: "input-streaming",
          input: undefined,
        },
      ],
    } as unknown as UIMessage;

    renderWithQuery(<MessageBubble message={message} append={noop} isLatest />);
    expect(screen.getByText("Preparing options...")).toBeInTheDocument();
  });

  it("renders option chips for valid present_options payload", () => {
    const message = {
      id: "msg-tool-ready",
      role: "assistant",
      parts: [
        {
          type: "tool-present_options",
          toolCallId: "call-2",
          state: "output-available",
          input: {
            question: "Pick one",
            options: [{ label: "News", value: "news" }],
          },
          output: {
            question: "Pick one",
            options: [{ label: "News", value: "news" }],
          },
        },
      ],
    } as unknown as UIMessage;

    renderWithQuery(<MessageBubble message={message} append={noop} isLatest />);
    expect(screen.getByText("Pick one")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "News" })).toBeInTheDocument();
  });

  it("locks option chips while interaction is locked", () => {
    const message = {
      id: "msg-tool-locked",
      role: "assistant",
      parts: [
        {
          type: "tool-present_options",
          toolCallId: "call-lock",
          state: "output-available",
          input: {
            question: "Pick one",
            options: [{ label: "News", value: "news" }],
          },
          output: {
            question: "Pick one",
            options: [{ label: "News", value: "news" }],
          },
        },
      ],
    } as unknown as UIMessage;

    renderWithQuery(
      <MessageBubble message={message} append={noop} isLatest interactionLocked />
    );
    expect(screen.getByRole("button", { name: "News" })).toBeDisabled();
    expect(screen.getByText(/wait for response to finish/i)).toBeInTheDocument();
  });

  it("does not crash on invalid present_options payload", () => {
    const message = {
      id: "msg-tool-invalid",
      role: "assistant",
      parts: [
        {
          type: "tool-present_options",
          toolCallId: "call-3",
          state: "output-available",
          input: {},
          output: {},
        },
      ],
    } as unknown as UIMessage;

    renderWithQuery(<MessageBubble message={message} append={noop} isLatest />);
    expect(screen.queryByText("Preparing options...")).not.toBeInTheDocument();
  });

  it("does not crash when finalize_task summary missing", () => {
    const message = {
      id: "msg-finalize-missing",
      role: "assistant",
      parts: [
        {
          type: "tool-finalize_task",
          toolCallId: "call-4",
          state: "output-available",
          input: {},
          output: {},
        },
      ],
    } as unknown as UIMessage;

    renderWithQuery(<MessageBubble message={message} append={noop} isLatest />);
    expect(screen.queryByText("Ready to create")).not.toBeInTheDocument();
  });
});
