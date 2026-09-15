"use client";

import styles from "./Tabs.module.css";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
}

/** Controlled tab bar — the caller owns which tab is active and how the
    content underneath responds, so the same component works for filtering
    an already-fetched list (Donations, Email) without extra page loads. */
export function Tabs({ items, activeId, onChange }: TabsProps) {
  return (
    <div className={styles.tabs} role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === activeId}
          className={`${styles.tab} ${item.id === activeId ? styles["tab--active"] : ""}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
          {item.count !== undefined && <span className={styles.count}>{item.count}</span>}
        </button>
      ))}
    </div>
  );
}
