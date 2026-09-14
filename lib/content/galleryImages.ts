import { placeholderImages } from "./placeholderImages";
import { sitePhotos } from "./sitePhotos";

/**
 * Gallery placeholder photography — reuses the same vetted image set as
 * the rest of the marketing site (see placeholderImages.ts and
 * sitePhotos.ts) rather than introducing new, unverified sources. Swap for
 * real programme/event photography as WHHF supplies it.
 */
export interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

export const galleryImages: GalleryImage[] = [
  { src: sitePhotos.aboutUsMain, alt: "", caption: "WHHF programme activity" },
  { src: sitePhotos.storyMain, alt: "", caption: "Community engagement" },
  { src: sitePhotos.howWeWork, alt: "", caption: "Case review and outreach" },
  { src: sitePhotos.aboutUsFill, alt: "", caption: "Promoting godly values" },
  { src: placeholderImages.programmeFlagship, alt: "", caption: "Recovery and treatment support" },
  { src: placeholderImages.whoWeAre, alt: "", caption: "Faith and community" },
  { src: placeholderImages.impactHero, alt: "", caption: "Celebrating patients supported" },
  { src: sitePhotos.aboutUsThumb, alt: "", caption: "WHHF in the community" },
  { src: placeholderImages.aboutStory, alt: "", caption: "Remembering our founding story" },
  { src: placeholderImages.contactHero, alt: "", caption: "Reaching families in Abuja" }
];
