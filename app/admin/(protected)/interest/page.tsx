import { desc, count } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { interestSubmissions } from "@/lib/db/schema";
import { StatCard } from "@/components/admin/StatCard";
import { CardCarousel } from "@/components/admin/CardCarousel";
import { Card } from "@/components/ui/Card";
import { Table } from "@/components/admin/Table";
import { InterestIcon } from "@/components/admin/icons";
import { formatDateTime } from "@/lib/format/date";
import { interestCategoryLabel } from "@/lib/validation/interest";
import type { TableColumn } from "@/components/admin/Table";

/**
 * Read-only list of /interest form submissions (see app/(marketing)/interest
 * and app/api/interest/route.ts) — people who left their details wanting
 * to get involved. Newest first.
 */
export default async function AdminInterestPage() {
  const [submissions, totalRows] = await Promise.all([
    withDb((db) => db.query.interestSubmissions.findMany({ orderBy: [desc(interestSubmissions.createdAt)] })),
    withDb((db) => db.select({ count: count() }).from(interestSubmissions))
  ]);

  const total = totalRows[0]?.count ?? 0;

  const columns: TableColumn<(typeof submissions)[number]>[] = [
    { header: "Name", cell: (row) => <span>{row.name}</span> },
    { header: "Phone", cell: (row) => <a href={`tel:${row.phone}`}>{row.phone}</a> },
    { header: "Email", cell: (row) => <a href={`mailto:${row.email}`}>{row.email}</a> },
    {
      header: "Category",
      cell: (row) => (
        <span title={row.otherDetails ?? undefined}>
          {interestCategoryLabel(row.category)}
          {row.otherDetails ? `: ${row.otherDetails}` : ""}
        </span>
      )
    },
    { header: "Submitted", cell: (row) => formatDateTime(row.createdAt) }
  ];

  return (
    <div className="stack">
      <h1>Interest</h1>

      <CardCarousel>
        <StatCard icon={<InterestIcon />} label="Total submissions" value={total} />
      </CardCarousel>

      <Card>
        <Table
          columns={columns}
          rows={submissions}
          getRowKey={(row) => row.id}
          emptyMessage="No one has submitted the interest form yet."
        />
      </Card>
    </div>
  );
}
