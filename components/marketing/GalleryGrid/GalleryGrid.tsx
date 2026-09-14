"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/lib/content/galleryImages";
import styles from "./GalleryGrid.module.css";

interface GalleryGridProps {
  images: GalleryImage[];
}

/**
 * Grid of clickable thumbnails that open a full-screen lightbox with
 * next/prev arrow navigation — see components/ui/AlertModal for the same
 * fixed-overlay + Escape-to-close pattern this mirrors.
 */
export function GalleryGrid({ images }: GalleryGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const goPrev = useCallback(() => {
    setOpenIndex((current) => (current === null ? null : (current - 1 + images.length) % images.length));
  }, [images.length]);
  const goNext = useCallback(() => {
    setOpenIndex((current) => (current === null ? null : (current + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (openIndex === null) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openIndex, close, goPrev, goNext]);

  const activeImage = openIndex !== null ? images[openIndex] : null;

  return (
    <>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <button
            key={image.src + index}
            type="button"
            className={styles.thumb}
            onClick={() => setOpenIndex(index)}
            aria-label={`Open photo: ${image.caption}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 300px"
              className={styles.thumbImage}
            />
          </button>
        ))}
      </div>

      {activeImage && (
        <div className={styles.overlay} role="presentation" onClick={close}>
          <button type="button" className={styles.closeButton} onClick={close} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <button
            type="button"
            className={`${styles.arrow} ${styles["arrow--prev"]}`}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Previous photo"
          >
            <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
              <path d="M11 3.5L5.5 9L11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div
            className={styles.lightboxContent}
            role="dialog"
            aria-modal="true"
            aria-label={activeImage.caption}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.imageWrap}>
              <Image src={activeImage.src} alt={activeImage.alt} fill sizes="90vw" className={styles.lightboxImage} />
            </div>
            <p className={styles.caption}>{activeImage.caption}</p>
            <p className={styles.count}>
              {String((openIndex ?? 0) + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </p>
          </div>

          <button
            type="button"
            className={`${styles.arrow} ${styles["arrow--next"]}`}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Next photo"
          >
            <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
              <path d="M7 3.5L12.5 9L7 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
