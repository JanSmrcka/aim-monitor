import { createAzure } from "@ai-sdk/azure";
import { toolParameterSchemas } from "@/lib/tool-schemas";

export const azure = createAzure({
  resourceName: process.env.AZURE_RESOURCE_NAME,
  apiKey: process.env.AZURE_API_KEY,
  fetch: async (url, init) => {
    // Patch tool schemas — AI SDK strips them due to Zod compat issue
    if (init?.body && typeof init.body === "string") {
      try {
        const body = JSON.parse(init.body);
        if (body?.tools) {
          for (const t of body.tools) {
            // Chat Completions format: {type:"function", function:{name, parameters}}
            // Responses API format: {type:"function", name, parameters} or same as above
            const name = t.function?.name ?? t.name;
            if (name && toolParameterSchemas[name]) {
              if (t.function) {
                t.function.parameters = toolParameterSchemas[name];
              }
              if (t.parameters !== undefined && !t.function) {
                t.parameters = toolParameterSchemas[name];
              }
            }
          }
          init = { ...init, body: JSON.stringify(body) };
        }
      } catch {
        // Keep original request body when parsing fails.
      }
    }
    return fetch(url, init);
  },
});
