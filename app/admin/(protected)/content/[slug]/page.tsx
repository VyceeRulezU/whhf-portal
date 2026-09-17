import Link from "next/link";
import { notFound } from "next/navigation";
import { getPageManifest } from "@/lib/content/registry";
import { getPageContent } from "@/lib/content/getPageContent";
import { ContentEditorView } from "@/components/admin/content/ContentEditorView";
import styles from "./editor.module.css";

export default async function AdminContentEditorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const manifest = getPageManifest(slug);
  if (!manifest) notFound();

  const values = await getPageContent(slug);

  return (
    <div className="stack">
      <div>
        <Link href="/admin/content" className={styles.back}>
          ← All pages
        </Link>
        <h1>{manifest.label}</h1>
      </div>
      <ContentEditorView manifest={manifest} values={values} />
    </div>
  );
}
