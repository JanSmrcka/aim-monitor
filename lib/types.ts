export interface MonitoringSource {
  type: "web" | "news" | "social" | "sec" | "arxiv" | "rss" | "custom";
  name: string;
}

export interface MonitoringEntity {
  type: "company" | "person" | "topic" | "product" | "ticker";
  name: string;
  description?: string;
}

export interface MonitoringFilters {
  language?: string;
  region?: string;
  minRelevance?: number;
  excludeKeywords?: string[];
}

export interface MonitoringTask {
  title?: string;
  scope?: string;
  keywords?: string[];
  entities?: MonitoringEntity[];
  sources?: MonitoringSource[];
  frequency?: "realtime" | "hourly" | "daily" | "weekly";
  filters?: MonitoringFilters;
}
