CREATE SCHEMA IF NOT EXISTS "public";

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "MonitoringTask" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "scope" TEXT,
  "keywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "entities" JSONB,
  "sources" JSONB,
  "frequency" TEXT,
  "filters" JSONB,
  "summary" TEXT,
  "config" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MonitoringTask_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "MonitoringTask" ADD COLUMN IF NOT EXISTS "scope" TEXT;
ALTER TABLE "MonitoringTask" ADD COLUMN IF NOT EXISTS "keywords" TEXT[];
ALTER TABLE "MonitoringTask" ALTER COLUMN "keywords" SET DEFAULT ARRAY[]::TEXT[];
UPDATE "MonitoringTask" SET "keywords" = ARRAY[]::TEXT[] WHERE "keywords" IS NULL;
ALTER TABLE "MonitoringTask" ALTER COLUMN "keywords" SET NOT NULL;
ALTER TABLE "MonitoringTask" ADD COLUMN IF NOT EXISTS "entities" JSONB;
ALTER TABLE "MonitoringTask" ADD COLUMN IF NOT EXISTS "sources" JSONB;
ALTER TABLE "MonitoringTask" ADD COLUMN IF NOT EXISTS "frequency" TEXT;
ALTER TABLE "MonitoringTask" ADD COLUMN IF NOT EXISTS "filters" JSONB;
ALTER TABLE "MonitoringTask" ADD COLUMN IF NOT EXISTS "summary" TEXT;

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

CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE INDEX IF NOT EXISTS "MonitoringTask_userId_createdAt_idx" ON "MonitoringTask"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "MonitoringTask_userId_updatedAt_idx" ON "MonitoringTask"("userId", "updatedAt");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Account_userId_fkey') THEN
    ALTER TABLE "Account"
      ADD CONSTRAINT "Account_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Session_userId_fkey') THEN
    ALTER TABLE "Session"
      ADD CONSTRAINT "Session_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MonitoringTask_userId_fkey') THEN
    ALTER TABLE "MonitoringTask"
      ADD CONSTRAINT "MonitoringTask_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
