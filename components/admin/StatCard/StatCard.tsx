import { Card } from "@/components/ui/Card";
import styles from "./StatCard.module.css";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  meta?: string;
}

/** Icon + label + big value stat tile — used across the admin dashboard,
    donations, and email pages so every summary number reads the same way. */
export function StatCard({ icon, label, value, meta }: StatCardProps) {
  return (
    <Card className={styles.card}>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
      <div className={styles.body}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>
    </Card>
  );
}
