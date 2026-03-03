import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { OptionChips } from "@/components/chat/OptionChips";

const options = [
  { label: "Web", value: "web", description: "Search the web" },
  { label: "News", value: "news" },
  { label: "Social", value: "social" },
];

describe("OptionChips", () => {
  it("renders question text", () => {
    render(
      <OptionChips question="What sources?" options={options} onSelect={vi.fn()} disabled={false} />
    );
    expect(screen.getByText("What sources?")).toBeInTheDocument();
  });

  it("renders all option labels as buttons", () => {
    render(
      <OptionChips question="Pick" options={options} onSelect={vi.fn()} disabled={false} />
    );
    expect(screen.getByRole("button", { name: "Web" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "News" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Social" })).toBeInTheDocument();
  });

  it("calls onSelect with value on click", async () => {
    const onSelect = vi.fn();
    render(
      <OptionChips question="Pick" options={options} onSelect={onSelect} disabled={false} />
    );
    await userEvent.click(screen.getByRole("button", { name: "Web" }));
    expect(onSelect).toHaveBeenCalledWith("web");
  });

  it("disables all buttons when disabled", () => {
    render(
      <OptionChips question="Pick" options={options} onSelect={vi.fn()} disabled={true} />
    );
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("multi-select: toggles and shows confirm button", async () => {
    const onSelect = vi.fn();
    render(
      <OptionChips
        question="Pick sources"
        options={options}
        onSelect={onSelect}
        disabled={false}
        allowMultiple
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "Web" }));
    await userEvent.click(screen.getByRole("button", { name: "News" }));
    const confirm = screen.getByRole("button", { name: /confirm/i });
    expect(confirm).toBeInTheDocument();
    await userEvent.click(confirm);
    expect(onSelect).toHaveBeenCalledWith("web, news");
  });

  it("multi-select: marks selected options as pressed", async () => {
    render(
      <OptionChips
        question="Pick sources"
        options={options}
        onSelect={vi.fn()}
        disabled={false}
        allowMultiple
      />
    );

    const web = screen.getByRole("button", { name: /web/i });
    expect(web).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(web);
    expect(web).toHaveAttribute("aria-pressed", "true");
  });

  it("shows lock helper while agent busy", () => {
    render(
      <OptionChips
        question="Pick"
        options={options}
        onSelect={vi.fn()}
        disabled={true}
        isAgentBusy
      />
    );
    expect(screen.getByText(/wait for response to finish/i)).toBeInTheDocument();
  });
});
