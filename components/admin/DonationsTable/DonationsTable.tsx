"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/admin/Avatar";
import { Tabs } from "@/components/admin/Tabs";
import { Table } from "@/components/admin/Table";
import { formatCurrency } from "@/lib/format/currency";
import styles from "./DonationsTable.module.css";
import type { TableColumn } from "@/components/admin/Table";

type DonationStatus = "pending" | "processing" | "succeeded" | "failed" | "refunded";

interface DonationRow {
  id: string;
  createdAt: Date;
  amount: number;
  currency: string;
  status: DonationStatus;
  provider: string;
  donor: { name: string };
  cause: { name: string };
}

const STATUS_TABS: { id: DonationStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "succeeded", label: "Succeeded" },
  { id: "pending", label: "Pending" },
  { id: "processing", label: "Processing" },
  { id: "failed", label: "Failed" },
  { id: "refunded", label: "Refunded" }
];

/** Client-side status filter over the already-fetched donation list — the
    page fetches once, this component just slices what's already there
    rather than re-querying per tab. */
export function DonationsTable({ donations }: { donations: DonationRow[] }) {
  const [activeStatus, setActiveStatus] = useState<DonationStatus | "all">("all");

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const donation of donations) {
      map.set(donation.status, (map.get(donation.status) ?? 0) + 1);
    }
    return map;
  }, [donations]);

  const filtered = activeStatus === "all" ? donations : donations.filter((d) => d.status === activeStatus);

  // Donor email is intentionally not shown in this list view — see
  // security.md: admin exports of donor PII should be a deliberate,
  // audited action (the CSV export), not exposed by default in every
  // screen that touches donation data.
  const columns: TableColumn<DonationRow>[] = [
    {
      header: "Donor",
      cell: (donation) => (
        <div className={styles.donorCell}>
          <Avatar name={donation.donor.name} />
          <span>{donation.donor.name}</span>
        </div>
      )
    },
    { header: "Cause", cell: (donation) => donation.cause.name },
    { header: "Date", cell: (donation) => donation.createdAt.toLocaleDateString() },
    { header: "Amount", cell: (donation) => formatCurrency(donation.amount, donation.currency) },
    {
      header: "Status",
      cell: (donation) => (
        <span className={`${styles.status} ${styles[`status--${donation.status}`]}`}>{donation.status}</span>
      )
    },
    { header: "Provider", cell: (donation) => donation.provider }
  ];

  return (
    <div className="stack">
      <Tabs
        items={STATUS_TABS.map((tab) => ({
          id: tab.id,
          label: tab.label,
          count: tab.id === "all" ? donations.length : counts.get(tab.id) ?? 0
        }))}
        activeId={activeStatus}
        onChange={(id) => setActiveStatus(id as DonationStatus | "all")}
      />

      <Card>
        <Table columns={columns} rows={filtered} getRowKey={(donation) => donation.id} emptyMessage="No donations in this view." />
      </Card>
    </div>
  );
}
