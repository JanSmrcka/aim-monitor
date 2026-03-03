import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { mockTasks } from "@/__tests__/fixtures/data";

describe("Sidebar", () => {
  it("renders New Monitor button", () => {
    render(
      <Sidebar
        tasks={[]}
        isLoading={false}
        onNewChat={vi.fn()}
        onGoDashboard={vi.fn()}
        onSelectTask={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: /new monitor/i })).toBeInTheDocument();
  });

  it("renders task items", () => {
    render(
      <Sidebar
        tasks={mockTasks}
        isLoading={false}
        onNewChat={vi.fn()}
        onGoDashboard={vi.fn()}
        onSelectTask={vi.fn()}
      />
    );
    expect(screen.getByText("Monitor AI Research")).toBeInTheDocument();
    expect(screen.getByText("SEC Filings")).toBeInTheDocument();
  });

  it("calls onNewChat when button clicked", async () => {
    const onNewChat = vi.fn();
    render(
      <Sidebar
        tasks={[]}
        isLoading={false}
        onNewChat={onNewChat}
        onGoDashboard={vi.fn()}
        onSelectTask={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /new monitor/i }));
    expect(onNewChat).toHaveBeenCalled();
  });

  it("calls onGoDashboard when Active Monitors clicked", async () => {
    const onGoDashboard = vi.fn();
    render(
      <Sidebar
        tasks={[]}
        isLoading={false}
        onNewChat={vi.fn()}
        onGoDashboard={onGoDashboard}
        onSelectTask={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /active monitors/i }));
    expect(onGoDashboard).toHaveBeenCalled();
  });

  it("shows empty state when no tasks", () => {
    render(
      <Sidebar
        tasks={[]}
        isLoading={false}
        onNewChat={vi.fn()}
        onGoDashboard={vi.fn()}
        onSelectTask={vi.fn()}
      />
    );
    expect(screen.getByText(/no monitors yet/i)).toBeInTheDocument();
  });

  it("shows loading skeleton when isLoading", () => {
    render(
      <Sidebar
        tasks={[]}
        isLoading={true}
        onNewChat={vi.fn()}
        onGoDashboard={vi.fn()}
        onSelectTask={vi.fn()}
      />
    );
    expect(screen.getByTestId("sidebar-skeleton")).toBeInTheDocument();
  });
});
