"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAlert } from "@/components/ui/AlertModal";
import { ImageUploadInput } from "@/components/admin/content/ImageUploadInput";
import type { ImageFieldDef } from "@/lib/content/registry";
import styles from "./ImageField.module.css";

interface ImageFieldProps {
  field: ImageFieldDef;
  initialValue: string;
}

export function ImageField({ field, initialValue }: ImageFieldProps) {
  const { showAlert } = useAlert();
  const [value, setValue] = useState(initialValue);
  const [savedValue, setSavedValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = value !== savedValue;

  async function handleSave() {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/content/field", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldKey: field.key, value })
      });
      const json = await res.json();

      if (!res.ok) {
        showAlert({ title: "Couldn't save", message: json.error?.message ?? "Something went wrong.", variant: "error" });
        return;
      }

      setSavedValue(value);
      showAlert({ title: "Saved", message: `"${field.label}" is now live.`, variant: "success" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className={styles.card}>
      <ImageUploadInput fieldKey={field.key} value={value} onChange={setValue} label={field.label} />
      <div className={styles.actions}>
        <Button type="button" variant="primary" disabled={!isDirty || isSaving} onClick={handleSave}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
