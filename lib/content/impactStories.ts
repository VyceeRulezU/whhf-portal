import { placeholderImages } from "./placeholderImages";
import { sitePhotos } from "./sitePhotos";

/**
 * Detail-page content for the four "Our Impact" carousel items on the
 * homepage (components/marketing/ImpactCarousel) — each card's "Read More"
 * links to /impact/{slug} using this data, rendered via ArticleLayout.
 */
export interface ImpactStory {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  body: string[];
}

export const impactStories: ImpactStory[] = [
  {
    slug: "treatment-and-recovery",
    title: "Treatment & Recovery",
    excerpt:
      "Direct financial grants toward chemotherapy and treatment costs, distributed in partnership with National Hospital, Abuja.",
    image: placeholderImages.programmeFlagship,
    body: [
      "Every case WHHF supports is reviewed individually before any funds move, so support reaches the patients who need it most, without unnecessary delay.",
      "Grants are paid directly toward treatment costs — chemotherapy, diagnostics, and the surrounding care a cancer diagnosis requires — in partnership with National Hospital, Abuja, where the Foundation's distributions have taken place.",
      "Recovery is rarely a single moment; it's a series of appointments, treatments, and check-ins over months. WHHF's role is to make sure a shortage of funds is never the reason that process stalls.",
      "This remains WHHF's flagship programme, and the one most directly tied to the Foundation's founding purpose: support for indigent cancer patients who cannot afford treatment on their own."
    ]
  },
  {
    slug: "faith-and-community",
    title: "Faith & Community",
    excerpt:
      "Rooted in the All Christians Fellowship Mission, our work carries forward a legacy of compassion within the community Helen served.",
    image: placeholderImages.whoWeAre,
    body: [
      "WHHF operates under the umbrella of the All Christians Fellowship Mission — the same community Rev. (Mrs) Helen Titilayo Okoye and Rev. Dr. William Okoye served for years.",
      "That grounding shapes how the Foundation treats every person it supports: with the same dignity and care any of us would want for our own family, not as a case number to process.",
      "Faith, here, is not separate from the practical work of paying for treatment — it's the reason the work is done this way at all. Compassion put into action, not left as words alone.",
      "As WHHF grows, this community remains its foundation — the people, the values, and the relationships that made the Foundation's work possible in the first place."
    ]
  },
  {
    slug: "community-outreach",
    title: "Community Outreach",
    excerpt:
      "From hospital visits to community engagements, WHHF stays connected to the people it serves.",
    image: sitePhotos.howWeWork,
    body: [
      "Support doesn't end at a grant payment. Staying connected to patients and their families — through hospital visits and community engagements — is part of how WHHF makes sure support actually lands where it's needed.",
      "Lasting support starts with genuinely knowing the families behind every case, not just the paperwork. That's part of why every case is reviewed individually rather than processed as a generic application.",
      "Community outreach also means staying visible and reachable within the wider network WHHF operates in, so families who need support know where to turn, and so the Foundation keeps learning what real help looks like on the ground.",
      "It's slower, more relational work than writing a single check — and it's exactly the kind of work WHHF was built to do."
    ]
  },
  {
    slug: "transparency-and-accountability",
    title: "Transparency & Accountability",
    excerpt: "Every donation is tracked and reported, so donors can see exactly how their generosity is put to work.",
    image: placeholderImages.impactHero,
    body: [
      "Every donation to WHHF is tracked from the moment it's received to the moment it's applied toward a patient's treatment — no hidden fees, no unexplained gaps.",
      "Every case supported is reviewed by the board before funds move, creating a built-in layer of oversight rather than relying on trust alone.",
      "As WHHF's admin systems mature, the goal is for donors to see increasingly detailed, real reporting on where their gifts went — not just a thank-you message, but a clear account of impact.",
      "Transparency isn't an added feature here; it's a condition of doing this work responsibly, especially when the funds involved are meant for people in genuinely urgent need."
    ]
  }
];

export function getImpactStory(slug: string): ImpactStory | undefined {
  return impactStories.find((story) => story.slug === slug);
}
