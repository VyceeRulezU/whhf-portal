"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/admin/Table";
import { Tabs } from "@/components/admin/Tabs";
import { ComposeEmailModal } from "@/components/admin/ComposeEmailModal";
import { EmailDetailModal } from "@/components/admin/EmailDetailModal";
import { EyeIcon, ReplyIcon, ForwardIcon, CheckIcon, TrashIcon } from "@/components/admin/icons";
import { formatDateTime } from "@/lib/format/date";
import styles from "./EmailView.module.css";
import type { TableColumn } from "@/components/admin/Table";

interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "unread" | "read" | "replied";
  createdAt: Date;
}

interface InboundEmailRow {
  id: string;
  fromAddress: string;
  toAddress: string;
  subject: string | null;
  textBody: string | null;
  receivedAt: Date;
  isRead: boolean;
}

interface SentEmailRow {
  id: string;
  toAddress: string;
  subject: string;
  body: string;
  inReplyToId: string | null;
  ccAddresses: string | null;
  bccAddresses: string | null;
  attachmentNames: string | null;
  createdAt: Date;
}

interface EmailViewProps {
  emails: InboundEmailRow[];
  unreadEmailCount: number;
  messages: ContactMessageRow[];
  unreadMessageCount: number;
  sent: SentEmailRow[];
}

type Tab = "inbox" | "messages" | "sent";

interface ComposeTarget {
  to: string;
  subject: string;
  body?: string;
  inReplyToId?: string;
  title?: string;
}

interface DetailTarget {
  subject: string;
  meta: { label: string; value: string }[];
  body: string;
}

/**
 * Merges what used to be three separate concerns — Inbox (real email
 * routed via Cloudflare Email Routing, see workers/email-router/),
 * Messages (/contact form submissions), and Outgoing (email the admin has
 * sent, see app/api/admin/email/send/route.ts) — into one page with
 * in-page tabs, each backed by the shared admin Table component. Every
 * row's Actions column is icon-only (View/Reply/Forward/Mark as
 * read/Delete, in that order — content actions first, state change next,
 * destructive last), opening the read-only EmailDetailModal for View and
 * the shared ComposeEmailModal (in either reply or forward mode) for the
 * other two composing actions.
 */
export function EmailView({ emails, unreadEmailCount, messages, unreadMessageCount, sent }: EmailViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("inbox");
  const [composeTarget, setComposeTarget] = useState<ComposeTarget | null>(null);
  const [detailTarget, setDetailTarget] = useState<DetailTarget | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function markInboxRead(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/inbox/${id}`, { method: "PATCH" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteInbox(id: string) {
    if (!window.confirm("Delete this email? This can't be undone.")) return;
    setBusyId(id);
    try {
      await fetch(`/api/admin/inbox/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function markMessageRead(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" })
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteMessage(id: string) {
    if (!window.confirm("Delete this message? This can't be undone.")) return;
    setBusyId(id);
    try {
      await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function deleteSent(id: string) {
    if (!window.confirm("Delete this email from your Outgoing history? This can't be undone.")) return;
    setBusyId(id);
    try {
      await fetch(`/api/admin/email/sent/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  function replyToEmail(email: InboundEmailRow) {
    setComposeTarget({
      to: email.fromAddress,
      subject: email.subject ? `Re: ${email.subject}` : "Re: your email",
      inReplyToId: email.id
    });
  }

  function forwardEmail(email: InboundEmailRow) {
    setComposeTarget({
      to: "",
      subject: email.subject ? `Fwd: ${email.subject}` : "Fwd: (no subject)",
      body: `\n\n---------- Forwarded message ----------\nFrom: ${email.fromAddress}\nDate: ${formatDateTime(email.receivedAt)}\nSubject: ${email.subject || "(no subject)"}\n\n${email.textBody || ""}`,
      title: "Forward"
    });
  }

  function replyToMessage(msg: ContactMessageRow) {
    setComposeTarget({
      to: msg.email,
      subject: msg.subject ? `Re: ${msg.subject}` : "Re: your message",
      inReplyToId: msg.id
    });
  }

  function forwardMessage(msg: ContactMessageRow) {
    setComposeTarget({
      to: "",
      subject: msg.subject ? `Fwd: ${msg.subject}` : "Fwd: contact form message",
      body: `\n\n---------- Forwarded message ----------\nFrom: ${msg.name} <${msg.email}>\nDate: ${formatDateTime(msg.createdAt)}\n\n${msg.message}`,
      title: "Forward"
    });
  }

  function forwardSent(item: SentEmailRow) {
    setComposeTarget({
      to: "",
      subject: item.subject ? `Fwd: ${item.subject}` : "Fwd: (no subject)",
      body: `\n\n---------- Forwarded message ----------\nTo: ${item.toAddress}\nDate: ${formatDateTime(item.createdAt)}\nSubject: ${item.subject}\n\n${item.body}`,
      title: "Forward"
    });
  }

  const inboxColumns: TableColumn<InboundEmailRow>[] = [
    {
      header: "Subject",
      cell: (email) => (
        <span className={styles.subjectCell}>
          {!email.isRead && <span className={styles.unreadDot} aria-hidden="true" />}
          {email.subject || "(no subject)"}
        </span>
      )
    },
    { header: "From", cell: (email) => email.fromAddress },
    { header: "Date", cell: (email) => formatDateTime(email.receivedAt) },
    {
      header: "Actions",
      className: styles.actionsCell,
      cell: (email) => (
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.iconButton}
            title="View"
            aria-label="View email"
            onClick={() =>
              setDetailTarget({
                subject: email.subject || "(no subject)",
                meta: [
                  { label: "From", value: email.fromAddress },
                  { label: "To", value: email.toAddress },
                  { label: "Date", value: formatDateTime(email.receivedAt) }
                ],
                body: email.textBody || "(no text body)"
              })
            }
          >
            <EyeIcon />
          </button>
          <button type="button" className={styles.iconButton} title="Reply" aria-label="Reply" onClick={() => replyToEmail(email)}>
            <ReplyIcon />
          </button>
          <button type="button" className={styles.iconButton} title="Forward" aria-label="Forward" onClick={() => forwardEmail(email)}>
            <ForwardIcon />
          </button>
          {!email.isRead && (
            <button
              type="button"
              className={styles.iconButton}
              title="Mark as read"
              aria-label="Mark as read"
              disabled={busyId === email.id}
              onClick={() => markInboxRead(email.id)}
            >
              <CheckIcon />
            </button>
          )}
          <button
            type="button"
            className={`${styles.iconButton} ${styles.iconButtonDanger}`}
            title="Delete"
            aria-label="Delete email"
            disabled={busyId === email.id}
            onClick={() => deleteInbox(email.id)}
          >
            <TrashIcon />
          </button>
        </div>
      )
    }
  ];

  const messageColumns: TableColumn<ContactMessageRow>[] = [
    {
      header: "Name",
      cell: (msg) => (
        <span className={styles.subjectCell}>
          {msg.status === "unread" && <span className={styles.unreadDot} aria-hidden="true" />}
          {msg.name}
        </span>
      )
    },
    { header: "Email", cell: (msg) => msg.email },
    {
      header: "Status",
      cell: (msg) => <span className={`${styles.statusBadge} ${styles[`statusBadge--${msg.status}`]}`}>{msg.status}</span>
    },
    { header: "Date", cell: (msg) => formatDateTime(msg.createdAt) },
    {
      header: "Actions",
      className: styles.actionsCell,
      cell: (msg) => (
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.iconButton}
            title="View"
            aria-label="View message"
            onClick={() =>
              setDetailTarget({
                subject: msg.subject || "Contact form message",
                meta: [
                  { label: "From", value: `${msg.name} <${msg.email}>` },
                  ...(msg.phone ? [{ label: "Phone", value: msg.phone }] : []),
                  { label: "Date", value: formatDateTime(msg.createdAt) }
                ],
                body: msg.message
              })
            }
          >
            <EyeIcon />
          </button>
          <button type="button" className={styles.iconButton} title="Reply" aria-label="Reply" onClick={() => replyToMessage(msg)}>
            <ReplyIcon />
          </button>
          <button type="button" className={styles.iconButton} title="Forward" aria-label="Forward" onClick={() => forwardMessage(msg)}>
            <ForwardIcon />
          </button>
          {msg.status === "unread" && (
            <button
              type="button"
              className={styles.iconButton}
              title="Mark as read"
              aria-label="Mark as read"
              disabled={busyId === msg.id}
              onClick={() => markMessageRead(msg.id)}
            >
              <CheckIcon />
            </button>
          )}
          <button
            type="button"
            className={`${styles.iconButton} ${styles.iconButtonDanger}`}
            title="Delete"
            aria-label="Delete message"
            disabled={busyId === msg.id}
            onClick={() => deleteMessage(msg.id)}
          >
            <TrashIcon />
          </button>
        </div>
      )
    }
  ];

  const sentColumns: TableColumn<SentEmailRow>[] = [
    { header: "Subject", cell: (item) => item.subject },
    { header: "To", cell: (item) => item.toAddress },
    { header: "Date", cell: (item) => formatDateTime(item.createdAt) },
    {
      header: "Actions",
      className: styles.actionsCell,
      cell: (item) => (
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.iconButton}
            title="View"
            aria-label="View email"
            onClick={() =>
              setDetailTarget({
                subject: item.subject,
                meta: [
                  { label: "To", value: item.toAddress },
                  ...(item.ccAddresses ? [{ label: "Cc", value: item.ccAddresses }] : []),
                  ...(item.bccAddresses ? [{ label: "Bcc", value: item.bccAddresses }] : []),
                  ...(item.attachmentNames ? [{ label: "Attachments", value: item.attachmentNames }] : []),
                  { label: "Date", value: formatDateTime(item.createdAt) }
                ],
                body: item.body
              })
            }
          >
            <EyeIcon />
          </button>
          <button type="button" className={styles.iconButton} title="Forward" aria-label="Forward" onClick={() => forwardSent(item)}>
            <ForwardIcon />
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.iconButtonDanger}`}
            title="Delete"
            aria-label="Delete email"
            disabled={busyId === item.id}
            onClick={() => deleteSent(item.id)}
          >
            <TrashIcon />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="stack">
      <div className={`cluster ${styles.toolbar}`}>
        <Tabs
          items={[
            { id: "inbox", label: "Inbox", count: unreadEmailCount },
            { id: "messages", label: "Contact Form", count: unreadMessageCount },
            { id: "sent", label: "Outgoing", count: sent.length }
          ]}
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as Tab)}
        />
        <Button variant="primary" onClick={() => setComposeTarget({ to: "", subject: "" })}>
          New Email
        </Button>
      </div>

      {activeTab === "inbox" && (
        <>
          <p className={styles.intro}>
            Real email sent to any @whheritagefoundation.org address, routed via Cloudflare Email Routing.
          </p>
          <Table columns={inboxColumns} rows={emails} getRowKey={(email) => email.id} emptyMessage="Nothing received yet." />
        </>
      )}

      {activeTab === "messages" && (
        <>
          <p className={styles.intro}>Every /contact form submission on the public site.</p>
          <Table columns={messageColumns} rows={messages} getRowKey={(msg) => msg.id} emptyMessage="No messages yet." />
        </>
      )}

      {activeTab === "sent" && (
        <>
          <p className={styles.intro}>Email sent from this admin panel — replies, forwards, and fresh compositions.</p>
          <Table columns={sentColumns} rows={sent} getRowKey={(item) => item.id} emptyMessage="Nothing sent yet." />
        </>
      )}

      <ComposeEmailModal
        isOpen={composeTarget !== null}
        onClose={() => setComposeTarget(null)}
        initialTo={composeTarget?.to}
        initialSubject={composeTarget?.subject}
        initialBody={composeTarget?.body}
        inReplyToId={composeTarget?.inReplyToId}
        title={composeTarget?.title}
      />

      <EmailDetailModal
        isOpen={detailTarget !== null}
        onClose={() => setDetailTarget(null)}
        subject={detailTarget?.subject ?? ""}
        meta={detailTarget?.meta ?? []}
        body={detailTarget?.body ?? ""}
      />
    </div>
  );
}
