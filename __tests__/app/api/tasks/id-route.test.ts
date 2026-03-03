import { beforeEach, describe, expect, it, vi } from "vitest";

const mockFindUnique = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    monitoringTask: {
      findUnique: (...args: unknown[]) => mockFindUnique(...args),
      update: (...args: unknown[]) => mockUpdate(...args),
      delete: (...args: unknown[]) => mockDelete(...args),
    },
  },
}));

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

import { DELETE, GET, PATCH } from "@/app/api/tasks/[id]/route";

function makeParams(id = "t1") {
  return { params: Promise.resolve({ id }) };
}

function makePatchReq(body: unknown) {
  return new Request("http://localhost/api/tasks/t1", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/tasks/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET returns 401 when unauthed", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET(new Request("http://localhost/api/tasks/t1"), makeParams());
    expect(res.status).toBe(401);
  });

  it("GET returns task for owner", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } });
    mockFindUnique.mockResolvedValue({
      id: "t1",
      userId: "u1",
      title: "Bitcoin Monitor",
      config: { scope: "crypto" },
      scope: "crypto",
      keywords: ["btc"],
      entities: [{ type: "topic", name: "Bitcoin" }],
      sources: [{ type: "news", name: "News" }],
      frequency: "daily",
      filters: null,
      summary: "summary",
    });

    const res = await GET(new Request("http://localhost/api/tasks/t1"), makeParams());
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.title).toBe("Bitcoin Monitor");
    expect(json.scope).toBe("crypto");
  });

  it("PATCH updates config and normalized columns", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } });
    mockFindUnique.mockResolvedValue({ id: "t1", userId: "u1" });
    mockUpdate.mockResolvedValue({ id: "t1" });

    const res = await PATCH(
      makePatchReq({
        title: "Updated",
        config: {
          scope: "crypto",
          keywords: ["btc"],
          entities: [{ type: "topic", name: "Bitcoin" }],
          sources: [{ type: "news", name: "News" }],
          frequency: "daily",
        },
      }),
      makeParams()
    );

    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "t1" },
      data: expect.objectContaining({
        title: "Updated",
        scope: "crypto",
        keywords: ["btc"],
        frequency: "daily",
      }),
    });
  });

  it("DELETE removes owned task", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } });
    mockFindUnique.mockResolvedValue({ id: "t1", userId: "u1" });

    const res = await DELETE(new Request("http://localhost/api/tasks/t1"), makeParams());
    expect(res.status).toBe(204);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "t1" } });
  });
});
