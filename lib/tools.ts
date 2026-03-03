import { z } from "zod";
import { tool, jsonSchema } from "ai";

export const presentOptionsSchema = z.object({
  question: z.string().describe("The question to ask the user"),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
      })
    )
    .min(1)
    .describe("Available options"),
  allowMultiple: z.boolean().optional().describe("Allow selecting multiple options"),
});

export const updateMonitoringTaskSchema = z.object({
  title: z.string().optional(),
  scope: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  entities: z
    .array(
      z.object({
        type: z.enum(["company", "person", "topic", "product", "ticker"]),
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .optional(),
  sources: z
    .array(
      z.object({
        type: z.enum(["web", "news", "social", "sec", "arxiv", "rss", "custom"]),
        name: z.string(),
      })
    )
    .optional(),
  frequency: z.enum(["realtime", "hourly", "daily", "weekly"]).optional(),
  filters: z
    .object({
      language: z.string().optional(),
      region: z.string().optional(),
      minRelevance: z.number().optional(),
      excludeKeywords: z.array(z.string()).optional(),
    })
    .optional(),
});

export const finalizeTaskSchema = z.object({
  summary: z.string().describe("Summary of the finalized monitoring task"),
});

export const tools = {
  present_options: tool({
    description: "Present options to the user as clickable chips",
    inputSchema: jsonSchema({
      type: "object",
      properties: {
        question: { type: "string", description: "The question to ask the user" },
        options: {
          type: "array",
          description: "Available options",
          items: {
            type: "object",
            properties: {
              label: { type: "string" },
              value: { type: "string" },
              description: { type: "string" },
              icon: { type: "string" },
            },
            required: ["label", "value"],
            additionalProperties: false,
          },
          minItems: 1,
        },
        allowMultiple: { type: "boolean", description: "Allow selecting multiple options" },
      },
      required: ["question", "options"],
      additionalProperties: false,
    }),
    execute: async (args) => args,
  }),
  update_monitoring_task: tool({
    description: "Update the monitoring task configuration based on user responses",
    inputSchema: jsonSchema({
      type: "object",
      properties: {
        title: { type: "string" },
        scope: { type: "string" },
        keywords: { type: "array", items: { type: "string" } },
        entities: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["company", "person", "topic", "product", "ticker"] },
              name: { type: "string" },
              description: { type: "string" },
            },
            required: ["type", "name"],
            additionalProperties: false,
          },
        },
        sources: {
          type: "array",
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["web", "news", "social", "sec", "arxiv", "rss", "custom"] },
              name: { type: "string" },
            },
            required: ["type", "name"],
            additionalProperties: false,
          },
        },
        frequency: { type: "string", enum: ["realtime", "hourly", "daily", "weekly"] },
        filters: {
          type: "object",
          properties: {
            language: { type: "string" },
            region: { type: "string" },
            minRelevance: { type: "number" },
            excludeKeywords: { type: "array", items: { type: "string" } },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    }),
    execute: async (args) => args,
  }),
  finalize_task: tool({
    description: "Finalize the monitoring task when all required fields are defined",
    inputSchema: jsonSchema({
      type: "object",
      properties: {
        summary: { type: "string", description: "Summary of the finalized monitoring task" },
      },
      required: ["summary"],
      additionalProperties: false,
    }),
    execute: async (args) => args,
  }),
};
