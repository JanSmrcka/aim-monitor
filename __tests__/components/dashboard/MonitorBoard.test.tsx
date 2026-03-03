import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MonitorBoard } from "@/components/dashboard/MonitorBoard";

vi.mock("@/components/monitoring/MonitorFeedPreview", () => ({
  MonitorFeedPreview: ({ taskId }: { taskId: string }) => (
    <div data-testid={`preview-${taskId}`}>preview</div>
  ),
}));

describe("MonitorBoard", () => {
  it("renders empty state", () => {
    render(<MonitorBoard tasks={[]} />);
    expect(screen.getByText(/no monitors yet/i)).toBeInTheDocument();
  });

  it("renders cards and preview widgets", () => {
    render(
      <MonitorBoard
        tasks={[
          {
            id: "t1",
            title: "Bitcoin Monitor",
            scope: "bitcoin",
            frequency: "daily",
            updatedAt: new Date().toISOString(),
          },
        ]}
      />
    );

    expect(screen.getByText("Bitcoin Monitor")).toBeInTheDocument();
    expect(screen.getByTestId("preview-t1")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open monitor/i })).toHaveAttribute(
      "href",
      "/dashboard/monitors/t1"
    );
  });
});
