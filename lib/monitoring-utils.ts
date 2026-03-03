import type { UIMessage } from "ai";
import type { MonitoringTask } from "@/lib/types";

export function deriveMonitoringTask(messages: UIMessage[]): MonitoringTask {
  let task: MonitoringTask = {};

  for (const msg of messages) {
    if (!msg.parts) continue;
    for (const part of msg.parts) {
      if (
        part.type === "tool-invocation" &&
        part.toolName === "update_monitoring_task" &&
        part.state === "result"
      ) {
        const args = part.args as Partial<MonitoringTask>;
        task = {
          ...task,
          ...args,
          entities: args.entities ?? task.entities,
          sources: args.sources ?? task.sources,
          filters: { ...task.filters, ...args.filters },
        };
      }
    }
  }

  return task;
}
