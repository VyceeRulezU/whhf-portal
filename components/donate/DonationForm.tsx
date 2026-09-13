"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import styles from "./DonationForm.module.css";

const PRESET_AMOUNTS_NGN = [5000, 10000, 25000, 50000];

/**
 * Client component (needs local state for the multi-field form). Submits
 * to POST /api/donations, then redirects to the provider's checkout page.
 * See architecture.md ("Data flow: a donation, end to end").
 */
export function DonationForm() {
  const [amount, setAmount] = useState<number>(PRESET_AMOUNTS_NGN[1] ?? 10000);
  const [customAmount, setCustomAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveAmountNaira = customAmount ? Number(customAmount) : amount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !effectiveAmountNaira) {
      setError("Please fill in your name, email, and an amount.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor: { name, email },
          amount: Math.round(effectiveAmountNaira * 100), // convert to kobo
          currency: "NGN",
          causeSlug: "general-fund",
          isRecurring: false,
          paymentMethod: "card"
        })
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message ?? "Something went wrong. Please try again.");
        return;
      }

      window.location.href = json.data.redirectUrl;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="stack">
      <div>
        <p className={styles.label}>Choose an amount (₦)</p>
        <div className={styles.presetRow}>
          {PRESET_AMOUNTS_NGN.map((preset) => (
            <button
              key={preset}
              type="button"
              className={[styles.presetButton, amount === preset && !customAmount && styles["presetButton--active"]]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                setAmount(preset);
                setCustomAmount("");
              }}
            >
              ₦{preset.toLocaleString()}
            </button>
          ))}
        </div>
        <Input
          label="Or enter a custom amount"
          type="number"
          min={100}
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="e.g. 15000"
        />
      </div>

      <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        hint="We'll send your receipt here."
      />

      {error && (
        <p role="alert" style={{ color: "var(--color-error)", fontSize: "var(--font-size-sm)" }}>
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Processing…" : "Continue to payment"}
      </Button>
    </form>
  );
}
