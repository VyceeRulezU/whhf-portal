import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import logo from "@/assets/brand/logo-transparent.png";
import styles from "./ArticleLayout.module.css";
import type { ReactNode } from "react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface SidebarLink {
  label: string;
  href: string;
}

const DEFAULT_SIDEBAR_LINKS: SidebarLink[] = [
  { href: "/about", label: "Our Story" },
  { href: "/programmes", label: "Programmes" },
  { href: "/impact", label: "Impact" },
  { href: "/blog", label: "Blog" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" }
];

interface ArticleLayoutProps {
  breadcrumbs: Breadcrumb[];
  eyebrow?: string;
  title: string;
  meta?: string;
  image: string;
  children: ReactNode;
  sidebarLinks?: SidebarLink[];
}

/**
 * Shared article/blog-post shell for /blog/[slug], /impact/[slug], and
 * /faith — breadcrumbs + prose column + a right-hand sidebar that floats
 * (position: sticky) alongside the content on desktop/tablet and stacks
 * below it on mobile. Lives under app/(marketing)/ so it inherits
 * SiteHeader/SiteFooter from that route group's layout — no need to
 * render either here.
 */
export function ArticleLayout({
  breadcrumbs,
  eyebrow,
  title,
  meta,
  image,
  children,
  sidebarLinks = DEFAULT_SIDEBAR_LINKS
}: ArticleLayoutProps) {
  return (
    <article className={styles.article}>
      <div className={`container ${styles.breadcrumbRow}`}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <ol className={styles.breadcrumbList}>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.label} className={styles.breadcrumbItem}>
                {crumb.href ? (
                  <Link href={crumb.href} className={styles.breadcrumbLink}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className={styles.breadcrumbCurrent}>
                    {crumb.label}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className={styles.breadcrumbSeparator} aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className={`container ${styles.header}`}>
        {eyebrow && <p className={`eyebrow-label ${styles.eyebrow}`}>{eyebrow}</p>}
        <h1 className={styles.title}>{title}</h1>
        {meta && <p className={styles.meta}>{meta}</p>}
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.main}>
          <div className={styles.imageWrap}>
            <Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 760px" className={styles.image} />
          </div>
          <div className={styles.body}>{children}</div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarSticky}>
            <Card className={styles.donateCard}>
              <div className={styles.donateCardLogo}>
                <Image src={logo} alt="William & Helen Heritage Foundation" width={64} height={64} />
              </div>
              <p className={styles.donateCardHeading}>Support Our Mission</p>
              <p className={styles.donateCardBody}>
                Every gift goes directly toward treatment costs for patients who need it most.
              </p>
              <Link href="/donate" className={styles.donateCardLink}>
                <Button variant="primary" showIconChip className={styles.donateCardButton}>
                  Donate Now
                </Button>
              </Link>
            </Card>

            <Card className={styles.linksCard}>
              <p className={styles.linksHeading}>Important Links</p>
              <ul className={styles.linksList}>
                {sidebarLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={styles.linksLink}>
                      {link.label} <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </aside>
      </div>
    </article>
  );
}
