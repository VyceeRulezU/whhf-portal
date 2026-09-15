import styles from "./Table.module.css";
import type { ReactNode } from "react";

export interface TableColumn<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
  emptyMessage: string;
}

/**
 * Generic column-driven admin data table — the shared <table> markup,
 * scroll wrapper, and empty state behind Donations, the dashboard's
 * Recent Donations, and the Newsletter Subscribers list, so each screen
 * only supplies its columns and row data instead of re-implementing the
 * table shell each time. Not a client component itself (no hooks), so it
 * drops straight into a server-rendered page (e.g. the dashboard) as
 * easily as a client one (e.g. DonationsTable's tab-filtered view).
 */
export function Table<T>({ columns, rows, getRowKey, emptyMessage }: TableProps<T>) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>
                {emptyMessage}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr key={getRowKey(row)}>
              {columns.map((column) => (
                <td key={column.header} className={column.className}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
