"use client";

import { useEffect } from "react";

/**
 * Only fires if the root layout itself throws — everything else is
 * caught by app/error.tsx. Next.js requires this to render its own
 * <html>/<body> (it replaces the root layout entirely), so it can't
 * rely on tokens.css/reset.css or any shared component being loaded —
 * kept deliberately minimal and self-contained.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          color: "#F5F3EF",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px"
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <p style={{ color: "#D4A64C", fontSize: 14, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            William &amp; Helen Heritage Foundation
          </p>
          <h1 style={{ fontSize: 28, margin: "12px 0" }}>Something went wrong.</h1>
          <p style={{ color: "#B8B6B2", marginBottom: 24 }}>
            An unexpected error occurred. Please try again, or come back in a moment.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              backgroundColor: "#D4A64C",
              color: "#141414",
              border: "none",
              borderRadius: 999,
              padding: "12px 28px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
