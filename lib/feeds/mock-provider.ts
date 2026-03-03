import type { FeedProvider } from "@/lib/feeds/provider";
import type { FeedItem, FeedSentiment } from "@/lib/feeds/types";
import type { MonitoringTask } from "@/lib/types";

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

const fallbackSources = ["Web", "Newswire", "Social", "Analyst Desk"];
const verbs = ["signals", "highlights", "flags", "tracks", "reports", "reveals"];
const contexts = [
  "market momentum",
  "regulatory movement",
  "adoption trend",
  "execution risk",
  "institutional attention",
  "community reaction",
];
const angles = [
  "with elevated discussion volume",
  "after a notable policy update",
  "as sentiment shifts across channels",
  "with stronger-than-usual engagement",
  "alongside cross-source confirmation",
  "with mixed market reaction",
];

function getFocusTerms(task: MonitoringTask): string[] {
  const terms = [
    ...(task.keywords ?? []),
    ...(task.entities?.map((entity) => entity.name) ?? []),
    ...(task.scope ? [task.scope] : []),
    ...(task.title ? [task.title] : []),
  ]
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (terms.length === 0) return ["monitor topic"];

  return Array.from(new Set(terms));
}

function getSourceNames(task: MonitoringTask): string[] {
  const fromTask = (task.sources ?? []).map((source) => source.name).filter((name) => name.length > 0);
  return fromTask.length > 0 ? fromTask : fallbackSources;
}

function sentimentFromSeed(seed: number): FeedSentiment {
  const score = seed % 3;
  if (score === 0) return "positive";
  if (score === 1) return "neutral";
  return "negative";
}

function generateItems(task: MonitoringTask, total: number): FeedItem[] {
  const terms = getFocusTerms(task);
  const sources = getSourceNames(task);
  const seedBase = hashString(JSON.stringify({
    title: task.title,
    scope: task.scope,
    keywords: task.keywords,
    entities: task.entities,
    sources: task.sources,
    frequency: task.frequency,
  }));
  const baseTimestamp = Date.UTC(2026, 2, 3, 12, 0, 0) + (seedBase % 3600) * 1000;

  return Array.from({ length: total }, (_, idx) => {
    const seed = seedBase + idx * 7919;
    const term = pick(terms, seed + 3);
    const source = pick(sources, seed + 7);
    const verb = pick(verbs, seed + 11);
    const context = pick(contexts, seed + 13);
    const angle = pick(angles, seed + 17);

    const publishedAt = new Date(baseTimestamp - idx * 36 * 60 * 1000).toISOString();

    return {
      id: `mock-${seed}-${idx}`,
      title: `${term}: ${source} ${verb} ${context}`,
      summary: `${source} coverage mentions ${term} ${angle}. This is mock feed data, ready to swap for live API results.`,
      source,
      sourceType: task.sources?.[0]?.type,
      url: `https://example.com/monitor/${encodeURIComponent(term.toLowerCase())}/${idx + 1}`,
      publishedAt,
      relevance: 60 + (seed % 40),
      sentiment: sentimentFromSeed(seed),
    } satisfies FeedItem;
  });
}

export const mockFeedProvider: FeedProvider = {
  async getMonitorFeed(task, options) {
    const totalItems = 60;
    const items = generateItems(task, totalItems);

    const requestedLimit = options?.limit ?? 20;
    const limit = Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 50) : 20;
    const cursorOffsetRaw = options?.cursor ? Number.parseInt(options.cursor, 10) : 0;
    const offset = Number.isFinite(cursorOffsetRaw) && cursorOffsetRaw >= 0 ? cursorOffsetRaw : 0;

    const page = items.slice(offset, offset + limit);
    const nextCursor = offset + limit < items.length ? String(offset + limit) : null;

    return {
      items: page,
      nextCursor,
      source: "mock",
    };
  },
};
