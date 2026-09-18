import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { GalleryGrid } from "@/components/marketing/GalleryGrid";
import { getPageContent } from "@/lib/content/getPageContent";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from WHHF's programmes, outreach, and the community behind the work."
};

interface GalleryItem {
  src: string;
  caption: string;
}

export default async function GalleryPage() {
  const content = await getPageContent("gallery");
  const images = (content["gallery.images"] as GalleryItem[]).map((item) => ({ ...item, alt: "" }));

  return (
    <>
      <PageHero
        eyebrow={content["gallery.hero.eyebrow"] as string}
        title={content["gallery.hero.title"] as string}
        lede={content["gallery.hero.lede"] as string}
      />
      <section className="section">
        <div className="container">
          <GalleryGrid images={images} />
        </div>
      </section>
    </>
  );
}
