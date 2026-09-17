"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useAlert } from "@/components/ui/AlertModal";
import { Table } from "@/components/admin/Table";
import { TrashIcon } from "@/components/admin/icons";
import { ImageUploadInput } from "@/components/admin/content/ImageUploadInput";
import type { ListFieldDef } from "@/lib/content/registry";
import type { TableColumn } from "@/components/admin/Table";
import styles from "./ListField.module.css";

interface ListFieldProps {
  field: ListFieldDef;
  initialItems: Record<string, string>[];
}

function emptyItem(field: ListFieldDef): Record<string, string> {
  return Object.fromEntries(field.itemFields.map((f) => [f.key, ""]));
}

/**
 * Repeater for a registry "list" field (board members, FAQ items, gallery
 * images, etc.) — built on the existing Table component. All add/edit/
 * remove/reorder happens against local state; one "Save list" persists the
 * whole array in one write (see PUT /api/admin/content/list).
 */
export function ListField({ field, initialItems }: ListFieldProps) {
  const { showAlert } = useAlert();
  const [items, setItems] = useState<Record<string, string>[]>(initialItems);
  const [savedItems, setSavedItems] = useState<Record<string, string>[]>(initialItems);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = JSON.stringify(items) !== JSON.stringify(savedItems);

  function handleAdd() {
    setItems((current) => [...current, emptyItem(field)]);
    setEditingIndex(items.length);
  }

  function handleRemove(index: number) {
    const label = items[index]?.[field.itemFields[0]?.key ?? ""] || `item ${index + 1}`;
    if (!window.confirm(`Remove "${label}" from ${field.label}?`)) return;
    setItems((current) => current.filter((_, i) => i !== index));
  }

  function handleItemChange(index: number, key: string, value: string) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  }

  async function handleSaveList() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content/list", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldKey: field.key, items })
      });
      const json = await res.json();

      if (!res.ok) {
        showAlert({ title: "Couldn't save", message: json.error?.message ?? "Something went wrong.", variant: "error" });
        return;
      }

      setSavedItems(items);
      showAlert({ title: "Saved", message: `"${field.label}" is now live.`, variant: "success" });
    } finally {
      setIsSaving(false);
    }
  }

  const columns: TableColumn<Record<string, string>>[] = [
    ...field.itemFields.map((itemField) => ({
      header: itemField.label,
      cell: (item: Record<string, string>) =>
        itemField.type === "image" ? (
          item[itemField.key] ? (
            // eslint-disable-next-line @next/next/no-img-element -- small admin table thumbnail from an arbitrary runtime URL
            <img src={item[itemField.key]} alt="" className={styles.rowThumbnail} />
          ) : (
            <span className={styles.emptyThumb}>—</span>
          )
        ) : (
          <span>{item[itemField.key]}</span>
        )
    })),
    {
      header: "Actions",
      className: styles.actionsCell,
      cell: (item: Record<string, string>) => {
        const index = items.indexOf(item);
        return (
          <div className={styles.rowActions}>
            <button type="button" className={styles.editLink} onClick={() => setEditingIndex(index)}>
              Edit
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => handleRemove(index)}
              aria-label="Remove"
              title="Remove"
            >
              <TrashIcon />
            </button>
          </div>
        );
      }
    }
  ];

  const editingItem = editingIndex !== null ? items[editingIndex] : null;

  function getRowKey(row: Record<string, string>): string {
    return String(items.indexOf(row));
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <p className={styles.label}>{field.label}</p>
        <Button type="button" variant="ghost" onClick={handleAdd}>
          Add item
        </Button>
      </div>

      <Table columns={columns} rows={items} getRowKey={getRowKey} emptyMessage="Nothing here yet." />

      <div className={styles.actions}>
        <Button type="button" variant="primary" disabled={!isDirty || isSaving} onClick={handleSaveList}>
          {isSaving ? "Saving…" : "Save list"}
        </Button>
      </div>

      {editingItem && editingIndex !== null && (
        <div className={styles.overlay} role="presentation" onClick={() => setEditingIndex(null)}>
          <div
            className={`${styles.modal} scrollbar-hidden`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h2>Edit item</h2>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setEditingIndex(null)}
                aria-label="Close"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className={`stack ${styles.modalForm}`}>
              {field.itemFields.map((itemField) =>
                itemField.type === "image" ? (
                  <ImageUploadInput
                    key={itemField.key}
                    fieldKey={field.key}
                    label={itemField.label}
                    value={editingItem[itemField.key] ?? ""}
                    onChange={(url) => handleItemChange(editingIndex, itemField.key, url)}
                  />
                ) : itemField.multiline ? (
                  <Textarea
                    key={itemField.key}
                    label={itemField.label}
                    value={editingItem[itemField.key] ?? ""}
                    onChange={(e) => handleItemChange(editingIndex, itemField.key, e.target.value)}
                    rows={4}
                  />
                ) : (
                  <Input
                    key={itemField.key}
                    label={itemField.label}
                    value={editingItem[itemField.key] ?? ""}
                    onChange={(e) => handleItemChange(editingIndex, itemField.key, e.target.value)}
                  />
                )
              )}
              <div className={styles.modalActions}>
                <Button type="button" variant="primary" onClick={() => setEditingIndex(null)}>
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
