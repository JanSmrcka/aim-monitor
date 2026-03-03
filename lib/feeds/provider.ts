import type { MonitoringTask } from "@/lib/types";
import type { FeedResult } from "@/lib/feeds/types";

export interface FeedProvider {
  getMonitorFeed(task: MonitoringTask, options?: { limit?: number; cursor?: string }): Promise<FeedResult>;
}
