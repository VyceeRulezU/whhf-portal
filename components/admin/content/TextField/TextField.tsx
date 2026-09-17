"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertModal";
import { Card } from "@/components/ui/Card";
import type { TextFieldDef } from "@/lib/content/registry";
import styles from "./TextField.module.css";

interface TextFieldProps {
  field: TextFieldDef;
  initialValue: string;
}

/**
 * A standalone, independently-saved text field on a content editor page.
 * Explicit Save (not autosave-on-blur) — non-technical editors need an
 * unambiguous "yes, that's live now" signal, matching the site owner's own
 * phrasing ("goes straight to production on save").
 */
export function TextField({ field, initialValue }: TextFieldProps) {
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
      {field.multiline ? (
        <Textarea label={field.label} value={value} onChange={(e) => setValue(e.target.value)} rows={4} />
      ) : (
        <Input label={field.label} value={value} onChange={(e) => setValue(e.target.value)} />
      )}
      <div className={styles.actions}>
        <Button type="button" variant="primary" disabled={!isDirty || isSaving} onClick={handleSave}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
    </Card>
  );
}
