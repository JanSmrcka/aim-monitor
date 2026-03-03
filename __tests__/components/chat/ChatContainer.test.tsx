import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ChatContainer } from "@/components/chat/ChatContainer";

const mockUseChat = {
  messages: [],
  status: "ready" as const,
  sendMessage: vi.fn(),
  setMessages: vi.fn(),
};

vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(() => mockUseChat),
}));

describe("ChatContainer", () => {
  it("renders chat input", () => {
    render(<ChatContainer />);
    expect(screen.getByPlaceholderText(/describe what you want to monitor/i)).toBeInTheDocument();
  });

  it("renders message list area", () => {
    render(<ChatContainer />);
    expect(screen.getByTestId("message-list")).toBeInTheDocument();
  });

  it("shows thinking indicator when submitting", async () => {
    const { useChat } = await import("@ai-sdk/react");
    vi.mocked(useChat).mockReturnValue({
      ...mockUseChat,
      status: "streaming" as const,
    } as unknown as ReturnType<typeof useChat>);

    render(<ChatContainer />);
    expect(screen.getByTestId("thinking-indicator")).toBeInTheDocument();
  });
});
