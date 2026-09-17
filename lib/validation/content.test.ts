import { describe, expect, it } from "vitest";
import { saveFieldSchema, saveListSchema } from "./content";

describe("saveFieldSchema", () => {
  it("accepts a valid text field save", () => {
    const result = saveFieldSchema.safeParse({ fieldKey: "leadership.hero.title", value: "Our Leadership" });
    expect(result.success).toBe(true);
  });

  it("rejects a missing fieldKey", () => {
    const result = saveFieldSchema.safeParse({ value: "Our Leadership" });
    expect(result.success).toBe(false);
  });

  it("rejects an oversized value", () => {
    const result = saveFieldSchema.safeParse({ fieldKey: "about.intro", value: "x".repeat(20001) });
    expect(result.success).toBe(false);
  });
});

describe("saveListSchema", () => {
  it("accepts a valid list save", () => {
    const result = saveListSchema.safeParse({
      fieldKey: "leadership.board",
      items: [{ name: "Jane Doe", role: "Board Member", photo: "" }]
    });
    expect(result.success).toBe(true);
  });

  it("accepts an empty items array (all rows removed)", () => {
    const result = saveListSchema.safeParse({ fieldKey: "leadership.board", items: [] });
    expect(result.success).toBe(true);
  });

  it("rejects a non-string item field value", () => {
    const result = saveListSchema.safeParse({
      fieldKey: "leadership.board",
      items: [{ name: "Jane Doe", role: 5 }]
    });
    expect(result.success).toBe(false);
  });
});
