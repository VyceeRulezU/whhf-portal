import { describe, expect, it } from "vitest";
import { adminLoginSchema } from "./adminLogin";

describe("adminLoginSchema", () => {
  it("accepts a valid email/password pair", () => {
    const result = adminLoginSchema.safeParse({ email: "admin@whheritagefoundation.org", password: "a-strong-password" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = adminLoginSchema.safeParse({ email: "not-an-email", password: "a-strong-password" });
    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const result = adminLoginSchema.safeParse({ email: "admin@whheritagefoundation.org", password: "short" });
    expect(result.success).toBe(false);
  });
});
