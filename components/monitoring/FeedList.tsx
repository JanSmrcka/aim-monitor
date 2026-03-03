"use client";

import type { FeedItem } from "@/lib/feeds/types";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Newspaper, TrendingUp, AlertTriangle, Minus } from "lucide-react";

function formatRelativeTime(isoDate: string): string {
  const timestamp = new Date(isoDate).getTime();
  if (!Number.isFinite(timestamp)) return "now";
  const diff = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(diff / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function sentimentIcon(sentiment: FeedItem["sentiment"]) {
  if (sentiment === "positive") return <TrendingUp className="h-3.5 w-3.5 text-emerald-300" />;
  if (sentiment === "negative") return <AlertTriangle className="h-3.5 w-3.5 text-rose-300" />;
  return <Minus className="h-3.5 w-3.5 text-zinc-400" />;
}

export function FeedList({
  items,
  compact = false,
}: {
  items: FeedItem[];
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {items.map((item) => (
        <article
          key={item.id}
          className={
            compact
              ? "rounded-xl border border-zinc-800/80 bg-zinc-900/65 p-3"
              : "rounded-xl border border-zinc-800/80 bg-zinc-900/65 p-3.5"
          }
        >
          <div className="mb-2 flex items-start justify-between gap-3">
            <p className={compact ? "text-sm font-medium text-zinc-100" : "text-sm font-medium leading-relaxed text-zinc-100"}>
              {item.title}
            </p>
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="mt-0.5 shrink-0 rounded-md p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
              aria-label="Open source link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {!compact ? <p className="mb-2 text-sm leading-relaxed text-zinc-300">{item.summary}</p> : null}

          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="border border-amber-300/20 bg-amber-300/10 text-[10px] text-amber-100">
              <Newspaper className="h-3 w-3" />
              {item.source}
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-[10px] text-zinc-300">
              {formatRelativeTime(item.publishedAt)}
            </Badge>
            <Badge variant="outline" className="border-zinc-700 text-[10px] text-zinc-300">
              Relevance {item.relevance}
            </Badge>
            <span className="ml-0.5 inline-flex items-center gap-1 text-[11px] text-zinc-400">
              {sentimentIcon(item.sentiment)}
              {item.sentiment}
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
