import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppShell } from "@/components/dashboard/AppShell";
import { mockUser } from "@/__tests__/fixtures/data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/auth", () => ({
  signOut: vi.fn(),
}));

function renderWithQuery(ui: React.ReactNode) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

describe("AppShell", () => {
  it("renders sidebar area", () => {
    renderWithQuery(
      <AppShell user={mockUser}>
        <div>content</div>
      </AppShell>
    );
    expect(screen.getByText("New Monitor")).toBeInTheDocument();
  });

  it("renders children in main area", () => {
    renderWithQuery(
      <AppShell user={mockUser}>
        <div>test content</div>
      </AppShell>
    );
    expect(screen.getByText("test content")).toBeInTheDocument();
  });

  it("renders user menu", () => {
    renderWithQuery(
      <AppShell user={mockUser}>
        <div>content</div>
      </AppShell>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });
});
