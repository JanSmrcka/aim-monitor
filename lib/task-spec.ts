import type { MonitoringEntity, MonitoringFilters, MonitoringSource, MonitoringTask } from "@/lib/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object";
}

function readString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function readStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const normalized = value.filter((item): item is string => typeof item === "string" && item.length > 0);
  return normalized.length > 0 ? normalized : [];
}

function readEntities(value: unknown): MonitoringEntity[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const normalized: MonitoringEntity[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    const type = item.type;
    const name = item.name;
    if (
      (type === "company" ||
        type === "person" ||
        type === "topic" ||
        type === "product" ||
        type === "ticker") &&
      typeof name === "string"
    ) {
      normalized.push({
        type,
        name,
        description: typeof item.description === "string" ? item.description : undefined,
      });
    }
  }

  return normalized.length > 0 ? normalized : [];
}

function readSources(value: unknown): MonitoringSource[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const normalized: MonitoringSource[] = [];
  for (const item of value) {
    if (!isRecord(item)) continue;
    const type = item.type;
    const name = item.name;
    if (
      (type === "web" ||
        type === "news" ||
        type === "social" ||
        type === "sec" ||
        type === "arxiv" ||
        type === "rss" ||
        type === "custom") &&
      typeof name === "string"
    ) {
      normalized.push({ type, name });
    }
  }

  return normalized.length > 0 ? normalized : [];
}

function readFilters(value: unknown): MonitoringFilters | undefined {
  if (!isRecord(value)) return undefined;
  const filters: MonitoringFilters = {};
  if (typeof value.language === "string") filters.language = value.language;
  if (typeof value.region === "string") filters.region = value.region;
  if (typeof value.minRelevance === "number") filters.minRelevance = value.minRelevance;
  if (Array.isArray(value.excludeKeywords)) {
    filters.excludeKeywords = value.excludeKeywords.filter(
      (item): item is string => typeof item === "string" && item.length > 0
    );
  }
  return Object.keys(filters).length > 0 ? filters : undefined;
}

export function normalizeTaskSpecColumns(input: unknown): {
  scope: string | null;
  keywords: string[];
  entities: unknown | null;
  sources: unknown | null;
  frequency: string | null;
  filters: unknown | null;
} {
  const record = isRecord(input) ? input : {};
  const entities = readEntities(record.entities);
  const sources = readSources(record.sources);
  const filters = readFilters(record.filters);

  return {
    scope: readString(record.scope) ?? null,
    keywords: readStringArray(record.keywords) ?? [],
    entities: entities ?? null,
    sources: sources ?? null,
    frequency: readString(record.frequency) ?? null,
    filters: filters ?? null,
  };
}

export function monitoringTaskFromStoredTask(task: {
  title: string;
  scope?: string | null;
  keywords?: string[] | null;
  entities?: unknown;
  sources?: unknown;
  frequency?: string | null;
  filters?: unknown;
  config?: unknown;
}): MonitoringTask {
  const fromConfig = isRecord(task.config) ? task.config : {};
  const storedKeywords = Array.isArray(task.keywords)
    ? task.keywords.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];

  const scope = task.scope ?? readString(fromConfig.scope);
  const keywords = storedKeywords.length > 0 ? storedKeywords : readStringArray(fromConfig.keywords);
  const entities = readEntities(task.entities) ?? readEntities(fromConfig.entities);
  const sources = readSources(task.sources) ?? readSources(fromConfig.sources);
  const frequency = task.frequency ?? readString(fromConfig.frequency);
  const filters = readFilters(task.filters) ?? readFilters(fromConfig.filters);

  return {
    title: task.title,
    scope,
    keywords,
    entities,
    sources,
    frequency: frequency as MonitoringTask["frequency"] | undefined,
    filters,
  };
}
