# Aim Monitor

AI-powered monitoring task builder. Describe what you want to monitor, AI creates the task.

## Tech Stack

Next.js 16 · React 19 · TypeScript · Prisma · PostgreSQL · NextAuth (GitHub OAuth) · shadcn/ui · Tailwind CSS 4 · Vercel

## Setup

```bash
pnpm install
cp .env.example .env   # fill in DATABASE_URL, AUTH_SECRET, GitHub OAuth creds
pnpm prisma db push
pnpm dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `AUTH_SECRET` | NextAuth secret (`openssl rand -base64 33`) |
| `AUTH_GITHUB_ID` | GitHub OAuth App ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth App Secret |

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | E2E tests (Playwright) |
| `pnpm prisma studio` | DB browser |

## Project Structure

```
app/                  # Next.js App Router
  api/auth/           # NextAuth API routes
  dashboard/          # Protected dashboard
  page.tsx            # Landing page
components/
  landing/            # Landing page components
  ui/                 # shadcn/ui components
lib/
  auth.ts             # NextAuth config
  prisma.ts           # Prisma client
prisma/
  schema.prisma       # DB schema
__tests__/            # Unit tests
e2e/                  # E2E tests
```
