import { prisma } from "@/lib/db/prisma";
import { formatCurrency } from "@/lib/format/currency";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import styles from "./donations.module.css";

const STATUS_COLOR: Record<string, string> = {
  succeeded: "var(--color-success)",
  pending: "var(--color-text-muted)",
  processing: "var(--color-gold)",
  failed: "var(--color-error)",
  refunded: "var(--color-text-muted)"
};

/**
 * Reachable only through app/admin/(protected)/layout.tsx's session guard.
 * Minimal v1 per PRD.md §7: aggregate totals + filterable list + CSV export.
 * Filters (date range, status, provider, cause) are a follow-up — this
 * renders the most recent donations plus succeeded-total aggregates.
 */
export default async function AdminDonationsPage() {
  const [donations, totalsByCurrency, succeededDonorRows] = await Promise.all([
    prisma.donation.findMany({
      include: { donor: true, cause: true },
      orderBy: { createdAt: "desc" },
      take: 50
    }),
    prisma.donation.groupBy({
      by: ["currency"],
      where: { status: "succeeded" },
      _sum: { amount: true },
      _count: true
    }),
    prisma.donation.groupBy({
      by: ["donorId"],
      where: { status: "succeeded" }
    })
  ]);

  const totalSucceededCount = totalsByCurrency.reduce((sum, row) => sum + row._count, 0);
  const uniqueDonorCount = succeededDonorRows.length;

  return (
    <div className="stack">
      <div className="cluster" style={{ justifyContent: "space-between" }}>
        <h1>Donations</h1>
        <a href="/api/admin/donations/export">
          <Button variant="outline">Export CSV</Button>
        </a>
      </div>

      <div className="grid-auto">
        {totalsByCurrency.length === 0 ? (
          <Card>
            <p className={styles.statLabel}>Total raised</p>
            <p className={styles.statValue}>No succeeded donations yet</p>
          </Card>
        ) : (
          totalsByCurrency.map((row) => (
            <Card key={row.currency}>
              <p className={styles.statLabel}>Total raised ({row.currency})</p>
              <p className={styles.statValue}>{formatCurrency(row._sum.amount ?? 0, row.currency)}</p>
            </Card>
          ))
        )}
        <Card>
          <p className={styles.statLabel}>Succeeded donations</p>
          <p className={styles.statValue}>{totalSucceededCount}</p>
        </Card>
        <Card>
          <p className={styles.statLabel}>Unique donors</p>
          <p className={styles.statValue}>{uniqueDonorCount}</p>
        </Card>
      </div>

      <Card>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Donor</th>
                <th>Cause</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {donations.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No donations recorded yet.
                  </td>
                </tr>
              )}
              {donations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.createdAt.toLocaleDateString()}</td>
                  {/* Donor email intentionally not shown in this list view — see
                      security.md: admin exports of donor PII should be a
                      deliberate, audited action (the CSV export), not exposed
                      by default in every screen that touches donation data. */}
                  <td>{donation.donor.name}</td>
                  <td>{donation.cause.name}</td>
                  <td>{formatCurrency(donation.amount, donation.currency)}</td>
                  <td>
                    <span className={styles.status} style={{ color: STATUS_COLOR[donation.status] }}>
                      {donation.status}
                    </span>
                  </td>
                  <td>{donation.provider}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
