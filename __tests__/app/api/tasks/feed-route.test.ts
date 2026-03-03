import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindUnique = vi.fn();
vi.mock("@/lib/prisma", () => ({
  prisma: {
    monitoringTask: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
    },
  },
}));

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

const mockGetMonitorFeed = vi.fn();
vi.mock("@/lib/feeds/mock-provider", () => ({
  mockFeedProvider: {
    getMonitorFeed: (...args: unknown[]) => mockGetMonitorFeed(...args),
  },
}));

import { GET } from "@/app/api/tasks/[id]/feed/route";

describe("GET /api/tasks/[id]/feed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthed", async () => {
    mockAuth.mockResolvedValue(null);

    const req = new Request("http://localhost/api/tasks/t1/feed?limit=3");
    const res = await GET(req, { params: Promise.resolve({ id: "t1" }) });

    expect(res.status).toBe(401);
  });

  it("returns 404 for non-owned task", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } });
    mockFindUnique.mockResolvedValue({ id: "t1", userId: "u2" });

    const req = new Request("http://localhost/api/tasks/t1/feed?limit=3");
    const res = await GET(req, { params: Promise.resolve({ id: "t1" }) });

    expect(res.status).toBe(404);
  });

  it("returns mocked feed payload", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } });
    mockFindUnique.mockResolvedValue({
      id: "t1",
      userId: "u1",
      title: "Bitcoin monitor",
      config: {},
      scope: null,
      keywords: [],
      entities: null,
      sources: null,
      frequency: null,
      filters: null,
    });
    mockGetMonitorFeed.mockResolvedValue({
      items: [{ id: "f1", title: "headline" }],
      nextCursor: null,
      source: "mock",
    });

    const req = new Request("http://localhost/api/tasks/t1/feed?limit=3");
    const res = await GET(req, { params: Promise.resolve({ id: "t1" }) });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.source).toBe("mock");
    expect(mockGetMonitorFeed).toHaveBeenCalledWith(expect.any(Object), {
      limit: 3,
      cursor: undefined,
    });
  });
});
