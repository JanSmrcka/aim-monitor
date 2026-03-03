// Raw JSON schemas for Azure OpenAI tools
// Used to patch the request because AI SDK + Zod v3.25 + Turbopack strips schemas

export const toolParameterSchemas: Record<string, object> = {
  present_options: {
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
  },
  update_monitoring_task: {
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
  },
  finalize_task: {
    type: "object",
    properties: {
      summary: { type: "string", description: "Summary of the finalized monitoring task" },
    },
    required: ["summary"],
    additionalProperties: false,
  },
};
