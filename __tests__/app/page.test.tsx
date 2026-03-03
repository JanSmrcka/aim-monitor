import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Home from "@/app/page";

describe("Home page", () => {
  it("renders heading", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", {
        name: /to get started, edit the page\.tsx file/i,
      })
    ).toBeInTheDocument();
  });

  it("renders Deploy Now and Documentation links", () => {
    render(<Home />);
    const deployLink = screen.getByRole("link", { name: /deploy now/i });
    const docsLink = screen.getByRole("link", { name: /documentation/i });

    expect(deployLink).toHaveAttribute(
      "href",
      expect.stringContaining("vercel.com/new")
    );
    expect(docsLink).toHaveAttribute(
      "href",
      expect.stringContaining("nextjs.org/docs")
    );
  });

  it("renders Next.js logo", () => {
    render(<Home />);
    expect(screen.getByAltText("Next.js logo")).toBeInTheDocument();
  });
});
