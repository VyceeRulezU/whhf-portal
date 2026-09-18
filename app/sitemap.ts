import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content/siteConfig";
import { getPageContent } from "@/lib/content/getPageContent";

/**
 * Public marketing + donate routes only — no admin, API, or the
 * transactional /donate/thank-you and /donate/callback pages (nothing for
 * a search index there). See app/robots.ts for the matching disallow rules.
 *
 * Blog posts and impact stories are family-editable (see
 * lib/content/registry.ts), so this reads their current slugs from the
 * database on every request rather than a static list — dynamic for the
 * same reason app/(marketing)/layout.tsx is.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const blogContent = await getPageContent("blog");
  const impactContent = await getPageContent("impact");
  const blogPosts = blogContent["blog.posts"] as { slug: string }[];
  const impactStories = impactContent["impact.stories.items"] as { slug: string }[];

  const routes: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }> = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/programmes", changeFrequency: "monthly", priority: 0.8 },
    { path: "/impact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/leadership", changeFrequency: "monthly", priority: 0.5 },
    { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
    { path: "/donate", changeFrequency: "monthly", priority: 0.9 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
    { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
    { path: "/faith", changeFrequency: "yearly", priority: 0.5 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
    ...blogPosts.map((post) => ({
      path: `/blog/${post.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6
    })),
    ...impactStories.map((story) => ({
      path: `/impact/${story.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6
    }))
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}
