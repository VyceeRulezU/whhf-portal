import { TextField } from "@/components/admin/content/TextField";
import { ImageField } from "@/components/admin/content/ImageField";
import { ListField } from "@/components/admin/content/ListField";
import type { PageManifest } from "@/lib/content/registry";

interface ContentEditorViewProps {
  manifest: PageManifest;
  values: Record<string, unknown>;
}

/**
 * Renders one page's editable sections top-to-bottom, in the same order
 * they appear on the live page (the manifest's `sections` array is that
 * order — see lib/content/registry.ts). Each section is an independent,
 * self-saving field component; there's no page-level "Save all" button by
 * design, since a partial save that only covers some fields would be
 * confusing (see docs/production-readiness.md's CMS section).
 */
export function ContentEditorView({ manifest, values }: ContentEditorViewProps) {
  return (
    <div className="stack">
      {manifest.sections.map((field) => {
        if (field.type === "text") {
          return <TextField key={field.key} field={field} initialValue={(values[field.key] as string) ?? field.default} />;
        }
        if (field.type === "image") {
          return <ImageField key={field.key} field={field} initialValue={(values[field.key] as string) ?? field.default} />;
        }
        return (
          <ListField
            key={field.key}
            field={field}
            initialItems={(values[field.key] as Record<string, string>[]) ?? field.default}
          />
        );
      })}
    </div>
  );
}
