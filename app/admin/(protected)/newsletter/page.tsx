import { eq, desc, count } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { newsletterSubscribers, sentNewsletters } from "@/lib/db/schema";
import { StatCard } from "@/components/admin/StatCard";
import { NewsletterView } from "@/components/admin/NewsletterView";
import { EmailIcon } from "@/components/admin/icons";

/**
 * Admin newsletter platform: compose-and-send to every active subscriber
 * (see the footer's NewsletterForm for how they sign up), plus subscriber
 * management and send history. See app/api/admin/newsletter/send/route.ts.
 */
export default async function AdminNewsletterPage() {
  const [subscribers, activeCountRows, history] = await Promise.all([
    withDb((db) =>
      db.query.newsletterSubscribers.findMany({
        where: eq(newsletterSubscribers.isActive, true),
        orderBy: [desc(newsletterSubscribers.subscribedAt)]
      })
    ),
    withDb((db) => db.select({ count: count() }).from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true))),
    withDb((db) => db.query.sentNewsletters.findMany({ orderBy: [desc(sentNewsletters.createdAt)], limit: 50 }))
  ]);

  const activeSubscriberCount = activeCountRows[0]?.count ?? 0;

  return (
    <div className="stack">
      <h1>Newsletter</h1>

      <div className="grid-auto">
        <StatCard icon={<EmailIcon />} label="Active Subscribers" value={activeSubscriberCount} />
        <StatCard icon={<EmailIcon />} label="Campaigns Sent" value={history.length} />
      </div>

      <NewsletterView subscribers={subscribers} activeSubscriberCount={activeSubscriberCount} history={history} />
    </div>
  );
}
