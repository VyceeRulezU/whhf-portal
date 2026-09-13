import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { placeholderImages } from "@/lib/content/placeholderImages";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <>
      <section className={`${styles.hero} section`}>
        <div className="container container--wide">
          <div className={styles.hero__top}>
            <h1 className={styles.hero__heading}>
              Continuing a legacy of giving, one life at a time.
            </h1>
            <div className={styles.hero__intro}>
              <p className={styles.hero__lede}>
                The William &amp; Helen Heritage Foundation supports indigent
                cancer patients in Abuja and beyond — carrying forward the
                generosity of Rev. (Mrs) Helen Titilayo Okoye.
              </p>
              <div className="cluster">
                <Link href="/donate">
                  <Button variant="primary" showIconChip>
                    Donate Now
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline">Our Story</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.hero__imageWrap}>
            <Image
              src={placeholderImages.homeHero}
              alt="Placeholder — WHHF programme photography pending"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 1200px"
              className={styles.hero__image}
            />
            <Card overlay className={styles.hero__stat}>
              <p className={styles.hero__statLabel}>Distributed to date</p>
              <p className={styles.hero__statValue}>₦1.5M+</p>
              <p className={styles.hero__statCaption}>
                To indigent cancer patients, National Hospital, Abuja
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className={`${styles.affiliation} section--tight`}>
        <div className={`container ${styles.affiliation__row}`}>
          <Badge>Under the umbrella of All Christians Fellowship Mission (ACFM)</Badge>
          <Badge>Programme partner: National Hospital, Abuja</Badge>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.whoWeAre}`}>
          <div className={styles.whoWeAre__imageWrap}>
            <Image
              src={placeholderImages.whoWeAre}
              alt="Placeholder — WHHF programme photography pending"
              fill
              sizes="(max-width: 900px) 100vw, 560px"
              className={styles.whoWeAre__image}
            />
            <div className={styles.whoWeAre__badges}>
              <Badge featured>Transparent</Badge>
              <Badge>Faith-Led</Badge>
              <Badge>Direct to Patients</Badge>
              <Badge>Community-Rooted</Badge>
            </div>
          </div>
          <div className={styles.whoWeAre__content}>
            <p className="eyebrow-label">Who We Are</p>
            <h2>Driven by compassion, guided by faith.</h2>
            <p className={styles.whoWeAre__body}>
              WHHF was established in memory of Rev. (Mrs) Helen Titilayo
              Okoye, under the umbrella of the All Christians Fellowship
              Mission. What began as a single act of giving — support for
              indigent cancer patients — continues as an ongoing commitment
              to carry her generosity forward.
            </p>
            <div className="cluster">
              <Link href="/about">
                <Button variant="outline">Learn More</Button>
              </Link>
              <Link href="/leadership">
                <Button variant="ghost">Meet the Board →</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <h2>Our Programmes</h2>
          <div className="grid-auto">
            <Card>
              <div className={styles.programmeImageWrap}>
                <Image
                  src={placeholderImages.programmeFlagship}
                  alt="Placeholder — cancer patient support programme photography pending"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  className={styles.programmeImage}
                />
              </div>
              <Badge featured>Flagship Programme</Badge>
              <h3 className={styles.cardHeading}>Indigent Cancer Patient Support</h3>
              <p className={styles.cardBody}>
                Direct grants toward chemotherapy and treatment costs for
                patients who cannot afford care.
              </p>
              <div className={styles.cardAction}>
                <Link href="/programmes">
                  <Button variant="ghost">See how it works →</Button>
                </Link>
              </div>
            </Card>
            <Card>
              <Badge>Our Story</Badge>
              <h3 className={styles.cardHeading}>Founded in Helen&rsquo;s memory</h3>
              <p className={styles.cardBody}>
                Read how WHHF came to be, and the family behind it.
              </p>
              <div className={styles.cardAction}>
                <Link href="/about">
                  <Button variant="ghost">Read our story →</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`container ${styles.cta__inner}`}>
          <h2 className={styles.cta__heading}>Help continue the legacy.</h2>
          <p className={styles.cta__body}>
            Every gift goes directly toward WHHF&rsquo;s programmes, starting
            with support for indigent cancer patients.
          </p>
          <Link href="/donate">
            <Button variant="primary" showIconChip>
              Donate Now
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
