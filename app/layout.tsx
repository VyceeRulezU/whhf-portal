import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/content/siteConfig";
import { AlertModalProvider } from "@/components/ui/AlertModal";
import "../tokens/tokens.css";
import "../styles/base/reset.css";
import "../styles/base/typography.css";
import "../styles/base/layout.css";

// Loaded here (not hardcoded per-component) and exposed as CSS variables
// consumed by tokens.css's font-family variables — see typography.css.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "500", "600"],
  variable: "--font-fraunces"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "William & Helen Heritage Foundation",
    "WHHF",
    "NGO Abuja",
    "Nigeria charity",
    "cancer patient support Nigeria",
    "indigent cancer patients",
    "donate Nigeria",
    "All Christians Fellowship Mission",
    "ACFM"
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/"
  },
  // Real icon files are picked up automatically via the app/ file
  // convention (favicon.ico, icon.png, apple-icon.png) — no manual
  // `icons` entry needed here, and one would risk conflicting with them.
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_NG"
    // og:image is picked up automatically from app/opengraph-image.jpg.
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION
    // twitter:image also resolves from app/opengraph-image.jpg.
  }
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1
};

// Structured data for search engines (NGO rich results). Registration
// numbers are still "pending confirmation" per
// docs/compliance-nigeria-ngo.md and deliberately excluded — address and
// phone are real, confirmed by WHHF. Set as literal <script> text content
// (not dangerouslySetInnerHTML) since it's static JSON, not interpolated
// user input.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: SITE_NAME,
  alternateName: "WHHF",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: SITE_DESCRIPTION,
  areaServed: "NG",
  telephone: "+2348064320084",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3FVM+H9M, Along Nile Street, Maitama",
    addressLocality: "Abuja",
    addressRegion: "Federal Capital Territory",
    postalCode: "904101",
    addressCountry: "NG"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
        {/* reducedMotion="user" makes every Framer Motion animation in the
            app honor prefers-reduced-motion automatically — see
            design-system.md ("Accessibility floor"). */}
        <MotionConfig reducedMotion="user">
          <AlertModalProvider>{children}</AlertModalProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
