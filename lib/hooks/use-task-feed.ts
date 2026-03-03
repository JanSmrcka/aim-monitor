import { useQuery } from "@tanstack/react-query";
import type { FeedResult } from "@/lib/feeds/types";

async function fetchTaskFeed(taskId: string, limit: number): Promise<FeedResult> {
  const res = await fetch(`/api/tasks/${taskId}/feed?limit=${limit}`);
  if (!res.ok) {
    throw new Error("Failed to fetch task feed");
  }
  return res.json();
}

export function useTaskFeed(taskId: string, options?: { limit?: number; refetchInterval?: number }) {
  const limit = options?.limit ?? 20;
  const refetchInterval = options?.refetchInterval ?? false;

  return useQuery({
    queryKey: ["task-feed", taskId, limit],
    queryFn: () => fetchTaskFeed(taskId, limit),
    enabled: !!taskId,
    refetchInterval,
    refetchOnWindowFocus: true,
  });
}
