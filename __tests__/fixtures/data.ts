export const mockUser = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  image: "https://example.com/avatar.jpg",
};

export const mockSession = {
  user: mockUser,
  expires: "2099-01-01T00:00:00.000Z",
};

export const mockTask = {
  id: "task-1",
  userId: "user-1",
  title: "Monitor AI Research",
  config: {
    scope: "AI research papers",
    keywords: ["LLM", "transformer"],
    sources: [{ type: "arxiv", name: "arXiv" }],
    frequency: "daily",
  },
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

export const mockTasks = [
  mockTask,
  {
    id: "task-2",
    userId: "user-1",
    title: "SEC Filings",
    config: {
      scope: "SEC filings for tech companies",
      sources: [{ type: "sec", name: "SEC EDGAR" }],
      frequency: "hourly",
    },
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];
