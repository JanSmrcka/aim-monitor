import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindMany = vi.fn();
const mockCreate = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    monitoringTask: {
      findMany: (...args: unknown[]) => mockFindMany(...args),
      create: (...args: unknown[]) => mockCreate(...args),
    },
  },
}));

const mockAuth = vi.fn();
vi.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
}));

import { GET, POST } from "@/app/api/tasks/route";

function makeReq(body?: unknown): Request {
  return new Request("http://localhost/api/tasks", {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
}

describe("GET /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthed", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns user tasks", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } });
    mockFindMany.mockResolvedValue([
      { id: "t1", title: "Test", config: {}, createdAt: new Date(), updatedAt: new Date() },
    ]);
    const res = await GET();
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Test");
  });
});

describe("POST /api/tasks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when unauthed", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeReq({ title: "X", config: {} }));
    expect(res.status).toBe(401);
  });

  it("creates task and returns 201", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } });
    mockCreate.mockResolvedValue({ id: "t1", title: "New", config: {} });
    const res = await POST(makeReq({ title: "New", config: { scope: "test" } }));
    expect(res.status).toBe(201);
    expect(mockCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: "u1", title: "New" }),
    });
  });

  it("validates required fields", async () => {
    mockAuth.mockResolvedValue({ user: { id: "u1" } });
    const res = await POST(makeReq({}));
    expect(res.status).toBe(400);
  });
});
