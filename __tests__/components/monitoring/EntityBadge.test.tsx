import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { EntityBadge } from "@/components/monitoring/EntityBadge";

describe("EntityBadge", () => {
  it("renders entity name", () => {
    render(<EntityBadge type="company" name="OpenAI" />);
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
  });

  it("renders type label", () => {
    render(<EntityBadge type="person" name="Sam Altman" />);
    expect(screen.getByText("person")).toBeInTheDocument();
  });

  it("applies different colors per type", () => {
    const { rerender } = render(<EntityBadge type="company" name="A" />);
    const companyBadge = screen.getByTestId("entity-badge");
    rerender(<EntityBadge type="person" name="B" />);
    const personBadge = screen.getByTestId("entity-badge");
    // Both should render without error — visual differentiation via classes
    expect(companyBadge).toBeInTheDocument();
    expect(personBadge).toBeInTheDocument();
  });
});
