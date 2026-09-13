import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { placeholderImages } from "@/lib/content/placeholderImages";
import styles from "./impact.module.css";

export default function ImpactPage() {
  return (
    <>
      <PageHero
        eyebrow="Impact"
        title="What your generosity has made possible."
        lede="Confirmed figures below — updated as new distributions are made and admin reporting comes online."
      />
      <section className="section">
        <div className="container stack">
          <div className={styles.imageWrap}>
            <Image
              src={placeholderImages.impactHero}
              alt="Placeholder — WHHF programme photography pending"
              fill
              sizes="100vw"
              className={styles.image}
            />
          </div>
          <div className="grid-auto">
            <Card>
              <h3>₦1.5M+</h3>
              <p className={styles.description}>
                Distributed to five indigent cancer patients at National
                Hospital, Abuja, on the 4th memorial anniversary of Rev. (Mrs)
                Helen Okoye.
              </p>
            </Card>
            <Card>
              <h3>5</h3>
              <p className={styles.description}>Patients directly supported in this distribution.</p>
            </Card>
            {/* TODO: pull real cumulative totals from the admin/donation data once live — do not hardcode further placeholder figures. */}
          </div>
        </div>
      </section>
    </>
  );
}
