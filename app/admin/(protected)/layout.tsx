import { redirect } from "next/navigation";
import { eq, desc, count } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { adminUsers, inboundEmails, contactMessages, donations } from "@/lib/db/schema";
import { AdminShell } from "@/components/admin/AdminShell";
import { formatCurrency } from "@/lib/format/currency";
import type { NotificationItem } from "@/components/admin/NotificationDrawer";

/**
 * Guards everything under app/admin/(protected)/**. app/admin/login lives
 * OUTSIDE this route group specifically so the login page itself isn't
 * gated behind the session check it's trying to create. See security.md
 * ("Admin auth") — fail closed: no session, no access, full stop.
 *
 * Also looks up the signed-in admin's email (top bar) and a small
 * notification feed (unread email/messages + recent donations) for the
 * bell drawer — batched into one withDb() call rather than several, since
 * every extra call opens its own connection (see lib/db/client.ts).
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { admin, unreadEmailCount, unreadMessageCount, notifications } = await withDb(async (db) => {
    const [admin, unreadEmailRows, unreadMessageRows, recentEmails, recentMessages, recentDonations] =
      await Promise.all([
        db.query.adminUsers.findFirst({ where: eq(adminUsers.id, session.adminUserId) }),
        db.select({ count: count() }).from(inboundEmails).where(eq(inboundEmails.isRead, false)),
        db.select({ count: count() }).from(contactMessages).where(eq(contactMessages.status, "unread")),
        db.query.inboundEmails.findMany({
          where: eq(inboundEmails.isRead, false),
          orderBy: [desc(inboundEmails.receivedAt)],
          limit: 5
        }),
        db.query.contactMessages.findMany({
          where: eq(contactMessages.status, "unread"),
          orderBy: [desc(contactMessages.createdAt)],
          limit: 5
        }),
        db.query.donations.findMany({
          where: eq(donations.status, "succeeded"),
          with: { donor: true },
          orderBy: [desc(donations.createdAt)],
          limit: 5
        })
      ]);

    const items: NotificationItem[] = [
      ...recentEmails.map((email) => ({
        id: `email-${email.id}`,
        type: "email" as const,
        title: email.subject || "(no subject)",
        description: `From ${email.fromAddress}`,
        href: "/admin/email",
        createdAt: email.receivedAt
      })),
      ...recentMessages.map((msg) => ({
        id: `message-${msg.id}`,
        type: "message" as const,
        title: `${msg.name} sent a message`,
        description: msg.subject || msg.message.slice(0, 60),
        href: "/admin/email",
        createdAt: msg.createdAt
      })),
      ...recentDonations.map((donation) => ({
        id: `donation-${donation.id}`,
        type: "donation" as const,
        title: `${donation.donor.name} donated ${formatCurrency(donation.amount, donation.currency)}`,
        description: "Succeeded",
        href: "/admin/donations",
        createdAt: donation.createdAt
      }))
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      admin,
      unreadEmailCount: unreadEmailRows[0]?.count ?? 0,
      unreadMessageCount: unreadMessageRows[0]?.count ?? 0,
      notifications: items
    };
  });

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AdminShell adminEmail={admin.email} notifications={notifications} unreadCount={unreadEmailCount + unreadMessageCount}>
      {children}
    </AdminShell>
  );
}
