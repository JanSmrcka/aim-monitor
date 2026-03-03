import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ChatInput } from "@/components/chat/ChatInput";

describe("ChatInput", () => {
  it("renders textarea", () => {
    render(<ChatInput value="" onChange={vi.fn()} onSubmit={vi.fn()} isLoading={false} />);
    expect(screen.getByPlaceholderText(/describe what you want to monitor/i)).toBeInTheDocument();
  });

  it("calls onSubmit on Enter", async () => {
    const onSubmit = vi.fn();
    render(<ChatInput value="test" onChange={vi.fn()} onSubmit={onSubmit} isLoading={false} />);
    const textarea = screen.getByPlaceholderText(/describe what you want to monitor/i);
    await userEvent.type(textarea, "{Enter}");
    expect(onSubmit).toHaveBeenCalled();
  });

  it("does not submit on Shift+Enter", async () => {
    const onSubmit = vi.fn();
    render(<ChatInput value="test" onChange={vi.fn()} onSubmit={onSubmit} isLoading={false} />);
    const textarea = screen.getByPlaceholderText(/describe what you want to monitor/i);
    await userEvent.type(textarea, "{Shift>}{Enter}{/Shift}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is disabled when loading", () => {
    render(<ChatInput value="" onChange={vi.fn()} onSubmit={vi.fn()} isLoading={true} />);
    expect(screen.getByPlaceholderText(/describe what you want to monitor/i)).toBeDisabled();
  });
});
