import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Accordion } from "@/components/ui/Accordion";
import { PartnerCarousel } from "@/components/marketing/PartnerCarousel";
import { ImpactCarousel } from "@/components/marketing/ImpactCarousel";
import { placeholderImages } from "@/lib/content/placeholderImages";
import { sitePhotos } from "@/lib/content/sitePhotos";
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

          <div className={styles.hero__media}>
            <div className={styles.hero__imageWrap}>
              <Image
                src={placeholderImages.homeHero}
                alt=""
                fill
                priority
                sizes="(max-width: 900px) 100vw, 1200px"
                className={styles.hero__image}
              />
            </div>
            <Card overlay className={styles.hero__stat}>
              <p className={styles.hero__statLabel}>In loving memory of</p>
              <p className={styles.hero__statValue}>Rev. Dr. William & Rev. (Mrs.) Helen Okoye</p>
              <p className={styles.hero__statCaption}>Whose generosity continues through WHHF</p>
            </Card>
          </div>
        </div>
      </section>

      <PartnerCarousel />

      <section className="section">
        <div className="container">
          <div className={styles.aboutUs__header}>
            <p className="eyebrow-label">/ Who We Are /</p>
            <h2>Driven by compassion, guided by faith.</h2>
          </div>
          <div className={styles.aboutUs__grid}>
            <div className={styles.aboutUs__imageWrap}>
              <Image
                src={placeholderImages.whoWeAre}
                alt="Placeholder — WHHF programme photography pending"
                fill
                sizes="(max-width: 900px) 100vw, 560px"
                className={styles.aboutUs__image}
              />
            </div>
            <div className={styles.aboutUs__content}>
              <div className={styles.aboutUs__statRow}>
                <Card className={styles.aboutUs__statCard}>
                  <p className={styles.aboutUs__statValue}>5+</p>
                  <p className={styles.aboutUs__statLabel}>Patients Supported</p>
                  <p className={styles.aboutUs__statCaption}>
                    Direct grants toward chemotherapy and treatment costs.
                  </p>
                </Card>
                <div className={styles.aboutUs__thumbWrap}>
                  <Image
                    src={sitePhotos.aboutUsThumb}
                    alt=""
                    fill
                    sizes="160px"
                    className={styles.aboutUs__thumbImage}
                  />
                </div>
              </div>
              <p className={styles.aboutUs__body}>
                WHHF was established in memory of Rev. (Mrs) Helen Titilayo
                Okoye, under the umbrella of the All Christians Fellowship
                Mission. What began as a single act of giving — support for
                indigent cancer patients — continues as an ongoing
                commitment to carry her generosity forward.
              </p>
              <Link href="/about">
                <Button variant="outline">Learn More</Button>
              </Link>
              <div className={styles.aboutUs__fillWrap}>
                <Image
                  src={sitePhotos.aboutUsFill}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 700px"
                  className={styles.aboutUs__fillImage}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--wide">
          <div className={styles.story}>
            <div className={styles.story__top}>
              <div className={styles.story__heading}>
                <p className="eyebrow-label">/ Our Story /</p>
                <h2>A loss that became a promise.</h2>
              </div>
              <div className={styles.story__intro}>
                <p className={styles.story__lede}>
                  Rev. (Mrs) Helen Titilayo Okoye passed away in 2019. WHHF
                  was established in her memory, under the umbrella of the
                  All Christians Fellowship Mission, to continue the
                  generosity she was known for — starting with support for
                  indigent cancer patients who cannot afford treatment.
                </p>
                <Link href="/about">
                  <Button variant="primary" showIconChip>
                    Read Our Full Story
                  </Button>
                </Link>
              </div>
            </div>

            <div className={styles.story__bottom}>
              <div className={styles.story__imageWrap}>
                <Image
                  src={sitePhotos.ourStory}
                  alt="Rev. (Mrs) Helen Titilayo Okoye"
                  fill
                  sizes="(max-width: 900px) 100vw, 1100px"
                  className={styles.story__image}
                />
              </div>
              <div className={styles.story__stats}>
                <Card className={styles.story__statCard}>
                  <p className={styles.story__statValue}>Faith-Led</p>
                  <p className={styles.story__statCaption}>
                    Rooted in the values Helen lived by.
                  </p>
                </Card>
                <Card className={styles.story__statCard}>
                  <p className={styles.story__statValue}>Direct to Patients</p>
                  <p className={styles.story__statCaption}>
                    Grants go straight to treatment costs, not overhead.
                  </p>
                </Card>
                <Card className={styles.story__statCard}>
                  <p className={styles.story__statValue}>Transparent</p>
                  <p className={styles.story__statCaption}>
                    Every donation accounted for and reported.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--wide">
          <div className={styles.howWeWork__header}>
            <p className="eyebrow-label">/ How We Work /</p>
            <h2>From reaching out to a life changed.</h2>
          </div>
          <div className={styles.howWeWork__grid}>
            <div className={styles.howWeWork__imageWrap}>
              <Image
                src={sitePhotos.howWeWork}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 500px"
                className={styles.howWeWork__image}
              />
            </div>
            <Card className={styles.howWeWork__stepCard}>
              <span className={styles.howWeWork__stepNumber}>01</span>
              <h3 className={styles.howWeWork__stepHeading}>Reach &amp; Referral</h3>
              <p className={styles.howWeWork__stepBody}>
                Patients and families reach us directly, or through our
                network within the All Christians Fellowship Mission
                community.
              </p>
            </Card>
            <Card className={styles.howWeWork__stepCard}>
              <span className={styles.howWeWork__stepNumber}>02</span>
              <h3 className={styles.howWeWork__stepHeading}>Board Verification</h3>
              <p className={styles.howWeWork__stepBody}>
                Every case is reviewed by the board before any funds move —
                confirming the medical need first.
              </p>
            </Card>
            <Card className={styles.howWeWork__stepCard}>
              <span className={styles.howWeWork__stepNumber}>03</span>
              <h3 className={styles.howWeWork__stepHeading}>Direct Grant</h3>
              <p className={styles.howWeWork__stepBody}>
                Approved grants are paid straight toward treatment costs,
                not through intermediaries.
              </p>
            </Card>
            <Card className={`${styles.howWeWork__stepCard} ${styles["howWeWork__stepCard--cta"]}`}>
              <h3 className={styles.howWeWork__stepHeading}>See it in action</h3>
              <p className={styles.howWeWork__stepBody}>
                Explore the programmes this process supports.
              </p>
              <Link href="/programmes" className={styles.howWeWork__ctaLink}>
                <Button variant="primary" showIconChip>
                  Our Programmes
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--wide">
          <div className={styles.programmes__header}>
            <div className={styles.programmes__headingGroup}>
              <p className="eyebrow-label">/ Get Involved /</p>
              <h2>Ways to support the work.</h2>
            </div>
            <p className={styles.programmes__intro}>
              From a direct gift to sharing our story, every form of support
              carries Helen&rsquo;s generosity a little further.
            </p>
          </div>
          <div className={styles.programmes__grid}>
            <Card className={styles.programmes__card}>
              <div className={styles.programmes__imageWrap}>
                <Image
                  src={placeholderImages.programmeFlagship}
                  alt="Placeholder — cancer patient support programme photography pending"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  className={styles.programmes__image}
                />
              </div>
              <Badge featured>Flagship Programme</Badge>
              <h3 className={styles.cardHeading}>Indigent Cancer Patient Support</h3>
              <p className={styles.cardBody}>
                Direct grants toward chemotherapy and treatment costs for
                patients who cannot afford care.
              </p>
              <Link href="/programmes" className={styles.programmes__cardLink}>
                Know More <span aria-hidden="true">→</span>
              </Link>
            </Card>
            <Card className={styles.programmes__card}>
              <div className={styles.programmes__imageWrap}>
                <Image
                  src={sitePhotos.ourStory}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  className={styles.programmes__image}
                />
              </div>
              <Badge>Our Story</Badge>
              <h3 className={styles.cardHeading}>Founded in Helen&rsquo;s Memory</h3>
              <p className={styles.cardBody}>
                Read how WHHF came to be, and the family behind it.
              </p>
              <Link href="/about" className={styles.programmes__cardLink}>
                Know More <span aria-hidden="true">→</span>
              </Link>
            </Card>
            <Card className={styles.programmes__card}>
              <div className={styles.programmes__imageWrap}>
                <Image
                  src={placeholderImages.impactHero}
                  alt="Placeholder — WHHF programme photography pending"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  className={styles.programmes__image}
                />
              </div>
              <Badge>Give</Badge>
              <h3 className={styles.cardHeading}>Make a Donation</h3>
              <p className={styles.cardBody}>
                Every gift goes directly toward treatment costs for patients
                who need it most.
              </p>
              <Link href="/donate" className={styles.programmes__cardLink}>
                Know More <span aria-hidden="true">→</span>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--wide">
          <div className={styles.impact__panel}>
            <Image
              src={sitePhotos.aboutUsThumb}
              alt=""
              fill
              sizes="1880px"
              className={styles.impact__panelImage}
            />
            <div className={styles.impact__panelScrim} />
            <div className={styles.impact__panelContent}>
              <div className={styles.impact__header}>
                <div className={styles.programmes__headingGroup}>
                  <p className="eyebrow-label">/ Our Impact /</p>
                  <h2>Where your support goes.</h2>
                </div>
                <p className={styles.programmes__intro}>
                  Four things carry every gift forward — browse through what
                  your support makes possible.
                </p>
              </div>
              <ImpactCarousel
                items={[
                  {
                    image: placeholderImages.programmeFlagship,
                    title: "Treatment & Recovery",
                    body: "Direct financial grants toward chemotherapy and treatment costs, distributed in partnership with National Hospital, Abuja. Every case is reviewed individually, so support reaches the patients who need it most, without unnecessary delay.",
                    href: "/programmes",
                    linkLabel: "Read More"
                  },
                  {
                    image: placeholderImages.whoWeAre,
                    title: "Faith & Community",
                    body: "Rooted in the All Christians Fellowship Mission, our work carries forward a legacy of compassion within the community Helen served — grounded in faith, and carried out in practical, everyday ways.",
                    href: "/about",
                    linkLabel: "Read More"
                  },
                  {
                    image: sitePhotos.howWeWork,
                    title: "Community Outreach",
                    body: "From hospital visits to community engagements, WHHF stays connected to the people it serves — because lasting support starts with genuinely knowing the families behind every case.",
                    href: "/impact",
                    linkLabel: "Read More"
                  },
                  {
                    image: placeholderImages.impactHero,
                    title: "Transparency & Accountability",
                    body: "Every donation is tracked and reported, so donors can see exactly how their generosity is put to work — no hidden fees, no unexplained gaps.",
                    href: "/donate",
                    linkLabel: "Read More"
                  }
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.faith__grid}>
            <div className={styles.faith__left}>
              <div className={styles.faith__eyebrow}>
                <span className={styles.faith__dot} aria-hidden="true" />
                <p className="eyebrow-label">/ A Word of Faith /</p>
              </div>
              <h2 className={styles.faith__heading}>
                A legacy rooted in <em>faith and compassion</em>.
              </h2>
              <div className={styles.faith__imageWrap}>
                <Image
                  src={sitePhotos.revWilliam}
                  alt="Rev. Dr. William Okoye"
                  fill
                  sizes="(max-width: 900px) 100vw, 460px"
                  className={styles.faith__image}
                />
              </div>
            </div>
            <div className={styles.faith__right}>
              {/* Reflection grounded in scripture and the established facts
                  on /about — not presented as a direct/verbatim quote from
                  Rev. Dr. William Okoye; see the memorial-content note in
                  AGENTS.md before adding attributed devotional writing. */}
              <p className={styles.faith__body}>
                &ldquo;Each of you should give what you have decided in your
                heart to give, not reluctantly or under compulsion, for God
                loves a cheerful giver.&rdquo; — 2 Corinthians 9:7
              </p>
              <p className={styles.faith__body}>
                In loving memory of Rev. Dr. William Okoye, whose ministry —
                alongside Rev. (Mrs) Helen Titilayo Okoye — helped carry that
                spirit of cheerful, practical generosity through the All
                Christians Fellowship Mission for years.
              </p>
              <p className={styles.faith__body}>
                WHHF continues that same calling today: care for the sick,
                support for the struggling, and faith put into action rather
                than left as words alone.
              </p>
              <Link href="/about">
                <Button variant="outline">Learn More About WHHF</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.faq__header}>
            <div className={styles.programmes__headingGroup}>
              <p className="eyebrow-label">/ FAQ /</p>
              <h2>Frequently asked questions.</h2>
            </div>
            <p className={styles.programmes__intro}>
              Straightforward answers about giving, our programmes, and how
              WHHF operates — no pressure, just what you need to know.
            </p>
          </div>
          <div className={styles.faq__grid}>
            <div className={styles.faq__side}>
              <h3 className={styles.faq__sideHeading}>
                Real answers. <em>No pressure.</em>
              </h3>
              <p className={styles.faq__sideBody}>
                We answer common questions about giving, our programmes, and
                how WHHF operates with full transparency, before you ever
                commit to anything.
              </p>
              <Link href="/donate">
                <Button variant="primary" showIconChip>
                  Donate Now
                </Button>
              </Link>
            </div>
            <Accordion
              items={[
                {
                  question: "How can I donate?",
                  answer:
                    "You can give directly through our Donate page using bank transfer or card payment. Every gift goes toward supporting indigent cancer patients."
                },
                {
                  question: "Where does my donation go?",
                  answer:
                    "Donations go directly toward chemotherapy and treatment costs for patients supported through our flagship programme, distributed in partnership with National Hospital, Abuja."
                },
                {
                  question: "Is WHHF a registered organization?",
                  answer:
                    "WHHF operates under the umbrella of the All Christians Fellowship Mission. Our formal registration details are being finalized and will be published here once confirmed."
                },
                {
                  question: "Can I volunteer or partner with WHHF?",
                  answer:
                    "Yes — reach out through our Contact page to discuss partnership or volunteering opportunities."
                },
                {
                  question: "Who founded WHHF?",
                  answer:
                    "WHHF was established in memory of Rev. (Mrs) Helen Titilayo Okoye, continuing the generosity she was known for during her lifetime."
                },
                {
                  question: "How do I get started?",
                  answer:
                    "Visit our Donate page to give directly, or use our Contact page to reach out with questions first."
                }
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.explore__header}>
            <div className={styles.programmes__headingGroup}>
              <p className="eyebrow-label">/ Read More /</p>
              <h2>Explore more from WHHF.</h2>
            </div>
          </div>
          <div className={styles.explore__grid}>
            <Link href="/about" className={styles.explore__card}>
              <div className={styles.explore__cardImageWrap}>
                <Image
                  src={sitePhotos.ourStory}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 360px"
                  className={styles.explore__cardImage}
                />
                <div className={styles.explore__cardScrim} />
                <div className={styles.explore__cardCaption}>
                  <p className={styles.explore__cardTitle}>Our Story</p>
                  <p className={styles.explore__cardLine}>How WHHF carries Helen&rsquo;s legacy forward.</p>
                </div>
              </div>
            </Link>
            <Link href="/programmes" className={styles.explore__card}>
              <div className={styles.explore__cardImageWrap}>
                <Image
                  src={placeholderImages.programmeFlagship}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 360px"
                  className={styles.explore__cardImage}
                />
                <div className={styles.explore__cardScrim} />
                <div className={styles.explore__cardCaption}>
                  <p className={styles.explore__cardTitle}>Our Programmes</p>
                  <p className={styles.explore__cardLine}>Direct support for indigent cancer patients.</p>
                </div>
              </div>
            </Link>
            <Link href="/impact" className={styles.explore__card}>
              <div className={styles.explore__cardImageWrap}>
                <Image
                  src={placeholderImages.impactHero}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 360px"
                  className={styles.explore__cardImage}
                />
                <div className={styles.explore__cardScrim} />
                <div className={styles.explore__cardCaption}>
                  <p className={styles.explore__cardTitle}>Our Impact</p>
                  <p className={styles.explore__cardLine}>See how your generosity reaches patients.</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--wide">
          <div className={styles.donateCta}>
            <Image
              src={sitePhotos.howWeWork}
              alt=""
              fill
              sizes="(max-width: 900px) 100vw, 1880px"
              className={styles.donateCta__image}
            />
            <div className={styles.donateCta__scrim} />
            <div className={styles.donateCta__content}>
              <h2 className={styles.donateCta__heading}>Your kindness can change a life.</h2>
              <p className={styles.donateCta__body}>
                Every gift goes directly toward WHHF&rsquo;s programmes,
                starting with support for indigent cancer patients.
              </p>
              <Link href="/donate">
                <Button variant="primary" showIconChip>
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
