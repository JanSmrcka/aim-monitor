export type FeedSentiment = "positive" | "neutral" | "negative";

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceType?: string;
  url: string;
  publishedAt: string;
  relevance: number;
  sentiment: FeedSentiment;
}

export interface FeedResult {
  items: FeedItem[];
  nextCursor: string | null;
  source: "mock";
}
