"use client";

import { useTaskFeed } from "@/lib/hooks/use-task-feed";
import { FeedList } from "@/components/monitoring/FeedList";

export function MonitorFeedPreview({ taskId }: { taskId: string }) {
  const { data, isLoading, isError } = useTaskFeed(taskId, { limit: 3, refetchInterval: 15000 });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900/55" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <p className="text-xs text-zinc-500">Feed preview unavailable</p>;
  }

  if (data.items.length === 0) {
    return <p className="text-xs text-zinc-500">No items yet</p>;
  }

  return <FeedList items={data.items} compact />;
}
