import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/marketing/ArticleLayout";
import { getPageContent, splitParagraphs } from "@/lib/content/getPageContent";

interface ImpactStory {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  body: string;
}

// No generateStaticParams — dynamic per request, same reasoning as
// app/(marketing)/blog/[slug]/page.tsx.

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPageContent("impact");
  const stories = content["impact.stories.items"] as ImpactStory[];
  const story = stories.find((s) => s.slug === slug);
  if (!story) return {};
  return { title: story.title, description: story.excerpt };
}

export default async function ImpactStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPageContent("impact");
  const stories = content["impact.stories.items"] as ImpactStory[];
  const story = stories.find((s) => s.slug === slug);

  if (!story) {
    notFound();
  }

  return (
    <ArticleLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Impact", href: "/impact" }, { label: story.title }]}
      eyebrow="Our Impact"
      title={story.title}
      image={story.image}
    >
      {splitParagraphs(story.body).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </ArticleLayout>
  );
}
