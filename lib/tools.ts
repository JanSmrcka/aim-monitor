import { z } from "zod";
import { tool } from "ai";

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
    parameters: presentOptionsSchema,
  }),
  update_monitoring_task: tool({
    description: "Update the monitoring task configuration based on user responses",
    parameters: updateMonitoringTaskSchema,
  }),
  finalize_task: tool({
    description: "Finalize the monitoring task when all required fields are defined",
    parameters: finalizeTaskSchema,
  }),
};
