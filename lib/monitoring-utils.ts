import type { UIMessage } from "ai";
import { isToolUIPart, getToolName } from "ai";
import type { MonitoringTask } from "@/lib/types";

export function deriveMonitoringTask(messages: UIMessage[]): MonitoringTask {
  let task: MonitoringTask = {};

  for (const msg of messages) {
    if (!msg.parts) continue;
    for (const part of msg.parts) {
      if (
        isToolUIPart(part) &&
        getToolName(part) === "update_monitoring_task" &&
        part.state === "output-available"
      ) {
        const input = part.input as Partial<MonitoringTask>;
        task = {
          ...task,
          ...input,
          entities: input.entities ?? task.entities,
          sources: input.sources ?? task.sources,
          filters: { ...task.filters, ...input.filters },
        };
      }
    }
  }

  return task;
}
