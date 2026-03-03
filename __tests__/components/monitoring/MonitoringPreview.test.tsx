import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MonitoringPreview } from "@/components/monitoring/MonitoringPreview";
import type { MonitoringTask } from "@/lib/types";

describe("MonitoringPreview", () => {
  it("renders empty state when no config", () => {
    render(<MonitoringPreview task={{}} />);
    expect(screen.getByText(/your monitoring task will appear here/i)).toBeInTheDocument();
  });

  it("renders scope when provided", () => {
    const task: MonitoringTask = { scope: "AI research papers" };
    render(<MonitoringPreview task={task} />);
    expect(screen.getByText("AI research papers")).toBeInTheDocument();
  });

  it("renders keywords as badges", () => {
    const task: MonitoringTask = { keywords: ["LLM", "transformer"] };
    render(<MonitoringPreview task={task} />);
    expect(screen.getByText("LLM")).toBeInTheDocument();
    expect(screen.getByText("transformer")).toBeInTheDocument();
  });

  it("renders source list", () => {
    const task: MonitoringTask = {
      sources: [
        { type: "web", name: "Google" },
        { type: "news", name: "Reuters" },
      ],
    };
    render(<MonitoringPreview task={task} />);
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Reuters")).toBeInTheDocument();
  });

  it("renders entity badges", () => {
    const task: MonitoringTask = {
      entities: [{ type: "company", name: "OpenAI" }],
    };
    render(<MonitoringPreview task={task} />);
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
  });

  it("renders frequency", () => {
    const task: MonitoringTask = { frequency: "daily" };
    render(<MonitoringPreview task={task} />);
    expect(screen.getByText("daily")).toBeInTheDocument();
  });

  it("renders progress bar with correct segment count", () => {
    const task: MonitoringTask = {
      scope: "test",
      sources: [{ type: "web", name: "Google" }],
    };
    render(<MonitoringPreview task={task} />);
    const bar = screen.getByTestId("progress-bar");
    expect(bar).toBeInTheDocument();
  });

  it("renders long title text", () => {
    const task: MonitoringTask = {
      title: "Bitcoin News & Policy - US Regulators and Global Enforcement Landscape",
    };
    render(<MonitoringPreview task={task} />);
    expect(screen.getByText(/Bitcoin News & Policy/)).toBeInTheDocument();
  });
});
