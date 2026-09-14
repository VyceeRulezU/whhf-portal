import { eq, desc, count, sum } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { donations as donationsTable } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/format/currency";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import styles from "./donations.module.css";

/**
 * Reachable only through app/admin/(protected)/layout.tsx's session guard.
 * Minimal v1 per PRD.md §7: aggregate totals + filterable list + CSV export.
 * Filters (date range, status, provider, cause) are a follow-up — this
 * renders the most recent donations plus succeeded-total aggregates.
 */
export default async function AdminDonationsPage() {
  const [donations, totalsByCurrency, succeededDonorRows] = await Promise.all([
    withDb((db) =>
      db.query.donations.findMany({
        with: { donor: true, cause: true },
        orderBy: [desc(donationsTable.createdAt)],
        limit: 50
      })
    ),
    withDb((db) =>
      db
        .select({ currency: donationsTable.currency, total: sum(donationsTable.amount), count: count() })
        .from(donationsTable)
        .where(eq(donationsTable.status, "succeeded"))
        .groupBy(donationsTable.currency)
    ),
    withDb((db) =>
      db
        .selectDistinct({ donorId: donationsTable.donorId })
        .from(donationsTable)
        .where(eq(donationsTable.status, "succeeded"))
    )
  ]);

  const totalSucceededCount = totalsByCurrency.reduce((sum, row) => sum + row.count, 0);
  const uniqueDonorCount = succeededDonorRows.length;

  return (
    <div className="stack">
      <div className={`cluster ${styles.headerRow}`}>
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
              <p className={styles.statValue}>{formatCurrency(Number(row.total ?? 0), row.currency)}</p>
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
                    <span className={`${styles.status} ${styles[`status--${donation.status}`]}`}>
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
