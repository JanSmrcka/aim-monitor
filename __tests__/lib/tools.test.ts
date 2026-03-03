import { describe, it, expect } from "vitest";
import { presentOptionsSchema, updateMonitoringTaskSchema, finalizeTaskSchema } from "@/lib/tools";

describe("Tool schemas", () => {
  describe("presentOptionsSchema", () => {
    it("accepts valid input", () => {
      const result = presentOptionsSchema.safeParse({
        question: "What sources?",
        options: [{ label: "Web", value: "web" }],
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing question", () => {
      const result = presentOptionsSchema.safeParse({
        options: [{ label: "Web", value: "web" }],
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty options", () => {
      const result = presentOptionsSchema.safeParse({
        question: "What sources?",
        options: [],
      });
      expect(result.success).toBe(false);
    });

    it("accepts allowMultiple flag", () => {
      const result = presentOptionsSchema.safeParse({
        question: "Select sources",
        options: [{ label: "Web", value: "web" }],
        allowMultiple: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("updateMonitoringTaskSchema", () => {
    it("accepts partial fields", () => {
      const result = updateMonitoringTaskSchema.safeParse({ title: "Test" });
      expect(result.success).toBe(true);
    });

    it("accepts empty object", () => {
      const result = updateMonitoringTaskSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts full config", () => {
      const result = updateMonitoringTaskSchema.safeParse({
        title: "Monitor AI",
        scope: "AI research",
        keywords: ["LLM"],
        entities: [{ type: "company", name: "OpenAI" }],
        sources: [{ type: "web", name: "Google" }],
        frequency: "daily",
        filters: { language: "en" },
      });
      expect(result.success).toBe(true);
    });
  });

  describe("finalizeTaskSchema", () => {
    it("requires summary", () => {
      const result = finalizeTaskSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    it("accepts valid summary", () => {
      const result = finalizeTaskSchema.safeParse({ summary: "Task complete" });
      expect(result.success).toBe(true);
    });
  });
});
