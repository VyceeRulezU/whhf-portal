import { describe, expect, it } from "vitest";
import { createDonationSchema } from "./donation";

describe("createDonationSchema", () => {
  it("accepts a valid donation", () => {
    const result = createDonationSchema.safeParse({
      donor: { name: "Jane Doe", email: "jane@example.com" },
      amount: 500000,
      currency: "NGN",
      causeSlug: "general-fund",
      isRecurring: false,
      paymentMethod: "card"
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-positive amount", () => {
    const result = createDonationSchema.safeParse({
      donor: { name: "Jane Doe", email: "jane@example.com" },
      amount: 0,
      currency: "NGN",
      causeSlug: "general-fund",
      paymentMethod: "card"
    });
    expect(result.success).toBe(false);
  });

  it("rejects a non-integer amount (never float money math)", () => {
    const result = createDonationSchema.safeParse({
      donor: { name: "Jane Doe", email: "jane@example.com" },
      amount: 5000.5,
      currency: "NGN",
      causeSlug: "general-fund",
      paymentMethod: "card"
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported currency", () => {
    const result = createDonationSchema.safeParse({
      donor: { name: "Jane Doe", email: "jane@example.com" },
      amount: 500000,
      currency: "EUR",
      causeSlug: "general-fund",
      paymentMethod: "card"
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid donor email", () => {
    const result = createDonationSchema.safeParse({
      donor: { name: "Jane Doe", email: "not-an-email" },
      amount: 500000,
      currency: "NGN",
      causeSlug: "general-fund",
      paymentMethod: "card"
    });
    expect(result.success).toBe(false);
  });
});
