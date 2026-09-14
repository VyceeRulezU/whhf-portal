import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
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
  const [totalsByCurrency, recentDonations, unreadMessages, totalMessages, unreadEmails, totalEmails] =
    await Promise.all([
      prisma.donation.groupBy({
        by: ["currency"],
        where: { status: "succeeded" },
        _sum: { amount: true }
      }),
      prisma.donation.findMany({
        include: { donor: true },
        orderBy: { createdAt: "desc" },
        take: 5
      }),
      prisma.contactMessage.count({ where: { status: "unread" } }),
      prisma.contactMessage.count(),
      prisma.inboundEmail.count({ where: { isRead: false } }),
      prisma.inboundEmail.count()
    ]);

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
                {formatCurrency(row._sum.amount ?? 0, row.currency)}
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
