import type { Metadata } from "next";
import { ArticleLayout } from "@/components/marketing/ArticleLayout";
import { sitePhotos } from "@/lib/content/sitePhotos";

export const metadata: Metadata = {
  title: "A Word of Faith",
  description: "A legacy rooted in faith and compassion: the conviction behind WHHF's work."
};

export default function FaithPage() {
  return (
    <ArticleLayout
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "A Word of Faith" }]}
      eyebrow="A Word of Faith"
      title="A legacy rooted in faith and compassion."
      image={sitePhotos.revWilliam}
    >
      {/* Reflection grounded in scripture and the established facts on
          /about — not presented as a direct/verbatim quote from Rev. Dr.
          William Okoye; see the memorial-content note in AGENTS.md before
          editing this attributed devotional writing. */}
      <p>
        &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under
        compulsion, for God loves a cheerful giver.&rdquo; (2 Corinthians 9:7)
      </p>
      <p>
        In loving memory of Rev. Dr. William Okoye, whose ministry, alongside Rev. (Mrs) Helen Titilayo Okoye,
        helped carry that spirit of cheerful, practical generosity through the All Christians Fellowship Mission
        for years.
      </p>
      <p>
        WHHF continues that same calling today: care for the sick, support for the struggling, and faith put into
        action rather than left as words alone. It is not a passive belief held quietly, it is a conviction that
        shows up in a paid chemotherapy bill, a hospital visit, a case reviewed carefully before any funds move.
      </p>
      <p>
        Generosity, understood this way, is not an obligation grudgingly met. It is offered cheerfully, because it
        reflects a character already at work in the giver, the same character this Foundation was built to carry
        forward, one life at a time.
      </p>
      <p>
        Every gift given to WHHF, however large or small, becomes part of that same continuing act of faith, a
        promise kept, again and again, to the people who need it most.
      </p>
    </ArticleLayout>
  );
}
