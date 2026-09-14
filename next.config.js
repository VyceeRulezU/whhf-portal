/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pins the workspace root to this project — without it, Next.js can get
  // confused by an unrelated lockfile elsewhere on disk and mis-trace
  // server output files, which matters for the Cloudflare Workers build.
  outputFileTracingRoot: __dirname,
  images: {
    // TEMPORARY: Unsplash serves placeholder photography (topically
    // relevant, free-licensed) until real WHHF programme/beneficiary
    // photos are supplied — see lib/content/placeholderImages.ts. Remove
    // once real images land.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Cloudflare R2 public bucket — see lib/storage/r2.ts.
      { protocol: "https", hostname: "pub-edb75a29dec547999359fcf854521a0f.r2.dev" }
    ]
  }
};

// NOTE: intentionally NOT calling initOpenNextCloudflareForDev() here.
// It simulates Cloudflare bindings (Hyperdrive, etc.) inside plain `next
// dev`, but nothing in the codebase reads them yet — lib/db/client.ts
// still reads process.env.DATABASE_URL directly (see the TODO there and
// in wrangler.jsonc). Until that changes, this call is pure overhead: it
// added ~20s to every dev server startup and repeated multi-second
// "Request timed out... Retrying" stalls on every page compile, for zero
// benefit. Re-add it once the app actually calls getCloudflareContext()
// somewhere and you want that binding simulated locally.

module.exports = nextConfig;
