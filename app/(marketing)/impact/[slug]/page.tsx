import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/marketing/ArticleLayout";
import { impactStories, getImpactStory } from "@/lib/content/impactStories";

export function generateStaticParams() {
  return impactStories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = getImpactStory(slug);
  if (!story) return {};
  return { title: story.title, description: story.excerpt };
}

export default async function ImpactStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getImpactStory(slug);

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
      {story.body.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </ArticleLayout>
  );
}
