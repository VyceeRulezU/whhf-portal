import { eq, desc, count, sum } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { donations as donationsTable, contactMessages, inboundEmails } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/format/currency";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/admin/StatCard";
import { Avatar } from "@/components/admin/Avatar";
import { DashboardIcon, DonationsIcon, EmailIcon } from "@/components/admin/icons";
import styles from "./dashboard.module.css";

/**
 * Landing page for /admin — a single overview pulling the headline number
 * from each section (Donations, Email) so staff can see what needs
 * attention without visiting each page in turn.
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
  const unreadTotal = unreadMessages + unreadEmails;
  const total = totalMessages + totalEmails;

  return (
    <div className="stack">
      <h1>Dashboard</h1>

      <div className="grid-auto">
        <StatCard
          icon={<DonationsIcon />}
          label="Total raised"
          value={
            totalsByCurrency.length === 0
              ? "—"
              : totalsByCurrency.map((row) => formatCurrency(Number(row.total ?? 0), row.currency)).join(" · ")
          }
        />
        <StatCard icon={<EmailIcon />} label="Unread email" value={unreadTotal} meta={`${total} total`} />
        <StatCard icon={<DashboardIcon />} label="Recent donations" value={recentDonations.length} meta="Last 5" />
      </div>

      <Card>
        <p className={styles.sectionHeading}>Recent donations</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Date</th>
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
                  <td>
                    <div className={styles.donorCell}>
                      <Avatar name={donation.donor.name} />
                      <span>{donation.donor.name}</span>
                    </div>
                  </td>
                  <td>{donation.createdAt.toLocaleDateString()}</td>
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
