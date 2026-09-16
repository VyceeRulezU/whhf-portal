import { describe, expect, it } from "vitest";
import { createContactMessageSchema } from "./contact";

describe("createContactMessageSchema", () => {
  it("accepts a valid contact message", () => {
    const result = createContactMessageSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "I'd like to learn more about your programmes."
    });
    expect(result.success).toBe(true);
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = createContactMessageSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hi"
    });
    expect(result.success).toBe(false);
  });

  it("rejects a name that's too short", () => {
    const result = createContactMessageSchema.safeParse({
      name: "J",
      email: "jane@example.com",
      message: "I'd like to learn more about your programmes."
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = createContactMessageSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      message: "I'd like to learn more about your programmes."
    });
    expect(result.success).toBe(false);
  });
});
