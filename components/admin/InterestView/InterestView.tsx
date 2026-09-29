"use client";

import { useState } from "react";
import { CardCarousel } from "@/components/admin/CardCarousel";
import { StatCard } from "@/components/admin/StatCard";
import { Table } from "@/components/admin/Table";
import { EmailDetailModal } from "@/components/admin/EmailDetailModal";
import { InterestIcon, EyeIcon } from "@/components/admin/icons";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/format/date";
import { interestCategoryLabel } from "@/lib/validation/interest";
import styles from "./InterestView.module.css";
import type { TableColumn } from "@/components/admin/Table";

interface InterestSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: string;
  otherDetails: string | null;
  createdAt: Date;
}

interface InterestViewProps {
  submissions: InterestSubmission[];
  total: number;
}

/**
 * Client so the "View" action can open a detail modal — reuses
 * EmailDetailModal's read-only subject/meta/body shell rather than a
 * bespoke modal, since a submission's shape (name + meta rows + a free-text
 * body for the "other" details) fits it exactly. See
 * app/admin/(protected)/interest/page.tsx for the server-side fetch.
 */
export function InterestView({ submissions, total }: InterestViewProps) {
  const [detailTarget, setDetailTarget] = useState<InterestSubmission | null>(null);

  const columns: TableColumn<InterestSubmission>[] = [
    { header: "Name", cell: (row) => <span>{row.name}</span> },
    { header: "Phone", cell: (row) => <a href={`tel:${row.phone}`}>{row.phone}</a> },
    { header: "Email", cell: (row) => <a href={`mailto:${row.email}`}>{row.email}</a> },
    { header: "Category", cell: (row) => <span>{interestCategoryLabel(row.category)}</span> },
    { header: "Submitted", cell: (row) => formatDateTime(row.createdAt) },
    {
      header: "Actions",
      className: styles.actionsCell,
      cell: (row) => (
        <button
          type="button"
          className={styles.iconButton}
          title="View details"
          aria-label={`View details for ${row.name}`}
          onClick={() => setDetailTarget(row)}
        >
          <EyeIcon />
        </button>
      )
    }
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

      {detailTarget && (
        <EmailDetailModal
          isOpen={Boolean(detailTarget)}
          onClose={() => setDetailTarget(null)}
          subject={detailTarget.name}
          meta={[
            { label: "Phone", value: detailTarget.phone },
            { label: "Email", value: detailTarget.email },
            { label: "Category", value: interestCategoryLabel(detailTarget.category) },
            { label: "Submitted", value: formatDateTime(detailTarget.createdAt) }
          ]}
          body={detailTarget.otherDetails || "No additional details provided."}
        />
      )}
    </div>
  );
}
