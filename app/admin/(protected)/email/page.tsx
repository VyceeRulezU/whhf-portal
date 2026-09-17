import { eq, desc, count } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { contactMessages, inboundEmails, sentEmails } from "@/lib/db/schema";
import { StatCard } from "@/components/admin/StatCard";
import { CardCarousel } from "@/components/admin/CardCarousel";
import { EmailView } from "@/components/admin/EmailView";
import { EmailIcon } from "@/components/admin/icons";

/**
 * Merges the former separate Inbox (real routed email — see
 * app/api/webhooks/inbound-email/route.ts) and Messages (/contact form
 * submissions — see app/api/contact/route.ts) admin sections, plus a new
 * Outgoing tab (admin-sent replies/compositions — see
 * app/api/admin/email/send/route.ts), into one page with in-page tabs.
 */
export default async function AdminEmailPage() {
  const [emails, unreadEmailRows, messages, unreadMessageRows, sent] = await Promise.all([
    withDb((db) => db.query.inboundEmails.findMany({ orderBy: [desc(inboundEmails.receivedAt)], limit: 100 })),
    withDb((db) => db.select({ count: count() }).from(inboundEmails).where(eq(inboundEmails.isRead, false))),
    withDb((db) => db.query.contactMessages.findMany({ orderBy: [desc(contactMessages.createdAt)], limit: 100 })),
    withDb((db) => db.select({ count: count() }).from(contactMessages).where(eq(contactMessages.status, "unread"))),
    withDb((db) => db.query.sentEmails.findMany({ orderBy: [desc(sentEmails.createdAt)], limit: 100 }))
  ]);

  const unreadEmailCount = unreadEmailRows[0]?.count ?? 0;
  const unreadMessageCount = unreadMessageRows[0]?.count ?? 0;

  return (
    <div className="stack">
      <h1>Email</h1>

      <CardCarousel>
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
        <StatCard icon={<EmailIcon />} label="Outgoing" value={sent.length} meta="Sent from this panel" />
      </CardCarousel>

      <EmailView
        emails={emails}
        unreadEmailCount={unreadEmailCount}
        messages={messages}
        unreadMessageCount={unreadMessageCount}
        sent={sent}
      />
    </div>
  );
}
