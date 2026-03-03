import { describe, it, expect } from "vitest";
import { deriveMonitoringTask } from "@/lib/monitoring-utils";
import {
  makeUserMessage,
  makeAssistantMessage,
  makeAssistantWithTool,
} from "@/__tests__/fixtures/messages";

describe("deriveMonitoringTask", () => {
  it("returns empty object for empty messages", () => {
    expect(deriveMonitoringTask([])).toEqual({});
  });

  it("returns empty when no update_monitoring_task calls", () => {
    const messages = [
      makeUserMessage("hello"),
      makeAssistantMessage("hi there"),
    ];
    expect(deriveMonitoringTask(messages)).toEqual({});
  });

  it("extracts config from single tool invocation", () => {
    const messages = [
      makeAssistantWithTool("update_monitoring_task", {
        title: "AI Monitor",
        scope: "AI research",
      }),
    ];
    const result = deriveMonitoringTask(messages);
    expect(result.title).toBe("AI Monitor");
    expect(result.scope).toBe("AI research");
  });

  it("merges multiple invocations in order", () => {
    const messages = [
      makeAssistantWithTool("update_monitoring_task", { title: "V1" }, "m1"),
      makeAssistantWithTool("update_monitoring_task", { title: "V2", scope: "test" }, "m2"),
    ];
    const result = deriveMonitoringTask(messages);
    expect(result.title).toBe("V2");
    expect(result.scope).toBe("test");
  });

  it("preserves earlier fields when later call omits them", () => {
    const messages = [
      makeAssistantWithTool("update_monitoring_task", { title: "Keep", scope: "old" }, "m1"),
      makeAssistantWithTool("update_monitoring_task", { scope: "new" }, "m2"),
    ];
    const result = deriveMonitoringTask(messages);
    expect(result.title).toBe("Keep");
    expect(result.scope).toBe("new");
  });

  it("arrays replace (sources)", () => {
    const messages = [
      makeAssistantWithTool("update_monitoring_task", {
        sources: [{ type: "web", name: "Google" }],
      }, "m1"),
      makeAssistantWithTool("update_monitoring_task", {
        sources: [{ type: "news", name: "Reuters" }],
      }, "m2"),
    ];
    const result = deriveMonitoringTask(messages);
    expect(result.sources).toEqual([{ type: "news", name: "Reuters" }]);
  });

  it("arrays replace (entities)", () => {
    const messages = [
      makeAssistantWithTool("update_monitoring_task", {
        entities: [{ type: "company", name: "OpenAI" }],
      }, "m1"),
      makeAssistantWithTool("update_monitoring_task", {
        entities: [{ type: "person", name: "Sam Altman" }],
      }, "m2"),
    ];
    const result = deriveMonitoringTask(messages);
    expect(result.entities).toEqual([{ type: "person", name: "Sam Altman" }]);
  });

  it("objects merge (filters)", () => {
    const messages = [
      makeAssistantWithTool("update_monitoring_task", {
        filters: { language: "en" },
      }, "m1"),
      makeAssistantWithTool("update_monitoring_task", {
        filters: { region: "US" },
      }, "m2"),
    ];
    const result = deriveMonitoringTask(messages);
    expect(result.filters).toEqual({ language: "en", region: "US" });
  });

  it("ignores present_options and finalize_task calls", () => {
    const messages = [
      makeAssistantWithTool("present_options", { question: "?" }, "m1"),
      makeAssistantWithTool("update_monitoring_task", { title: "Real" }, "m2"),
      makeAssistantWithTool("finalize_task", { summary: "done" }, "m3"),
    ];
    const result = deriveMonitoringTask(messages);
    expect(result.title).toBe("Real");
    expect(result).not.toHaveProperty("question");
    expect(result).not.toHaveProperty("summary");
  });

  it("handles messages without parts", () => {
    const msg = { id: "m1", role: "assistant" as const, content: "hi" };
    // @ts-expect-error - testing missing parts
    expect(deriveMonitoringTask([msg])).toEqual({});
  });
});
