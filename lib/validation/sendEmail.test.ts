import { describe, expect, it } from "vitest";
import { sendEmailSchema } from "./sendEmail";

describe("sendEmailSchema", () => {
  it("accepts a minimal valid email", () => {
    const result = sendEmailSchema.safeParse({
      to: "donor@example.com",
      subject: "Thank you",
      body: "Thank you for your generosity."
    });
    expect(result.success).toBe(true);
  });

  it("accepts cc/bcc and attachments together", () => {
    const result = sendEmailSchema.safeParse({
      to: "donor@example.com",
      cc: ["board@whheritagefoundation.org"],
      bcc: ["archive@whheritagefoundation.org"],
      subject: "Thank you",
      body: "Thank you for your generosity.",
      attachments: [{ filename: "receipt.pdf", content: "base64content" }]
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid 'to' address", () => {
    const result = sendEmailSchema.safeParse({ to: "not-an-email", subject: "Hi", body: "Body" });
    expect(result.success).toBe(false);
  });

  it("rejects more than 10 cc addresses", () => {
    const result = sendEmailSchema.safeParse({
      to: "donor@example.com",
      cc: Array.from({ length: 11 }, (_, i) => `cc${i}@example.com`),
      subject: "Hi",
      body: "Body"
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 5 attachments", () => {
    const result = sendEmailSchema.safeParse({
      to: "donor@example.com",
      subject: "Hi",
      body: "Body",
      attachments: Array.from({ length: 6 }, (_, i) => ({ filename: `f${i}.pdf`, content: "x" }))
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty body", () => {
    const result = sendEmailSchema.safeParse({ to: "donor@example.com", subject: "Hi", body: "" });
    expect(result.success).toBe(false);
  });
});
