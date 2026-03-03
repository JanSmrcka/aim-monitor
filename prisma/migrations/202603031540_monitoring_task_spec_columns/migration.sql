ALTER TABLE "MonitoringTask"
  ADD COLUMN "scope" TEXT,
  ADD COLUMN "keywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "entities" JSONB,
  ADD COLUMN "sources" JSONB,
  ADD COLUMN "frequency" TEXT,
  ADD COLUMN "filters" JSONB,
  ADD COLUMN "summary" TEXT;

UPDATE "MonitoringTask"
SET
  "scope" = COALESCE("scope", ("config"::jsonb ->> 'scope')),
  "keywords" = CASE
    WHEN jsonb_typeof("config"::jsonb -> 'keywords') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text("config"::jsonb -> 'keywords'))
    ELSE "keywords"
  END,
  "entities" = COALESCE("entities", ("config"::jsonb -> 'entities')),
  "sources" = COALESCE("sources", ("config"::jsonb -> 'sources')),
  "frequency" = COALESCE("frequency", ("config"::jsonb ->> 'frequency')),
  "filters" = COALESCE("filters", ("config"::jsonb -> 'filters'))
WHERE "config" IS NOT NULL;
