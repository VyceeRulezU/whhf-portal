"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/Button";
import logo from "@/assets/brand/logo-transparent.png";
import styles from "./error.module.css";

/**
 * Catches any rendering/data error thrown by a page under this segment
 * (everything except the root layout itself — see global-error.tsx for
 * that) and shows a branded fallback instead of Next's default crash
 * screen.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app/error]", error);
    Sentry.captureException(error);
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
