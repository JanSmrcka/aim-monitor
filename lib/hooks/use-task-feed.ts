import { useQuery } from "@tanstack/react-query";
import type { FeedResult } from "@/lib/feeds/types";

type FeedSeed = {
  title?: string | null;
  scope?: string | null;
  frequency?: string | null;
  keywords?: string[];
};

async function fetchTaskFeed(taskId: string, limit: number, seed?: FeedSeed): Promise<FeedResult> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (seed?.title) params.set("title", seed.title);
  if (seed?.scope) params.set("scope", seed.scope);
  if (seed?.frequency) params.set("frequency", seed.frequency);
  if (seed?.keywords && seed.keywords.length > 0) {
    params.set("keywords", seed.keywords.join(","));
  }

  const res = await fetch(`/api/tasks/${taskId}/feed?${params.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch task feed");
  }
  return res.json();
}

export function useTaskFeed(
  taskId: string,
  options?: { limit?: number; refetchInterval?: number; seed?: FeedSeed }
) {
  const limit = options?.limit ?? 20;
  const refetchInterval = options?.refetchInterval ?? false;
  const seed = options?.seed;

  return useQuery({
    queryKey: ["task-feed", taskId, limit, seed?.title, seed?.scope, seed?.frequency, seed?.keywords?.join("|")],
    queryFn: () => fetchTaskFeed(taskId, limit, seed),
    enabled: !!taskId,
    refetchInterval,
    refetchOnWindowFocus: true,
  });
}
