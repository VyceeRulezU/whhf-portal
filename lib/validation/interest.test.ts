import { describe, expect, it } from "vitest";
import { createInterestSubmissionSchema } from "./interest";

describe("createInterestSubmissionSchema", () => {
  it("accepts a valid submission", () => {
    const result = createInterestSubmissionSchema.safeParse({
      name: "Jane Doe",
      phone: "08012345678",
      email: "jane@example.com",
      category: "volunteer"
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing phone number", () => {
    const result = createInterestSubmissionSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      category: "volunteer"
    });
    expect(result.success).toBe(false);
  });

  it("rejects a phone number that's too short", () => {
    const result = createInterestSubmissionSchema.safeParse({
      name: "Jane Doe",
      phone: "123",
      email: "jane@example.com",
      category: "volunteer"
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = createInterestSubmissionSchema.safeParse({
      name: "Jane Doe",
      phone: "08012345678",
      email: "not-an-email",
      category: "volunteer"
    });
    expect(result.success).toBe(false);
  });

  it("rejects a name that's too short", () => {
    const result = createInterestSubmissionSchema.safeParse({
      name: "J",
      phone: "08012345678",
      email: "jane@example.com",
      category: "volunteer"
    });
    expect(result.success).toBe(false);
  });

  it("rejects a missing category", () => {
    const result = createInterestSubmissionSchema.safeParse({
      name: "Jane Doe",
      phone: "08012345678",
      email: "jane@example.com"
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid category", () => {
    const result = createInterestSubmissionSchema.safeParse({
      name: "Jane Doe",
      phone: "08012345678",
      email: "jane@example.com",
      category: "not-a-real-category"
    });
    expect(result.success).toBe(false);
  });

  it("rejects category 'other' with no details", () => {
    const result = createInterestSubmissionSchema.safeParse({
      name: "Jane Doe",
      phone: "08012345678",
      email: "jane@example.com",
      category: "other"
    });
    expect(result.success).toBe(false);
  });

  it("accepts category 'other' with details", () => {
    const result = createInterestSubmissionSchema.safeParse({
      name: "Jane Doe",
      phone: "08012345678",
      email: "jane@example.com",
      category: "other",
      otherDetails: "I run a local pharmacy and want to help with supplies."
    });
    expect(result.success).toBe(true);
  });
});
