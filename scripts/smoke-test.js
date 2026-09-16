#!/usr/bin/env node

/**
 * Run right after every `wrangler deploy` to catch a broken production
 * deploy immediately, instead of finding out from a user hitting a
 * Cloudflare error page. Checks a handful of key public routes plus the
 * health endpoint. Exits non-zero (and prints exactly what failed) if
 * anything is wrong.
 *
 * Usage: node scripts/smoke-test.js [baseUrl]
 * Defaults to https://whheritagefoundation.org
 */

const baseUrl = process.argv[2] || "https://whheritagefoundation.org";

const ROUTES = [
  { path: "/", expect: 200 },
  { path: "/about", expect: 200 },
  { path: "/programmes", expect: 200 },
  { path: "/donate", expect: 200 },
  { path: "/contact", expect: 200 },
  { path: "/admin/login", expect: 200 },
  { path: "/sitemap.xml", expect: 200 },
  { path: "/api/health", expect: 200 }
];

async function checkRoute(route) {
  const url = `${baseUrl}${route.path}`;
  try {
    const res = await fetch(url, { redirect: "manual" });
    const ok = res.status === route.expect;
    return { ...route, url, status: res.status, ok };
  } catch (err) {
    return { ...route, url, status: null, ok: false, error: err.message };
  }
}

async function main() {
  console.log(`Smoke testing ${baseUrl} ...\n`);

  const results = await Promise.all(ROUTES.map(checkRoute));

  let hasFailure = false;
  for (const result of results) {
    const label = result.ok ? "PASS" : "FAIL";
    if (!result.ok) hasFailure = true;
    console.log(
      `[${label}] ${result.path} -> expected ${result.expect}, got ${result.status ?? "ERROR"}${result.error ? ` (${result.error})` : ""}`
    );
  }

  if (hasFailure) {
    console.error("\nSmoke test FAILED — at least one route did not respond as expected.");
    process.exit(1);
  }

  console.log("\nAll routes OK.");
}

main();
