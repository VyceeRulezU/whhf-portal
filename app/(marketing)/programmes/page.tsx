import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/marketing/PageHero";
import { placeholderImages } from "@/lib/content/placeholderImages";
import styles from "./programmes.module.css";

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
          <div className="grid-auto">
            <Card>
              <div className={styles.imageWrap}>
                <Image
                  src={placeholderImages.programmeFlagship}
                  alt="Placeholder — cancer patient support programme photography pending"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  className={styles.image}
                />
              </div>
              <Badge featured>Flagship</Badge>
              <h3 className={styles.cardHeading}>Indigent Cancer Patient Support</h3>
              <p className={styles.cardBody}>
                Direct financial grants toward chemotherapy and treatment
                costs for patients who cannot afford care, distributed in
                partnership with National Hospital, Abuja.
              </p>
            </Card>
            {/* TODO: additional programmes pending confirmation — see PRD.md §10 item 6 */}
          </div>
        </div>
      </section>
    </>
  );
}
