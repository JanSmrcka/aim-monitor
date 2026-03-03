import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LoginPage from "@/app/login/page";

// Mock the auth module (server action can't run in jsdom)
vi.mock("@/lib/auth", () => ({
  signIn: vi.fn(),
}));

describe("Login page", () => {
  it("renders app title", () => {
    render(<LoginPage />);
    expect(screen.getByText("AIM Monitor")).toBeInTheDocument();
  });

  it("renders sign-in description", () => {
    render(<LoginPage />);
    expect(screen.getByText("Sign in to your account")).toBeInTheDocument();
  });

  it("renders GitHub login button", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("button", { name: /continue with github/i })
    ).toBeInTheDocument();
  });
});
