"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import logo from "@/assets/brand/logo-transparent.png";
import styles from "./error.module.css";

/**
 * Catches any rendering/data error thrown by a page under this segment
 * (everything except the root layout itself — see global-error.tsx for
 * that) and shows a branded fallback instead of Next's default crash
 * screen. Logged to the console for now; wire into Sentry once Phase 2
 * (error monitoring) lands — see the production-readiness plan.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <Image src={logo} alt="William & Helen Heritage Foundation" width={80} height={80} className={styles.logo} />
        <p className={styles.code}>Oops</p>
        <h1 className={styles.title}>Something went wrong.</h1>
        <p className={styles.body}>
          An unexpected error occurred while loading this page. You can try again, or head back to the homepage.
        </p>
        <div className="cluster">
          <Button variant="primary" showIconChip onClick={reset}>
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline">Back to homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
