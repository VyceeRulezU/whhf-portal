import { describe, expect, it } from "vitest";
import { inboundEmailSchema } from "./inboundEmail";

describe("inboundEmailSchema", () => {
  it("accepts a valid inbound email payload", () => {
    const result = inboundEmailSchema.safeParse({
      from: "sender@example.com",
      to: "contact@whheritagefoundation.org",
      subject: "Hello",
      text: "This is the message body."
    });
    expect(result.success).toBe(true);
  });

  it("rejects a payload missing the required from/to fields", () => {
    const result = inboundEmailSchema.safeParse({ subject: "Hello", text: "Body" });
    expect(result.success).toBe(false);
  });

  it("rejects a from address that's too short to be real", () => {
    const result = inboundEmailSchema.safeParse({ from: "a", to: "contact@whheritagefoundation.org" });
    expect(result.success).toBe(false);
  });
});
