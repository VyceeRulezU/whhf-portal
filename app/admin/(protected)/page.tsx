import Link from "next/link";
import { eq, desc, count, sum } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { donations as donationsTable, contactMessages, inboundEmails } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/format/currency";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import styles from "./dashboard.module.css";

/**
 * Landing page for /admin — a single overview pulling the headline number
 * from each section (Donations, Messages, Inbox) so staff can see what
 * needs attention without visiting each page in turn.
 */
export default async function AdminDashboardPage() {
  const [
    totalsByCurrency,
    recentDonations,
    unreadMessagesRows,
    totalMessagesRows,
    unreadEmailsRows,
    totalEmailsRows
  ] = await Promise.all([
    withDb((db) =>
      db
        .select({ currency: donationsTable.currency, total: sum(donationsTable.amount) })
        .from(donationsTable)
        .where(eq(donationsTable.status, "succeeded"))
        .groupBy(donationsTable.currency)
    ),
    withDb((db) =>
      db.query.donations.findMany({
        with: { donor: true },
        orderBy: [desc(donationsTable.createdAt)],
        limit: 5
      })
    ),
    withDb((db) => db.select({ count: count() }).from(contactMessages).where(eq(contactMessages.status, "unread"))),
    withDb((db) => db.select({ count: count() }).from(contactMessages)),
    withDb((db) => db.select({ count: count() }).from(inboundEmails).where(eq(inboundEmails.isRead, false))),
    withDb((db) => db.select({ count: count() }).from(inboundEmails))
  ]);

  const unreadMessages = unreadMessagesRows[0]?.count ?? 0;
  const totalMessages = totalMessagesRows[0]?.count ?? 0;
  const unreadEmails = unreadEmailsRows[0]?.count ?? 0;
  const totalEmails = totalEmailsRows[0]?.count ?? 0;

  return (
    <div className="stack">
      <h1>Dashboard</h1>

      <div className="grid-auto">
        <Card>
          <p className={styles.statLabel}>Total raised</p>
          {totalsByCurrency.length === 0 ? (
            <p className={styles.statValue}>—</p>
          ) : (
            totalsByCurrency.map((row) => (
              <p key={row.currency} className={styles.statValue}>
                {formatCurrency(Number(row.total ?? 0), row.currency)}
              </p>
            ))
          )}
        </Card>
        <Card>
          <p className={styles.statLabel}>Unread messages</p>
          <p className={styles.statValue}>
            {unreadMessages} <span className={styles.statMuted}>/ {totalMessages}</span>
          </p>
        </Card>
        <Card>
          <p className={styles.statLabel}>Unread inbox mail</p>
          <p className={styles.statValue}>
            {unreadEmails} <span className={styles.statMuted}>/ {totalEmails}</span>
          </p>
        </Card>
      </div>

      <div className={styles.quickLinks}>
        <Link href="/admin/donations">
          <Button variant="outline">View donations →</Button>
        </Link>
        <Link href="/admin/messages">
          <Button variant="outline">View messages →</Button>
        </Link>
        <Link href="/admin/inbox">
          <Button variant="outline">View inbox →</Button>
        </Link>
      </div>

      <Card>
        <p className={styles.sectionHeading}>Recent donations</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Donor</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentDonations.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    No donations recorded yet.
                  </td>
                </tr>
              )}
              {recentDonations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.createdAt.toLocaleDateString()}</td>
                  <td>{donation.donor.name}</td>
                  <td>{formatCurrency(donation.amount, donation.currency)}</td>
                  <td className={styles[`status--${donation.status}`]}>{donation.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
