import { prisma } from "@/lib/db/prisma";
import { Card } from "@/components/ui/Card";
import { MarkInboxReadButton } from "@/components/admin/MarkInboxReadButton";
import styles from "./inbox.module.css";

/**
 * Real inbound email sent to any @whheritagefoundation.org address — see
 * app/api/webhooks/inbound-email/route.ts and workers/email-router/. This
 * is separate from /contact form submissions (Admin → Messages); it
 * stays empty until Cloudflare Email Routing is actually configured for
 * the domain — see workers/email-router/README.md.
 */
export default async function AdminInboxPage() {
  const [emails, unreadCount] = await Promise.all([
    prisma.inboundEmail.findMany({ orderBy: { receivedAt: "desc" }, take: 100 }),
    prisma.inboundEmail.count({ where: { isRead: false } })
  ]);

  return (
    <div className="stack">
      <h1>Inbox</h1>
      <p className={styles.intro}>
        Real email sent to any @whheritagefoundation.org address, once Cloudflare Email
        Routing is configured for the domain. Contact form submissions live under{" "}
        <strong>Messages</strong> instead.
      </p>

      <div className="grid-auto">
        <Card>
          <p className={styles.statLabel}>Total received</p>
          <p className={styles.statValue}>{emails.length}</p>
        </Card>
        <Card>
          <p className={styles.statLabel}>Unread</p>
          <p className={styles.statValue}>{unreadCount}</p>
        </Card>
      </div>

      {emails.length === 0 ? (
        <Card>
          <p className={styles.empty}>Nothing received yet.</p>
        </Card>
      ) : (
        <div className={styles.list}>
          {emails.map((email) => (
            <Card key={email.id} className={styles.emailCard}>
              <div className={styles.emailHeader}>
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
    </div>
  );
}
