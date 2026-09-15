import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/marketing/PageHero";
import { FaqSection } from "@/components/marketing/FaqSection";
import { DonateCta } from "@/components/marketing/DonateCta";
import { placeholderImages } from "@/lib/content/placeholderImages";
import { sitePhotos } from "@/lib/content/sitePhotos";
import styles from "./programmes.module.css";

export const metadata: Metadata = {
  title: "Programmes",
  description:
    "Direct financial grants toward chemotherapy and treatment costs for indigent cancer patients, distributed in partnership with National Hospital, Abuja."
};

const STEPS = [
  {
    number: "01",
    heading: "Reach & Referral",
    body: "Patients and families reach us directly, or through our network within the All Christians Fellowship Mission community."
  },
  {
    number: "02",
    heading: "Board Verification",
    body: "Every case is reviewed by the board before any funds move — confirming the medical need first."
  },
  {
    number: "03",
    heading: "Direct Grant",
    body: "Approved grants are paid straight toward treatment costs, not through intermediaries."
  },
  {
    number: "04",
    heading: "Follow-Up",
    body: "WHHF stays in touch through recovery, rather than treating a grant as the end of the relationship."
  }
];

export default function ProgrammesPage() {
  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Where your gift goes."
        lede="WHHF's programme work starts with direct, practical support for indigent cancer patients — with more programmes to follow as they're confirmed."
      />

      <section className="section">
        <div className="container">
          <Card className={styles.flagshipCard}>
            <div className={styles.flagshipImageWrap}>
              <Image
                src={placeholderImages.programmeFlagship}
                alt="Placeholder — cancer patient support programme photography pending"
                fill
                sizes="(max-width: 900px) 100vw, 480px"
                className={styles.flagshipImage}
              />
            </div>
            <div className={styles.flagshipBody}>
              <Badge featured>Flagship Programme</Badge>
              <h2 className={styles.flagshipHeading}>Indigent Cancer Patient Support</h2>
              <p className={styles.flagshipText}>
                Direct financial grants toward chemotherapy and treatment costs for patients who cannot afford care,
                distributed in partnership with National Hospital, Abuja. Every case is reviewed individually before
                any funds move, so support reaches the patients who need it most, without unnecessary delay.
              </p>
              <p className={styles.flagshipText}>
                This remains WHHF&rsquo;s founding programme, and the clearest expression of the promise the
                Foundation was built to keep: give directly, give practically, and give to the people who need it
                most.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.stepsHeader}>
            <p className="eyebrow-label">/ How It Works /</p>
            <h2>From reaching out to a life changed.</h2>
          </div>
          <div className={styles.stepsGrid}>
            {STEPS.map((step) => (
              <Card key={step.number} className={styles.stepCard}>
                <span className={styles.stepNumber}>{step.number}</span>
                <h3 className={styles.stepHeading}>{step.heading}</h3>
                <p className={styles.stepBody}>{step.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.approachGrid}>
            <div className={styles.approachImageWrap}>
              <Image
                src={sitePhotos.howWeWork}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 520px"
                className={styles.approachImage}
              />
            </div>
            <div className="stack">
              <p className="eyebrow-label">/ Looking Ahead /</p>
              <h2>Depth first, then scale.</h2>
              <p className={styles.approachText}>
                WHHF chose to start narrow on purpose — one programme, one hospital partnership, reviewed case by
                case — rather than spread support thin across many causes before learning what real, effective help
                looks like.
              </p>
              <p className={styles.approachText}>
                As that foundation proves out, the same criteria will guide any programme WHHF adds next: direct
                impact over overhead, verified need over volume, and a hospital or community partnership grounded
                in real accountability.
              </p>
              {/* TODO: additional programmes pending confirmation — see PRD.md §10 item 6. Do not name specific future programmes here until confirmed. */}
            </div>
          </div>
        </div>
      </section>

      <FaqSection
        heading="Programme questions, answered."
        intro="How grants are approved, who qualifies, and how WHHF decides where support goes."
        sideHeading={
          <>
            Verified need. <em>Direct support.</em>
          </>
        }
        sideBody="Every question here traces back to the same principle: grants go straight to treatment costs, only after a case is genuinely reviewed."
        items={[
          {
            question: "How does a patient qualify for support?",
            answer:
              "Cases are reviewed by the WHHF board, alongside the medical professionals already treating the patient, to confirm genuine need before any funds move."
          },
          {
            question: "Where does the money actually go?",
            answer:
              "Directly toward chemotherapy and treatment costs at National Hospital, Abuja, for the flagship programme — not toward overhead or intermediaries."
          },
          {
            question: "How fast can a grant be paid?",
            answer:
              "As soon as a case is reviewed and confirmed. The review step exists to protect donors and patients alike, not to slow things down unnecessarily."
          },
          {
            question: "Will WHHF add more programmes?",
            answer:
              "Yes, over time — following the same standard: verified need, a real partner institution, and direct impact. Announcements will be published here once confirmed."
          },
          {
            question: "Can a hospital or organization refer a patient?",
            answer:
              "Yes — reach out through our Contact page to start that conversation."
          }
        ]}
      />

      <DonateCta image={placeholderImages.impactHero} />
    </>
  );
}
