import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/marketing/ArticleLayout";
import { getPageContent, splitParagraphs } from "@/lib/content/getPageContent";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  body: string;
}

// No generateStaticParams — this route is dynamic (see
// app/(marketing)/layout.tsx), resolved per request against the current
// family-editable post list, so a newly added post works immediately with
// no rebuild.

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPageContent("blog");
  const posts = content["blog.posts"] as BlogPost[];
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = await getPageContent("blog");
  const posts = content["blog.posts"] as BlogPost[];
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <ArticleLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
      eyebrow={post.category}
      title={post.title}
      meta={`${new Date(post.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      })} · ${post.readTime}`}
      image={post.image}
    >
      {splitParagraphs(post.body).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </ArticleLayout>
  );
}
