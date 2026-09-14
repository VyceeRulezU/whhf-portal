"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertModal";
import styles from "./ContactForm.module.css";

/**
 * Client component (local form state). Submits to POST /api/contact,
 * which saves the message and (best-effort) emails CONTACT_INBOX_EMAIL
 * via Resend. See app/api/contact/route.ts.
 */
export function ContactForm() {
  const { showAlert } = useAlert();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!name || !email || message.trim().length < 10) {
      showAlert({
        title: "Check your details",
        message: "Please fill in your name, email, and a message of at least 10 characters.",
        variant: "error"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          subject: subject || undefined,
          message
        })
      });

      const json = await res.json();
      if (!res.ok) {
        showAlert({
          title: "Message not sent",
          message: json.error?.message ?? "Something went wrong. Please try again.",
          variant: "error"
        });
        return;
      }

      setIsSent(true);
    } catch {
      showAlert({
        title: "Message not sent",
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
        Thank you — your message has been sent. We&rsquo;ll get back to you soon.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="stack">
      <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Input
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Phone number"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        hint="Optional."
      />
      <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} hint="Optional." />
      <Textarea
        label="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
        placeholder="How can we help?"
      />

      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
