import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TaskList } from "@/components/dashboard/TaskList";
import { mockTasks } from "@/__tests__/fixtures/data";

describe("TaskList", () => {
  it("shows loading skeleton when isLoading", () => {
    render(<TaskList tasks={[]} isLoading={true} onSelectTask={vi.fn()} />);
    expect(screen.getByTestId("tasklist-skeleton")).toBeInTheDocument();
  });

  it("shows empty state when no tasks", () => {
    render(<TaskList tasks={[]} isLoading={false} onSelectTask={vi.fn()} />);
    expect(screen.getByText(/no monitors yet/i)).toBeInTheDocument();
  });

  it("renders task names", () => {
    render(<TaskList tasks={mockTasks} isLoading={false} onSelectTask={vi.fn()} />);
    expect(screen.getByText("Monitor AI Research")).toBeInTheDocument();
    expect(screen.getByText("SEC Filings")).toBeInTheDocument();
  });

  it("renders frequency badge", () => {
    render(<TaskList tasks={mockTasks} isLoading={false} onSelectTask={vi.fn()} />);
    expect(screen.getByText("daily")).toBeInTheDocument();
  });
});
