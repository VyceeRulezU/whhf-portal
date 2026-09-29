"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertModal";
import { INTEREST_CATEGORIES } from "@/lib/validation/interest";
import styles from "./InterestForm.module.css";

/**
 * Client component (local form state). Submits to POST /api/interest,
 * which saves the submission and (best-effort) emails
 * CONTACT_INBOX_EMAIL via Resend. See app/api/interest/route.ts and
 * app/admin/(protected)/interest for where the admin reads submissions
 * back.
 */
export function InterestForm() {
  const { showAlert } = useAlert();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !phone || !email || !category) {
      showAlert({
        title: "Check your details",
        message: "Please fill in your name, phone number, email, and how you'd like to help.",
        variant: "error"
      });
      return;
    }

    if (category === "other" && !otherDetails.trim()) {
      showAlert({
        title: "Tell us a little more",
        message: "Please describe how you'd like to help.",
        variant: "error"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          category,
          ...(category === "other" ? { otherDetails } : {})
        })
      });

      const json = await res.json();
      if (!res.ok) {
        showAlert({
          title: "Couldn't submit",
          message: json.error?.message ?? "Something went wrong. Please try again.",
          variant: "error"
        });
        return;
      }

      setIsSent(true);
    } catch {
      showAlert({
        title: "Couldn't submit",
        message: "Something went wrong. Please try again.",
        variant: "error"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSent) {
    return (
      <p className={styles.success} role="status">
        Thank you for your interest. We&rsquo;ll be in touch soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="stack">
      <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        label="Phone number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Select
        label="How would you like to help?"
        placeholder="Choose an option"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={INTEREST_CATEGORIES.map((option) => ({ value: option.value, label: option.label }))}
        required
      />

      {category === "other" && (
        <Textarea
          label="Tell us a little about how you'd like to help"
          value={otherDetails}
          onChange={(e) => setOtherDetails(e.target.value)}
          rows={4}
          required
        />
      )}

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit"}
      </Button>
    </form>
  );
}
