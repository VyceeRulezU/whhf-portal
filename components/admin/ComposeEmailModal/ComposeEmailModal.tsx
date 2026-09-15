"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertModal";
import styles from "./ComposeEmailModal.module.css";

interface ComposeEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTo?: string;
  initialSubject?: string;
  initialBody?: string;
  inReplyToId?: string;
  title?: string;
}

const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024; // 8MB — see lib/validation/sendEmail.ts
const MAX_ATTACHMENTS = 5;

function parseAddressList(value: string): string[] {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:<mime>;base64," prefix — Resend wants raw base64.
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Compose-or-reply modal — same fixed-overlay + Escape/click-outside-close
 * pattern as components/ui/AlertModal. One instance is reused for both
 * "New Email" (blank fields) and "Reply" (pre-filled to/subject/
 * inReplyToId) — see EmailView.tsx, which owns which mode is active.
 */
export function ComposeEmailModal({
  isOpen,
  onClose,
  initialTo = "",
  initialSubject = "",
  initialBody = "",
  inReplyToId,
  title
}: ComposeEmailModalProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [to, setTo] = useState(initialTo);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTo(initialTo);
      setSubject(initialSubject);
      setBody(initialBody);
      setCc("");
      setBcc("");
      setShowCcBcc(false);
      setAttachments([]);
    }
  }, [isOpen, initialTo, initialSubject, initialBody]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";

    const oversized = files.find((f) => f.size > MAX_ATTACHMENT_BYTES);
    if (oversized) {
      showAlert({ title: "File too large", message: `"${oversized.name}" is over the 8MB limit per attachment.`, variant: "error" });
      return;
    }

    setAttachments((current) => {
      const combined = [...current, ...files];
      if (combined.length > MAX_ATTACHMENTS) {
        showAlert({ title: "Too many attachments", message: `Up to ${MAX_ATTACHMENTS} files per email.`, variant: "error" });
        return current;
      }
      return combined;
    });
  }

  function removeAttachment(index: number) {
    setAttachments((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSending(true);
    try {
      const encodedAttachments = await Promise.all(
        attachments.map(async (file) => ({ filename: file.name, content: await readFileAsBase64(file) }))
      );

      const res = await fetch("/api/admin/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          cc: showCcBcc ? parseAddressList(cc) : undefined,
          bcc: showCcBcc ? parseAddressList(bcc) : undefined,
          subject,
          body,
          inReplyToId,
          attachments: encodedAttachments.length > 0 ? encodedAttachments : undefined
        })
      });
      const json = await res.json();

      if (!res.ok) {
        showAlert({ title: "Couldn't send", message: json.error?.message ?? "Something went wrong.", variant: "error" });
        return;
      }

      showAlert({ title: "Sent", message: `Your email to ${to} is on its way.`, variant: "success" });
      onClose();
      router.refresh();
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className={styles.overlay} role="presentation" onClick={onClose}>
      <div
        className={`${styles.modal} scrollbar-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compose-email-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="compose-email-title">{title ?? (inReplyToId ? "Reply" : "New Email")}</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className={`stack ${styles.form}`}>
          <div className={styles.toField}>
            <Input label="To" type="email" value={to} onChange={(e) => setTo(e.target.value)} required />
            <button
              type="button"
              className={styles.ccBccToggle}
              onClick={() => setShowCcBcc((shown) => !shown)}
            >
              {showCcBcc ? "Hide Cc/Bcc" : "Cc/Bcc"}
            </button>
          </div>
          {showCcBcc && (
            <>
              <Input
                label="Cc"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                hint="Comma-separated addresses"
              />
              <Input
                label="Bcc"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                hint="Comma-separated addresses"
              />
            </>
          )}
          <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
          <Textarea label="Message" value={body} onChange={(e) => setBody(e.target.value)} rows={8} required />

          <div className={styles.attachmentsSection}>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className={styles.fileInput}
              onChange={handleFileSelect}
            />
            <Button type="button" variant="ghost" onClick={() => fileInputRef.current?.click()}>
              Attach files
            </Button>
            {attachments.length > 0 && (
              <ul className={styles.attachmentList}>
                {attachments.map((file, index) => (
                  <li key={`${file.name}-${index}`} className={styles.attachmentChip}>
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSending}>
              {isSending ? "Sending…" : "Send"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
