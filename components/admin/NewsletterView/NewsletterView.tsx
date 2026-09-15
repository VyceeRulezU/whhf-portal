"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Tabs } from "@/components/admin/Tabs";
import { Table } from "@/components/admin/Table";
import { TrashIcon } from "@/components/admin/icons";
import { useAlert } from "@/components/ui/AlertModal";
import styles from "./NewsletterView.module.css";
import type { TableColumn } from "@/components/admin/Table";

interface SubscriberRow {
  id: string;
  email: string;
  subscribedAt: Date;
}

interface SentNewsletterRow {
  id: string;
  subject: string;
  body: string;
  recipientCount: number;
  createdAt: Date;
}

interface NewsletterViewProps {
  subscribers: SubscriberRow[];
  activeSubscriberCount: number;
  history: SentNewsletterRow[];
}

type Tab = "compose" | "subscribers" | "history";

/** Admin newsletter platform: compose-and-send to every active
    subscriber (see app/api/admin/newsletter/send/route.ts, which sends
    one personalized copy per subscriber rather than a shared bcc list),
    a subscriber list with a remove action, and a send history. */
export function NewsletterView({ subscribers, activeSubscriberCount, history }: NewsletterViewProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const [activeTab, setActiveTab] = useState<Tab>("compose");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();

    if (activeSubscriberCount === 0) {
      showAlert({ title: "No subscribers", message: "There are no active subscribers to send to yet.", variant: "error" });
      return;
    }

    if (
      !window.confirm(
        `Send "${subject}" to ${activeSubscriberCount} subscriber${activeSubscriberCount === 1 ? "" : "s"}? This can't be undone.`
      )
    ) {
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body })
      });
      const json = await res.json();

      if (!res.ok) {
        showAlert({ title: "Couldn't send", message: json.error?.message ?? "Something went wrong.", variant: "error" });
        return;
      }

      showAlert({
        title: "Newsletter sent",
        message: `Delivered to ${json.data.recipientCount} subscriber${json.data.recipientCount === 1 ? "" : "s"}.`,
        variant: "success"
      });
      setSubject("");
      setBody("");
      setActiveTab("history");
      router.refresh();
    } finally {
      setIsSending(false);
    }
  }

  async function handleRemoveSubscriber(id: string, email: string) {
    if (!window.confirm(`Remove ${email} from the subscriber list?`)) return;
    setRemovingId(id);
    try {
      await fetch(`/api/admin/newsletter/subscribers/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setRemovingId(null);
    }
  }

  const subscriberColumns: TableColumn<SubscriberRow>[] = [
    { header: "Email", cell: (subscriber) => <span className={styles.subscriberEmail}>{subscriber.email}</span> },
    { header: "Subscribed", cell: (subscriber) => subscriber.subscribedAt.toLocaleDateString() },
    {
      header: "Actions",
      className: styles.actionsCell,
      cell: (subscriber) => (
        <button
          type="button"
          className={styles.iconButton}
          onClick={() => handleRemoveSubscriber(subscriber.id, subscriber.email)}
          disabled={removingId === subscriber.id}
          aria-label={`Remove ${subscriber.email}`}
          title="Remove subscriber"
        >
          <TrashIcon />
        </button>
      )
    }
  ];

  return (
    <div className="stack">
      <Tabs
        items={[
          { id: "compose", label: "Compose" },
          { id: "subscribers", label: "Subscribers", count: activeSubscriberCount },
          { id: "history", label: "History", count: history.length }
        ]}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as Tab)}
      />

      {activeTab === "compose" && (
        <Card>
          <form onSubmit={handleSend} className={`stack ${styles.form}`}>
            <p className={styles.intro}>
              Sends one email to each of the {activeSubscriberCount} active subscriber
              {activeSubscriberCount === 1 ? "" : "s"}, wrapped in the same branded template as every other WHHF email.
            </p>
            <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            <Textarea label="Message" value={body} onChange={(e) => setBody(e.target.value)} rows={10} required />
            <div className={styles.actions}>
              <Button type="submit" variant="primary" disabled={isSending}>
                {isSending ? "Sending…" : "Send Newsletter"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === "subscribers" && (
        <Card>
          <Table
            columns={subscriberColumns}
            rows={subscribers}
            getRowKey={(subscriber) => subscriber.id}
            emptyMessage="No active subscribers yet."
          />
        </Card>
      )}

      {activeTab === "history" && (
        <>
          {history.length === 0 ? (
            <Card>
              <p className={styles.empty}>No newsletters sent yet.</p>
            </Card>
          ) : (
            <div className={styles.list}>
              {history.map((item) => (
                <Card key={item.id} className={styles.itemCard}>
                  <p className={styles.subject}>{item.subject}</p>
                  <p className={styles.meta}>
                    Sent to {item.recipientCount} subscriber{item.recipientCount === 1 ? "" : "s"} ·{" "}
                    {item.createdAt.toLocaleString()}
                  </p>
                  <p className={styles.body}>{item.body}</p>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
