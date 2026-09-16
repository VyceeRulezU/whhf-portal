import { describe, expect, it } from "vitest";
import { sendNewsletterSchema, subscribeNewsletterSchema } from "./newsletter";

describe("subscribeNewsletterSchema", () => {
  it("accepts a valid email", () => {
    expect(subscribeNewsletterSchema.safeParse({ email: "reader@example.com" }).success).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(subscribeNewsletterSchema.safeParse({ email: "not-an-email" }).success).toBe(false);
  });
});

describe("sendNewsletterSchema", () => {
  it("accepts a valid subject/body", () => {
    const result = sendNewsletterSchema.safeParse({ subject: "This month at WHHF", body: "Here's what happened..." });
    expect(result.success).toBe(true);
  });

  it("rejects an empty subject", () => {
    expect(sendNewsletterSchema.safeParse({ subject: "", body: "Body" }).success).toBe(false);
  });

  it("rejects an empty body", () => {
    expect(sendNewsletterSchema.safeParse({ subject: "Subject", body: "" }).success).toBe(false);
  });
});
