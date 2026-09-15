import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import styles from "./DonateCta.module.css";

interface DonateCtaProps {
  image: string;
  /** CSS object-position for the image — this banner crops to a very
      wide, short box, so the right value depends heavily on where the
      subject sits in that specific photo (a tall portrait needs a
      different offset than a wide group shot). Defaults to "center". */
  imagePosition?: string;
  heading?: string;
  body?: string;
  buttonLabel?: string;
  href?: string;
}

/** Full-bleed photo CTA with a dark scrim — originally the homepage's
    closing donate banner, now reused across marketing pages. */
export function DonateCta({
  image,
  imagePosition = "center",
  heading = "Your kindness can change a life.",
  body = "Every gift goes directly toward WHHF’s programmes, starting with support for indigent cancer patients.",
  buttonLabel = "Donate Now",
  href = "/donate"
}: DonateCtaProps) {
  return (
    <section className="section">
      <div className="container container--wide">
        <div className={styles.cta}>
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 900px) 100vw, 1880px"
            className={styles.image}
            style={{ objectPosition: imagePosition }}
          />
          <div className={styles.scrim} />
          <div className={styles.content}>
            <h2 className={styles.heading}>{heading}</h2>
            <p className={styles.body}>{body}</p>
            <Link href={href}>
              <Button variant="primary" showIconChip>
                {buttonLabel}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
