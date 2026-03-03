"use client";

import { useTaskFeed } from "@/lib/hooks/use-task-feed";
import { FeedList } from "@/components/monitoring/FeedList";

function sectionForDate(isoDate: string): "Now" | "Today" | "Earlier" {
  const date = new Date(isoDate);
  if (!Number.isFinite(date.getTime())) return "Earlier";

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff <= 60 * 60 * 1000) return "Now";

  const sameDay =
    now.getUTCFullYear() === date.getUTCFullYear() &&
    now.getUTCMonth() === date.getUTCMonth() &&
    now.getUTCDate() === date.getUTCDate();
  if (sameDay) return "Today";

  return "Earlier";
}

export function MonitorFeedPanel({ taskId }: { taskId: string }) {
  const { data, isLoading, isError } = useTaskFeed(taskId, { limit: 20, refetchInterval: 15000 });

  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/60" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4">
        <div className="rounded-xl border border-rose-300/20 bg-rose-300/5 p-3 text-sm text-rose-100">
          Feed unavailable. Retrying automatically.
        </div>
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <div className="p-4">
        <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-3 text-sm text-zinc-300">
          No feed items yet for this monitor.
        </div>
      </div>
    );
  }

  const grouped = {
    Now: data.items.filter((item) => sectionForDate(item.publishedAt) === "Now"),
    Today: data.items.filter((item) => sectionForDate(item.publishedAt) === "Today"),
    Earlier: data.items.filter((item) => sectionForDate(item.publishedAt) === "Earlier"),
  };

  return (
    <div className="space-y-4 p-4">
      {(Object.keys(grouped) as Array<keyof typeof grouped>).map((section) => {
        const items = grouped[section];
        if (items.length === 0) return null;

        return (
          <section key={section}>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">{section}</p>
            <FeedList items={items} />
          </section>
        );
      })}
    </div>
  );
}
