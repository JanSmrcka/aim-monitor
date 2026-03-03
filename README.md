# Aim Monitor

AI-powered monitoring task builder prototype.

Users describe what they want to monitor, an LLM agent asks structured follow-ups through clickable options, and the app continuously builds a live monitor spec.

## Current Product Flow

- `/` - landing page
- `/dashboard` - monitor board (all monitors + latest 3 feed previews per monitor)
- `/dashboard/new` - monitor creation flow (chat + live monitor spec)
- `/dashboard/monitors/[id]` - monitor detail (feed timeline + monitor spec)

## Monitoring Schema

Core spec object used by the chat builder:

```ts
type MonitoringTask = {
  title?: string
  scope?: string
  keywords?: string[]
  entities?: Array<{
    type: "company" | "person" | "topic" | "product" | "ticker"
    name: string
    description?: string
  }>
  sources?: Array<{
    type: "web" | "news" | "social" | "sec" | "arxiv" | "rss" | "custom"
    name: string
  }>
  frequency?: "realtime" | "hourly" | "daily" | "weekly"
  filters?: {
    language?: string
    region?: string
    minRelevance?: number
    excludeKeywords?: string[]
  }
}
```

DB stores both:

- normalized task columns (`scope`, `keywords`, `entities`, `sources`, `frequency`, `filters`, `summary`)
- full raw `config` JSON for compatibility/fallback

## Agent Contract

The LLM is tool-driven (not free-form only):

- `present_options` - renders clickable options in chat
- `update_monitoring_task` - sends structured partial updates
- `finalize_task` - sends final summary for confirmation

This keeps UI deterministic and easy to validate/persist.

## Feed Architecture (Mock Today, Live-Ready)

- API: `GET /api/tasks/[id]/feed`
- Source: mock provider (`lib/feeds/mock-provider.ts`)
- UI refresh: polling every 15s via React Query
- Response contract is stable, so provider can be swapped to real ingestion later.

## Tech Stack

Next.js 16 · React 19 · TypeScript · Prisma · PostgreSQL · NextAuth (GitHub OAuth) · AI SDK · shadcn/ui · Tailwind CSS 4 · Vercel

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy env file and fill values:

```bash
cp .env.example .env
```

3. Start PostgreSQL locally (required before migrations).

Homebrew example:

```bash
brew install postgresql@16
brew services start postgresql@16
pg_isready
```

Docker example:

```bash
docker run --name aim-postgres \
  -e POSTGRES_USER=<your-user> \
  -e POSTGRES_PASSWORD=<your-password> \
  -e POSTGRES_DB=<your-db-name> \
  -p 5432:5432 -d postgres:16
```

Optional DB connectivity check:

```bash
psql "$DATABASE_URL" -c "select 1;"
```

4. Run migrations:

```bash
pnpm prisma migrate dev
```

5. Start dev server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Deploy Notes (Vercel)

Before/with deploy, run DB migrations in the target environment:

```bash
pnpm prisma migrate deploy
```

Do not rely on `db push` in production.

This repo includes `vercel.json` with:

```json
{ "buildCommand": "pnpm build:vercel" }
```

So Vercel runs `prisma migrate deploy` before `next build` automatically.

### Production Troubleshooting

- `The table public.Account does not exist` means migrations were not applied to the production DB.
- Fix: run `pnpm prisma migrate deploy` against production `DATABASE_URL`, then redeploy.
- If Postgres logs SSL mode warning (`prefer/require/verify-ca aliasing`), prefer explicit:
  - `sslmode=verify-full` (current strong behavior), or
  - `uselibpqcompat=true&sslmode=require` (libpq-compatible behavior).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | Auth.js secret (generate with `openssl rand -base64 33`) |
| `AUTH_GITHUB_ID` | yes | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | yes | GitHub OAuth app client secret |
| `AZURE_RESOURCE_NAME` | yes (for chat) | Azure OpenAI resource name |
| `AZURE_API_KEY` | yes (for chat) | Azure OpenAI API key |
| `AZURE_CHAT_MODEL` | optional | Azure deployment/model name override (default: `gpt-5-hiring`) |
| `NEXTAUTH_URL` | optional | Useful in some local/prod setups |

Note: the UI can load without Azure envs, but `/dashboard/new` chat generation will not work.

## Useful Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Run dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint |
| `pnpm test:run` | Run all unit tests |
| `pnpm test:e2e` | Playwright E2E |
| `pnpm prisma studio` | Prisma Studio |

## Project Structure (High Level)

```text
app/
  api/
    chat/
    tasks/
  dashboard/
    page.tsx              # monitor board
    new/page.tsx          # chat builder
    monitors/[id]/page.tsx
components/
  chat/
  dashboard/
  monitoring/
  landing/
  ui/
lib/
  feeds/
  hooks/
  tools + prompt + parsing
prisma/
  schema.prisma
  migrations/
```
