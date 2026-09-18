import type { Metadata } from "next";
import { ArticleLayout } from "@/components/marketing/ArticleLayout";
import { getPageContent } from "@/lib/content/getPageContent";

export const metadata: Metadata = {
  title: "A Word of Faith",
  description: "A legacy rooted in faith and compassion: the conviction behind WHHF's work."
};

export default async function FaithPage() {
  const content = await getPageContent("faith");

  return (
    <ArticleLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "A Word of Faith" }]}
      eyebrow="A Word of Faith"
      title={content["faith.title"] as string}
      image={content["faith.image"] as string}
    >
      {/* This is memorial content — see /admin/content/faith to edit it;
          do not add/remove memorial content on your own judgment, per
          AGENTS.md and docs/content-style-guide.md. */}
      <p>{content["faith.paragraph1"] as string}</p>
      <p>{content["faith.paragraph2"] as string}</p>
      <p>{content["faith.paragraph3"] as string}</p>
      <p>{content["faith.paragraph4"] as string}</p>
      <p>{content["faith.paragraph5"] as string}</p>
    </ArticleLayout>
  );
}
