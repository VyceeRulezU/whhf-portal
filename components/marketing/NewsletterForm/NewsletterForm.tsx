"use client";

import { useState } from "react";
import { useAlert } from "@/components/ui/AlertModal";
import styles from "./NewsletterForm.module.css";

/** Footer newsletter signup — posts to /api/newsletter/subscribe, which
    the admin's Newsletter dashboard page sends campaigns to. */
export function NewsletterForm() {
  const { showAlert } = useAlert();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        showAlert({
          title: "Couldn't subscribe",
          message: json?.error?.message ?? "Something went wrong. Please try again.",
          variant: "error"
        });
        return;
      }

      showAlert({ title: "Subscribed", message: "You're on the list — thank you for staying connected with WHHF.", variant: "success" });
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label htmlFor="footer-newsletter-email" className={styles.label}>
        Stay Updated
      </label>
      <div className={styles.row}>
        <input
          id="footer-newsletter-email"
          type="email"
          required
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? "…" : "Subscribe"}
        </button>
      </div>
    </form>
  );
}
