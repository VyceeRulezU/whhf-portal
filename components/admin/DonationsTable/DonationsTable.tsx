"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/admin/Avatar";
import { Tabs } from "@/components/admin/Tabs";
import { formatCurrency } from "@/lib/format/currency";
import styles from "./DonationsTable.module.css";

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
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Donor</th>
                <th>Cause</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    No donations in this view.
                  </td>
                </tr>
              )}
              {filtered.map((donation) => (
                <tr key={donation.id}>
                  {/* Donor email intentionally not shown in this list view — see
                      security.md: admin exports of donor PII should be a
                      deliberate, audited action (the CSV export), not exposed
                      by default in every screen that touches donation data. */}
                  <td>
                    <div className={styles.donorCell}>
                      <Avatar name={donation.donor.name} />
                      <span>{donation.donor.name}</span>
                    </div>
                  </td>
                  <td>{donation.cause.name}</td>
                  <td>{donation.createdAt.toLocaleDateString()}</td>
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
