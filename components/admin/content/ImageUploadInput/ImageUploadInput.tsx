"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertModal";
import styles from "./ImageUploadInput.module.css";

interface ImageUploadInputProps {
  fieldKey: string;
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

/**
 * Low-level "pick a file, upload it to R2, hand back the URL" control —
 * purely controlled, no save-to-server of its own (the caller decides when
 * that URL is actually persisted). Reused by both ImageField (a standalone
 * top-level content field, which adds its own explicit Save) and ListField's
 * item-edit modal (where the whole item is saved together).
 */
export function ImageUploadInput({ fieldKey, value, onChange, label }: ImageUploadInputProps) {
  const { showAlert } = useAlert();
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fieldKey", fieldKey);

      const res = await fetch("/api/admin/content/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) {
        showAlert({ title: "Upload failed", message: json.error?.message ?? "Something went wrong.", variant: "error" });
        return;
      }

      onChange(json.data.url);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      {label && <p className={styles.label}>{label}</p>}
      <div className={styles.preview}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary runtime R2 URLs, not a static import; next/image adds no value in this small admin thumbnail
          <img src={value} alt="" className={styles.thumbnail} />
        ) : (
          <div className={styles.placeholder}>No image</div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className={styles.fileInput} onChange={handleFileSelect} />
      <div className={styles.actions}>
        <Button type="button" variant="ghost" disabled={isUploading} onClick={() => inputRef.current?.click()}>
          {isUploading ? "Uploading…" : value ? "Replace image" : "Upload image"}
        </Button>
        {value && (
          <Button type="button" variant="ghost" onClick={() => onChange("")}>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}
