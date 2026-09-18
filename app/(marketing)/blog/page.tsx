import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";
import { Badge } from "@/components/ui/Badge";
import { getPageContent } from "@/lib/content/getPageContent";
import styles from "./blog.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Stories, updates, and reflections from the William & Helen Heritage Foundation."
};

interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
}

export default async function BlogPage() {
  const content = await getPageContent("blog");
  const blogPosts = content["blog.posts"] as BlogPostSummary[];

  return (
    <>
      <PageHero
        eyebrow={content["blog.hero.eyebrow"] as string}
        title={content["blog.hero.title"] as string}
        lede={content["blog.hero.lede"] as string}
      />
      <section className="section">
        <div className="container">
          <div className={styles.grid}>
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.card}>
                <div className={styles.cardImageWrap}>
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 380px"
                    className={styles.cardImage}
                  />
                </div>
                <div className={styles.cardBody}>
                  <Badge>{post.category}</Badge>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  <p className={styles.cardMeta}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}{" "}
                    · {post.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
