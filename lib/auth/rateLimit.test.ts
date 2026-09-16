import { describe, expect, it } from "vitest";
import { clearAttempts, isRateLimited, recordFailedAttempt } from "./rateLimit";

// No Cloudflare context is available under vitest, so these exercise the
// in-memory fallback path — the same one local `next dev` uses. Each test
// uses its own key so state from other tests (the in-memory Map isn't
// reset between tests/files) can't bleed in.

describe("rateLimit", () => {
  it("is not rate limited before any failed attempts", async () => {
    expect(await isRateLimited("test-key-fresh")).toBe(false);
  });

  it("rate limits after 5 failed attempts", async () => {
    const key = "test-key-five-failures";
    for (let i = 0; i < 5; i++) await recordFailedAttempt(key);
    expect(await isRateLimited(key)).toBe(true);
  });

  it("does not rate limit under the 5-attempt threshold", async () => {
    const key = "test-key-four-failures";
    for (let i = 0; i < 4; i++) await recordFailedAttempt(key);
    expect(await isRateLimited(key)).toBe(false);
  });

  it("clearAttempts resets the counter", async () => {
    const key = "test-key-cleared";
    for (let i = 0; i < 5; i++) await recordFailedAttempt(key);
    expect(await isRateLimited(key)).toBe(true);

    await clearAttempts(key);
    expect(await isRateLimited(key)).toBe(false);
  });

  it("tracks separate keys independently", async () => {
    const keyA = "test-key-independent-a";
    const keyB = "test-key-independent-b";
    for (let i = 0; i < 5; i++) await recordFailedAttempt(keyA);
    expect(await isRateLimited(keyA)).toBe(true);
    expect(await isRateLimited(keyB)).toBe(false);
  });
});
