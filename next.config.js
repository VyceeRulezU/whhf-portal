/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pins the workspace root to this project — without it, Next.js can get
  // confused by an unrelated lockfile elsewhere on disk and mis-trace
  // server output files, which matters for the Cloudflare Workers build.
  outputFileTracingRoot: __dirname,
  images: {
    // TEMPORARY: picsum.photos serves placeholder photography until real
    // WHHF programme/beneficiary photos are supplied — see
    // lib/content/placeholderImages.ts. Remove once real images land.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }]
  }
};

// NOTE: intentionally NOT calling initOpenNextCloudflareForDev() here.
// It simulates Cloudflare bindings (Hyperdrive, etc.) inside plain `next
// dev`, but nothing in the codebase reads them yet — lib/db/prisma.ts
// still reads process.env.DATABASE_URL directly (see the TODO there and
// in wrangler.jsonc). Until that changes, this call is pure overhead: it
// added ~20s to every dev server startup and repeated multi-second
// "Request timed out... Retrying" stalls on every page compile, for zero
// benefit. Re-add it once the app actually calls getCloudflareContext()
// somewhere and you want that binding simulated locally.

module.exports = nextConfig;
