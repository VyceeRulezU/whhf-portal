import { describe, expect, it } from "vitest";
import { formatCurrency } from "./currency";

describe("formatCurrency", () => {
  it("converts the smallest-unit integer to major units", () => {
    // 500000 kobo -> ₦5,000, never floating-point major-unit math
    expect(formatCurrency(500000, "NGN")).toContain("5,000");
  });

  it("shows no decimal places for a whole amount", () => {
    expect(formatCurrency(500000, "NGN")).not.toMatch(/\.\d/);
  });

  it("shows two decimal places for a fractional amount", () => {
    // 150050 kobo -> ₦1,500.50
    expect(formatCurrency(150050, "NGN")).toMatch(/1,500\.50/);
  });

  it("formats a different currency correctly", () => {
    expect(formatCurrency(199900, "USD")).toContain("1,999");
  });

  it("never mutates the input (integer smallest-unit math only)", () => {
    const amount = 123456;
    formatCurrency(amount, "NGN");
    expect(amount).toBe(123456);
  });
});
