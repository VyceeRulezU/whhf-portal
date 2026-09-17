import { eq, desc, count, sum } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { donations as donationsTable, contactMessages, inboundEmails } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/format/currency";
import { formatDate } from "@/lib/format/date";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/admin/StatCard";
import { CardCarousel } from "@/components/admin/CardCarousel";
import { Avatar } from "@/components/admin/Avatar";
import { Table } from "@/components/admin/Table";
import { DashboardIcon, DonationsIcon, EmailIcon } from "@/components/admin/icons";
import styles from "./dashboard.module.css";
import type { TableColumn } from "@/components/admin/Table";

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

  const recentDonationColumns: TableColumn<(typeof recentDonations)[number]>[] = [
    {
      header: "Donor",
      cell: (donation) => (
        <div className={styles.donorCell}>
          <Avatar name={donation.donor.name} />
          <span>{donation.donor.name}</span>
        </div>
      )
    },
    { header: "Date", cell: (donation) => formatDate(donation.createdAt) },
    { header: "Amount", cell: (donation) => formatCurrency(donation.amount, donation.currency) },
    {
      header: "Status",
      cell: (donation) => <span className={styles[`status--${donation.status}`]}>{donation.status}</span>
    }
  ];

  return (
    <div className="stack">
      <h1>Dashboard</h1>

      <CardCarousel>
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
      </CardCarousel>

      <Card>
        <p className={styles.sectionHeading}>Recent donations</p>
        <Table
          columns={recentDonationColumns}
          rows={recentDonations}
          getRowKey={(donation) => donation.id}
          emptyMessage="No donations recorded yet."
        />
      </Card>
    </div>
  );
}
