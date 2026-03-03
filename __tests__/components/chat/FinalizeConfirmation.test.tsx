import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FinalizeConfirmation } from "@/components/chat/FinalizeConfirmation";

describe("FinalizeConfirmation", () => {
  it("renders summary text", () => {
    render(
      <FinalizeConfirmation summary="Monitor AI research" onConfirm={vi.fn()} onDismiss={vi.fn()} isLoading={false} />
    );
    expect(screen.getByText("Monitor AI research")).toBeInTheDocument();
  });

  it("calls onConfirm when Create Monitor clicked", async () => {
    const onConfirm = vi.fn();
    render(
      <FinalizeConfirmation summary="test" onConfirm={onConfirm} onDismiss={vi.fn()} isLoading={false} />
    );
    await userEvent.click(screen.getByRole("button", { name: /create monitor/i }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("shows loading state during save", () => {
    render(
      <FinalizeConfirmation summary="test" onConfirm={vi.fn()} onDismiss={vi.fn()} isLoading={true} />
    );
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
  });

  it("calls onDismiss when Keep editing clicked", async () => {
    const onDismiss = vi.fn();
    render(
      <FinalizeConfirmation summary="test" onConfirm={vi.fn()} onDismiss={onDismiss} isLoading={false} />
    );
    await userEvent.click(screen.getByRole("button", { name: /keep editing/i }));
    expect(onDismiss).toHaveBeenCalled();
  });
});
