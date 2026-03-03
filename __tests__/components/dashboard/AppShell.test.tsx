import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AppShell } from "@/components/dashboard/AppShell";
import { mockUser } from "@/__tests__/fixtures/data";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/auth", () => ({
  signOut: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/dashboard",
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
    expect(screen.getByText("Monitor Ops")).toBeInTheDocument();
  });

  it("routes to new monitor page on New Monitor", async () => {
    renderWithQuery(
      <AppShell user={mockUser}>
        <div>content</div>
      </AppShell>
    );

    await userEvent.click(screen.getByRole("button", { name: /new monitor/i }));
    expect(mockPush).toHaveBeenCalledWith("/dashboard/new");
  });
});
