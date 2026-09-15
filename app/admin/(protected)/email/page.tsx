import { eq, desc, count } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { contactMessages, inboundEmails } from "@/lib/db/schema";
import { StatCard } from "@/components/admin/StatCard";
import { EmailView } from "@/components/admin/EmailView";
import { EmailIcon } from "@/components/admin/icons";

/**
 * Merges the former separate Inbox (real routed email — see
 * app/api/webhooks/inbound-email/route.ts) and Messages (/contact form
 * submissions — see app/api/contact/route.ts) admin sections into one
 * page with in-page tabs, since both are just different channels for the
 * same job: mail WHHF needs to see and act on.
 */
export default async function AdminEmailPage() {
  const [emails, unreadEmailRows, messages, unreadMessageRows] = await Promise.all([
    withDb((db) => db.query.inboundEmails.findMany({ orderBy: [desc(inboundEmails.receivedAt)], limit: 100 })),
    withDb((db) => db.select({ count: count() }).from(inboundEmails).where(eq(inboundEmails.isRead, false))),
    withDb((db) => db.query.contactMessages.findMany({ orderBy: [desc(contactMessages.createdAt)], limit: 100 })),
    withDb((db) => db.select({ count: count() }).from(contactMessages).where(eq(contactMessages.status, "unread")))
  ]);

  const unreadEmailCount = unreadEmailRows[0]?.count ?? 0;
  const unreadMessageCount = unreadMessageRows[0]?.count ?? 0;

  return (
    <div className="stack">
      <h1>Email</h1>

      <div className="grid-auto">
        <StatCard
          icon={<EmailIcon />}
          label="Unread"
          value={unreadEmailCount + unreadMessageCount}
          meta={`${emails.length + messages.length} total`}
        />
        <StatCard icon={<EmailIcon />} label="Inbox" value={emails.length} meta={`${unreadEmailCount} unread`} />
        <StatCard
          icon={<EmailIcon />}
          label="Contact Form"
          value={messages.length}
          meta={`${unreadMessageCount} unread`}
        />
      </div>

      <EmailView
        emails={emails}
        unreadEmailCount={unreadEmailCount}
        messages={messages}
        unreadMessageCount={unreadMessageCount}
      />
    </div>
  );
}
