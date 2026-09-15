"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import styles from "./DonateCta.module.css";

interface DonateCtaProps {
  /** A single static background photo. Ignored if `images` is also given. */
  image?: string;
  /** Two or more photos to randomly crossfade between behind the CTA,
      instead of one static image — see the homepage's usage. With
      exactly two, it just alternates (the only sensible "random" choice
      that still reads as a change every time). */
  images?: string[];
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

const ROTATION_INTERVAL_MS = 6000;

/** Full-bleed photo CTA with a dark scrim — originally the homepage's
    closing donate banner, now reused across marketing pages. */
export function DonateCta({
  image,
  images,
  imagePosition = "center",
  heading = "Your kindness can change a life.",
  body = "Every gift goes directly toward WHHF’s programmes, starting with support for indigent cancer patients.",
  buttonLabel = "Donate Now",
  href = "/donate"
}: DonateCtaProps) {
  const gallery = images && images.length > 0 ? images : image ? [image] : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (gallery.length < 2) return;
    const id = setInterval(() => {
      setIndex((current) => {
        if (gallery.length === 2) return current === 0 ? 1 : 0;
        let next = Math.floor(Math.random() * gallery.length);
        while (next === current) next = Math.floor(Math.random() * gallery.length);
        return next;
      });
    }, ROTATION_INTERVAL_MS);
    return () => clearInterval(id);
  }, [gallery.length]);

  const currentImage = gallery[index];

  return (
    <section className="section">
      <div className="container container--wide">
        <div className={styles.cta}>
          <AnimatePresence>
            {currentImage && (
              <motion.div
                key={currentImage}
                className={styles.imageLayer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
              >
                <Image
                  src={currentImage}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 1880px"
                  className={styles.image}
                  style={{ objectPosition: imagePosition }}
                  priority={index === 0}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
