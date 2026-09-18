import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PartnerCarousel } from "@/components/marketing/PartnerCarousel";
import { ImpactCarousel } from "@/components/marketing/ImpactCarousel";
import { FaqSection } from "@/components/marketing/FaqSection";
import { DonateCta } from "@/components/marketing/DonateCta";
import { blogPosts } from "@/lib/content/blogPosts";
import { getPageContent } from "@/lib/content/getPageContent";
import styles from "./page.module.css";

interface ImpactItem {
  image: string;
  title: string;
  body: string;
}

interface ExploreItem {
  image: string;
  title: string;
  line: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

// Fixed order/hrefs — see the registry's "links are not editable" note on
// home.impact.items and home.explore.items.
const IMPACT_HREFS = [
  "/impact/treatment-and-recovery",
  "/impact/faith-and-community",
  "/impact/community-outreach",
  "/impact/transparency-and-accountability"
];
const EXPLORE_HREFS = ["/about", "/programmes", "/impact"];

export default async function HomePage() {
  const c = await getPageContent("home");
  const impactItems = c["home.impact.items"] as ImpactItem[];
  const exploreItems = c["home.explore.items"] as ExploreItem[];
  const faqItems = c["home.faq.items"] as FaqItem[];

  return (
    <>
      <section className={`${styles.hero} section`}>
        <div className="container container--wide">
          <div className={styles.hero__top}>
            <h1 className={styles.hero__heading}>{c["home.hero.heading"] as string}</h1>
            <div className={styles.hero__intro}>
              <p className={styles.hero__lede}>{c["home.hero.lede"] as string}</p>
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
                src={c["home.hero.image"] as string}
                alt=""
                fill
                priority
                sizes="(max-width: 900px) 100vw, 1200px"
                className={styles.hero__image}
              />
            </div>
            <Card overlay className={styles.hero__stat}>
              <p className={styles.hero__statLabel}>{c["home.hero.statLabel"] as string}</p>
              <p className={styles.hero__statValue}>{c["home.hero.statValue"] as string}</p>
              <p className={styles.hero__statCaption}>{c["home.hero.statCaption"] as string}</p>
            </Card>
          </div>
        </div>
      </section>

      <PartnerCarousel />

      <section className="section">
        <div className="container">
          <div className={styles.aboutUs__header}>
            <p className="eyebrow-label">/ {c["home.aboutUs.eyebrow"] as string} /</p>
            <h2>{c["home.aboutUs.heading"] as string}</h2>
          </div>
          <div className={styles.aboutUs__grid}>
            <div className={styles.aboutUs__imageWrap}>
              <Image
                src={c["home.aboutUs.image"] as string}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 560px"
                className={styles.aboutUs__image}
              />
            </div>
            <div className={styles.aboutUs__content}>
              <div className={styles.aboutUs__statRow}>
                <Card className={styles.aboutUs__statCard}>
                  <p className={styles.aboutUs__statValue}>{c["home.aboutUs.statValue"] as string}</p>
                  <p className={styles.aboutUs__statLabel}>{c["home.aboutUs.statLabel"] as string}</p>
                  <p className={styles.aboutUs__statCaption}>{c["home.aboutUs.statCaption"] as string}</p>
                </Card>
                <div className={styles.aboutUs__thumbWrap}>
                  <Image
                    src={c["home.aboutUs.thumbImage"] as string}
                    alt=""
                    fill
                    sizes="160px"
                    className={styles.aboutUs__thumbImage}
                  />
                </div>
              </div>
              <p className={styles.aboutUs__body}>{c["home.aboutUs.body"] as string}</p>
              <Link href="/about">
                <Button variant="outline">Learn More</Button>
              </Link>
              <div className={styles.aboutUs__fillWrap}>
                <Image
                  src={c["home.aboutUs.fillImage"] as string}
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
                <p className="eyebrow-label">/ {c["home.story.eyebrow"] as string} /</p>
                <h2>{c["home.story.heading"] as string}</h2>
              </div>
              <div className={styles.story__intro}>
                <p className={styles.story__lede}>{c["home.story.lede"] as string}</p>
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
                  src={c["home.story.image"] as string}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 700px"
                  className={styles.story__image}
                />
              </div>
              <div className={styles.story__stats}>
                <Card className={styles.story__statCard}>
                  <p className={styles.story__statValue}>{c["home.story.stat1Value"] as string}</p>
                  <p className={styles.story__statCaption}>{c["home.story.stat1Caption"] as string}</p>
                </Card>
                <Card className={styles.story__statCard}>
                  <p className={styles.story__statValue}>{c["home.story.stat2Value"] as string}</p>
                  <p className={styles.story__statCaption}>{c["home.story.stat2Caption"] as string}</p>
                </Card>
                <Card className={styles.story__statCard}>
                  <p className={styles.story__statValue}>{c["home.story.stat3Value"] as string}</p>
                  <p className={styles.story__statCaption}>{c["home.story.stat3Caption"] as string}</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--wide">
          <div className={styles.howWeWork__header}>
            <p className="eyebrow-label">/ {c["home.howWeWork.eyebrow"] as string} /</p>
            <h2>{c["home.howWeWork.heading"] as string}</h2>
          </div>
          <div className={styles.howWeWork__grid}>
            <div className={styles.howWeWork__imageWrap}>
              <Image
                src={c["home.howWeWork.image"] as string}
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 500px"
                className={styles.howWeWork__image}
              />
            </div>
            <Card className={styles.howWeWork__stepCard}>
              <span className={styles.howWeWork__stepNumber}>01</span>
              <h3 className={styles.howWeWork__stepHeading}>{c["home.howWeWork.step1Heading"] as string}</h3>
              <p className={styles.howWeWork__stepBody}>{c["home.howWeWork.step1Body"] as string}</p>
            </Card>
            <Card className={styles.howWeWork__stepCard}>
              <span className={styles.howWeWork__stepNumber}>02</span>
              <h3 className={styles.howWeWork__stepHeading}>{c["home.howWeWork.step2Heading"] as string}</h3>
              <p className={styles.howWeWork__stepBody}>{c["home.howWeWork.step2Body"] as string}</p>
            </Card>
            <Card className={styles.howWeWork__stepCard}>
              <span className={styles.howWeWork__stepNumber}>03</span>
              <h3 className={styles.howWeWork__stepHeading}>{c["home.howWeWork.step3Heading"] as string}</h3>
              <p className={styles.howWeWork__stepBody}>{c["home.howWeWork.step3Body"] as string}</p>
            </Card>
            <Card className={`${styles.howWeWork__stepCard} ${styles["howWeWork__stepCard--cta"]}`}>
              <h3 className={styles.howWeWork__stepHeading}>{c["home.howWeWork.ctaHeading"] as string}</h3>
              <p className={styles.howWeWork__stepBody}>{c["home.howWeWork.ctaBody"] as string}</p>
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
              <p className="eyebrow-label">/ {c["home.getInvolved.eyebrow"] as string} /</p>
              <h2>{c["home.getInvolved.heading"] as string}</h2>
            </div>
            <p className={styles.programmes__intro}>{c["home.getInvolved.intro"] as string}</p>
          </div>
          <div className={styles.programmes__grid}>
            <Card className={styles.programmes__card}>
              <div className={styles.programmes__imageWrap}>
                <Image
                  src={c["home.getInvolved.card1Image"] as string}
                  alt="Placeholder: cancer patient support programme photography pending"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  className={styles.programmes__image}
                />
              </div>
              <Badge featured>{c["home.getInvolved.card1Badge"] as string}</Badge>
              <h3 className={styles.cardHeading}>{c["home.getInvolved.card1Heading"] as string}</h3>
              <p className={styles.cardBody}>{c["home.getInvolved.card1Body"] as string}</p>
              <Link href="/programmes" className={styles.programmes__cardLink}>
                Know More <span aria-hidden="true">→</span>
              </Link>
            </Card>
            <Card className={styles.programmes__card}>
              <div className={styles.programmes__imageWrap}>
                <Image
                  src={c["home.getInvolved.card2Image"] as string}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  className={styles.programmes__image}
                />
              </div>
              <Badge>{c["home.getInvolved.card2Badge"] as string}</Badge>
              <h3 className={styles.cardHeading}>{c["home.getInvolved.card2Heading"] as string}</h3>
              <p className={styles.cardBody}>{c["home.getInvolved.card2Body"] as string}</p>
              <Link href="/about" className={styles.programmes__cardLink}>
                Know More <span aria-hidden="true">→</span>
              </Link>
            </Card>
            <Card className={styles.programmes__card}>
              <div className={styles.programmes__imageWrap}>
                <Image
                  src={c["home.getInvolved.card3Image"] as string}
                  alt="Placeholder: WHHF programme photography pending"
                  fill
                  sizes="(max-width: 900px) 100vw, 400px"
                  className={styles.programmes__image}
                />
              </div>
              <Badge>{c["home.getInvolved.card3Badge"] as string}</Badge>
              <h3 className={styles.cardHeading}>{c["home.getInvolved.card3Heading"] as string}</h3>
              <p className={styles.cardBody}>{c["home.getInvolved.card3Body"] as string}</p>
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
              src={c["home.impact.panelImage"] as string}
              alt=""
              fill
              sizes="1880px"
              className={styles.impact__panelImage}
            />
            <div className={styles.impact__panelScrim} />
            <div className={styles.impact__panelContent}>
              <div className={styles.impact__header}>
                <div className={styles.programmes__headingGroup}>
                  <p className="eyebrow-label">/ {c["home.impact.eyebrow"] as string} /</p>
                  <h2>{c["home.impact.heading"] as string}</h2>
                </div>
                <p className={styles.programmes__intro}>{c["home.impact.intro"] as string}</p>
              </div>
              <ImpactCarousel
                items={IMPACT_HREFS.map((href, index) => ({
                  ...(impactItems[index] ?? { image: "", title: "", body: "" }),
                  href,
                  linkLabel: "Read More"
                }))}
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
                  src={c["home.faith.image"] as string}
                  alt="Rev. Dr. William Okoye"
                  fill
                  sizes="(max-width: 900px) 100vw, 460px"
                  className={styles.faith__image}
                />
              </div>
            </div>
            <div className={styles.faith__right}>
              {/* This is memorial content — see /admin/content/home to
                  edit it; do not add/remove memorial content on your own
                  judgment, per AGENTS.md and docs/content-style-guide.md. */}
              <p className={styles.faith__body}>{c["home.faith.body1"] as string}</p>
              <p className={styles.faith__body}>{c["home.faith.body2"] as string}</p>
              <p className={styles.faith__body}>{c["home.faith.body3"] as string}</p>
              <Link href="/faith">
                <Button variant="outline">Learn More About WHHF</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.blogSection__header}>
            <div className={styles.programmes__headingGroup}>
              <p className="eyebrow-label">/ {c["home.blog.eyebrow"] as string} /</p>
              <h2>{c["home.blog.heading"] as string}</h2>
            </div>
            <Link href="/blog">
              <Button variant="outline">View All Posts</Button>
            </Link>
          </div>
          <div className={styles.blogSection__grid}>
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.blogSection__card}>
                <div className={styles.blogSection__cardImageWrap}>
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 360px"
                    className={styles.blogSection__cardImage}
                  />
                </div>
                <Badge>{post.category}</Badge>
                <h3 className={styles.cardHeading}>{post.title}</h3>
                <p className={styles.cardBody}>{post.excerpt}</p>
                <span className={styles.blogSection__cardLink}>
                  Read More <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FaqSection
        heading={c["home.faq.heading"] as string}
        intro={c["home.faq.intro"] as string}
        sideHeading={
          <>
            Real answers. <em>No pressure.</em>
          </>
        }
        sideBody={c["home.faq.sideBody"] as string}
        items={faqItems}
      />

      <section className="section">
        <div className="container">
          <div className={styles.explore__header}>
            <div className={styles.programmes__headingGroup}>
              <p className="eyebrow-label">/ Read More /</p>
              <h2>Explore more from WHHF.</h2>
            </div>
          </div>
          <div className={styles.explore__grid}>
            {EXPLORE_HREFS.map((href, index) => {
              const item = exploreItems[index] ?? { image: "", title: "", line: "" };
              return (
                <Link key={href} href={href} className={styles.explore__card}>
                  <div className={styles.explore__cardImageWrap}>
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 100vw, 360px"
                      className={styles.explore__cardImage}
                    />
                    <div className={styles.explore__cardScrim} />
                    <div className={styles.explore__cardCaption}>
                      <p className={styles.explore__cardTitle}>{item.title}</p>
                      <p className={styles.explore__cardLine}>{item.line}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <DonateCta
        images={[c["home.donateCta.image1"] as string, c["home.donateCta.image2"] as string]}
        imagePosition="center top"
      />
    </>
  );
}
