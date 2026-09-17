import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { contentRegistry } from "@/lib/content/registry";
import styles from "./content.module.css";

/**
 * Picker for the family content editor — one card per page in
 * lib/content/registry.ts, linking to its editor. No DB call needed here,
 * the registry itself is static; the [slug] editor page fetches values.
 */
export default function AdminContentPickerPage() {
  return (
    <div className="stack">
      <h1>Content</h1>
      <p className={styles.intro}>Choose a page to edit its text and images. Changes go live as soon as you save.</p>

      {contentRegistry.length === 0 ? (
        <Card>
          <p>No editable pages yet.</p>
        </Card>
      ) : (
        <div className="grid-auto">
          {contentRegistry.map((page) => (
            <Link key={page.slug} href={`/admin/content/${page.slug}`} className={styles.cardLink}>
              <Card className={styles.pageCard}>
                <p className={styles.pageLabel}>{page.label}</p>
                <p className={styles.pageMeta}>{page.sections.length} field{page.sections.length === 1 ? "" : "s"}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
