import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { LandingPage } from "@/components/landing/LandingPage";

// Mock the auth module (server actions can't run in jsdom)
vi.mock("@/lib/auth", () => ({
  signIn: vi.fn(),
}));

describe("Landing page", () => {
  it("renders hero headline", () => {
    render(<LandingPage />);
    expect(screen.getByText(/Monitor what matters/)).toBeInTheDocument();
  });

  it("renders sign-in buttons", () => {
    render(<LandingPage />);
    const buttons = screen.getAllByRole("button", { name: /sign in/i });
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it("renders get started CTA", () => {
    render(<LandingPage />);
    expect(
      screen.getByRole("button", { name: /get started/i })
    ).toBeInTheDocument();
  });
});
