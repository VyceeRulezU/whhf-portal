import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/Card";
import { MarkReadButton } from "@/components/admin/MarkReadButton";
import styles from "./messages.module.css";

/**
 * Every /contact form submission lands here — see app/api/contact/route.ts.
 * This is the durable record; the notification email to CONTACT_INBOX_EMAIL
 * is a best-effort convenience on top of it, not the source of truth.
 */
export default async function AdminMessagesPage() {
  const [messages, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.contactMessage.count({ where: { status: "unread" } })
  ]);

  return (
    <div className="stack">
      <h1>Messages</h1>

      <div className="grid-auto">
        <Card>
          <p className={styles.statLabel}>Total messages</p>
          <p className={styles.statValue}>{messages.length}</p>
        </Card>
        <Card>
          <p className={styles.statLabel}>Unread</p>
          <p className={styles.statValue}>{unreadCount}</p>
        </Card>
      </div>

      {messages.length === 0 ? (
        <Card>
          <p className={styles.empty}>No messages yet.</p>
        </Card>
      ) : (
        <div className={styles.list}>
          {messages.map((msg) => (
            <Card key={msg.id} className={styles.messageCard}>
              <div className={styles.messageHeader}>
                <div>
                  <p className={styles.name}>
                    {msg.name}{" "}
                    <span className={`${styles.status} ${styles[`status--${msg.status}`]}`}>{msg.status}</span>
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
    </div>
  );
}
