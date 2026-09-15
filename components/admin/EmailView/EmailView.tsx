"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/admin/Tabs";
import { MarkReadButton } from "@/components/admin/MarkReadButton";
import { MarkInboxReadButton } from "@/components/admin/MarkInboxReadButton";
import styles from "./EmailView.module.css";

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

interface EmailViewProps {
  emails: InboundEmailRow[];
  unreadEmailCount: number;
  messages: ContactMessageRow[];
  unreadMessageCount: number;
}

/**
 * Merges what used to be two separate admin sections — Inbox (real email
 * routed via Cloudflare Email Routing, see workers/email-router/) and
 * Messages (/contact form submissions) — into one page with in-page tabs,
 * since both are just different channels for the same job: mail WHHF
 * needs to see and act on.
 */
export function EmailView({ emails, unreadEmailCount, messages, unreadMessageCount }: EmailViewProps) {
  const [activeTab, setActiveTab] = useState<"inbox" | "messages">("inbox");

  return (
    <div className="stack">
      <Tabs
        items={[
          { id: "inbox", label: "Inbox", count: unreadEmailCount },
          { id: "messages", label: "Contact Form", count: unreadMessageCount }
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as "inbox" | "messages")}
      />

      {activeTab === "inbox" ? (
        <>
          <p className={styles.intro}>
            Real email sent to any @whheritagefoundation.org address, routed via Cloudflare Email Routing.
          </p>
          {emails.length === 0 ? (
            <Card>
              <p className={styles.empty}>Nothing received yet.</p>
            </Card>
          ) : (
            <div className={styles.list}>
              {emails.map((email) => (
                <Card key={email.id} className={styles.itemCard}>
                  <div className={styles.itemHeader}>
                    <div>
                      <p className={styles.subject}>
                        {email.subject || "(no subject)"}{" "}
                        {!email.isRead && <span className={styles.unreadDot} aria-hidden="true" />}
                      </p>
                      <p className={styles.meta}>
                        From {email.fromAddress} to {email.toAddress} · {email.receivedAt.toLocaleString()}
                      </p>
                    </div>
                    <MarkInboxReadButton emailId={email.id} isRead={email.isRead} />
                  </div>
                  <p className={styles.body}>{email.textBody || "(no text body)"}</p>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p className={styles.intro}>Every /contact form submission on the public site.</p>
          {messages.length === 0 ? (
            <Card>
              <p className={styles.empty}>No messages yet.</p>
            </Card>
          ) : (
            <div className={styles.list}>
              {messages.map((msg) => (
                <Card key={msg.id} className={styles.itemCard}>
                  <div className={styles.itemHeader}>
                    <div>
                      <p className={styles.subject}>
                        {msg.name}{" "}
                        <span className={`${styles.statusBadge} ${styles[`statusBadge--${msg.status}`]}`}>
                          {msg.status}
                        </span>
                      </p>
                      <p className={styles.meta}>
                        <a href={`mailto:${msg.email}`}>{msg.email}</a>
                        {msg.phone && <> · {msg.phone}</>} · {msg.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <MarkReadButton messageId={msg.id} currentStatus={msg.status} />
                  </div>
                  {msg.subject && <p className={styles.subject}>{msg.subject}</p>}
                  <p className={styles.body}>{msg.message}</p>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
