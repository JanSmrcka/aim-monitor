import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { mockUser } from "@/__tests__/fixtures/data";

vi.mock("@/lib/auth", () => ({
  signOut: vi.fn(),
}));

describe("UserMenu", () => {
  it("renders avatar", () => {
    render(<UserMenu user={mockUser} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("shows dropdown with sign out on click", async () => {
    render(<UserMenu user={mockUser} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText(/sign out/i)).toBeInTheDocument();
  });

  it("shows user name in dropdown", async () => {
    render(<UserMenu user={mockUser} />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Test User")).toBeInTheDocument();
  });
});
