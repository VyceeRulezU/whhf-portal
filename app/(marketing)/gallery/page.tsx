import type { Metadata } from "next";
import { PageHero } from "@/components/marketing/PageHero";
import { GalleryGrid } from "@/components/marketing/GalleryGrid";
import { galleryImages } from "@/lib/content/galleryImages";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from WHHF's programmes, outreach, and the community behind the work."
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments from the work."
        lede="A look at WHHF's programmes and the community carrying them forward. Click any photo to view it full-size."
      />
      <section className="section">
        <div className="container">
          <GalleryGrid images={galleryImages} />
        </div>
      </section>
    </>
  );
}
