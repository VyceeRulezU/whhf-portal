/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // TEMPORARY: picsum.photos serves placeholder photography until real
    // WHHF programme/beneficiary photos are supplied — see
    // lib/content/placeholderImages.ts. Remove once real images land.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }]
  }
};

module.exports = nextConfig;
