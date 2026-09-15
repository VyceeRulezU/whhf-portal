import { eq, desc, count, sum } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { donations as donationsTable } from "@/lib/db/schema";
import { formatCurrency } from "@/lib/format/currency";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/admin/StatCard";
import { DonationsTable } from "@/components/admin/DonationsTable";
import { DonationsIcon, DashboardIcon, EmailIcon } from "@/components/admin/icons";
import styles from "./donations.module.css";

/**
 * Reachable only through app/admin/(protected)/layout.tsx's session guard.
 * Minimal v1 per PRD.md §7: aggregate totals + filterable list + CSV export.
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
        <StatCard
          icon={<DonationsIcon />}
          label="Total raised"
          value={
            totalsByCurrency.length === 0
              ? "—"
              : totalsByCurrency.map((row) => formatCurrency(Number(row.total ?? 0), row.currency)).join(" · ")
          }
        />
        <StatCard icon={<DashboardIcon />} label="Succeeded donations" value={totalSucceededCount} />
        <StatCard icon={<EmailIcon />} label="Unique donors" value={uniqueDonorCount} />
      </div>

      <DonationsTable donations={donations} />
    </div>
  );
}
