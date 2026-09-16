import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// next/headers' cookies() only works inside a real Next.js request context
// — mock it with a plain in-memory store so createSession/getSession can
// be exercised exactly as the app calls them, without a running server.
const store = new Map<string, string>();

vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) => (store.has(name) ? { value: store.get(name)! } : undefined),
    set: (name: string, value: string) => {
      store.set(name, value);
    },
    delete: (name: string) => {
      store.delete(name);
    }
  })
}));

process.env.AUTH_SECRET = "test-only-secret-do-not-use-in-real-env";

const { createSession, destroySession, getSession } = await import("./session");

const SESSION_COOKIE = "whhf_admin_session";

describe("session", () => {
  beforeEach(() => {
    store.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("round-trips a created session", async () => {
    await createSession({ adminUserId: "admin-1", role: "admin" });
    const session = await getSession();
    expect(session?.adminUserId).toBe("admin-1");
    expect(session?.role).toBe("admin");
  });

  it("returns null when no session cookie is set", async () => {
    expect(await getSession()).toBeNull();
  });

  it("returns null after destroySession", async () => {
    await createSession({ adminUserId: "admin-1", role: "admin" });
    await destroySession();
    expect(await getSession()).toBeNull();
  });

  it("rejects a payload tampered with after signing", async () => {
    await createSession({ adminUserId: "admin-1", role: "admin" });
    const raw = store.get(SESSION_COOKIE)!;
    const [, signature] = raw.split(".");
    const forgedBody = Buffer.from(
      JSON.stringify({ adminUserId: "attacker", role: "admin", exp: Math.floor(Date.now() / 1000) + 3600 })
    ).toString("base64url");
    store.set(SESSION_COOKIE, `${forgedBody}.${signature}`);

    expect(await getSession()).toBeNull();
  });

  it("rejects a session past its 8-hour expiry", async () => {
    await createSession({ adminUserId: "admin-1", role: "admin" });
    expect(await getSession()).not.toBeNull();

    vi.useFakeTimers();
    vi.setSystemTime(Date.now() + 9 * 60 * 60 * 1000); // 9 hours later

    expect(await getSession()).toBeNull();
  });
});
