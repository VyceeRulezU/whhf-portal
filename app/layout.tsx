import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
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
  title: "William & Helen Heritage Foundation",
  description:
    "William & Helen Heritage Foundation (WHHF) — Abuja, Nigeria. Supporting indigent cancer patients and continuing a legacy of giving.",
  icons: {
    icon: "/favicon.ico"
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
        {/* reducedMotion="user" makes every Framer Motion animation in the
            app honor prefers-reduced-motion automatically — see
            design-system.md ("Accessibility floor"). */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
