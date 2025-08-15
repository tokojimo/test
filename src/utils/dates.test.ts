import { describe, it, expect } from "vitest";
import { formatDate } from "./dates";

describe("formatDate", () => {
  it("formats valid ISO date", () => {
    expect(formatDate("2024-03-15")).toBe("15/03/2024");
  });

  it("returns input for invalid date", () => {
    expect(formatDate("invalid" as any)).toBe("invalid");
  });
});
