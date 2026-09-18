"use client";

import { Children, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import styles from "./CardCarousel.module.css";

interface CardCarouselProps {
  children: ReactNode;
}

/**
 * Wraps a row of overview/stat cards. Desktop/tablet: unchanged `grid-auto`
 * layout. Mobile (see the breakpoint in CardCarousel.module.css): a
 * horizontal scroll-snap track, one card per view, with dot pagination
 * below the cards. Used on every admin page with a StatCard row (dashboard,
 * donations, email, newsletter) so the mobile behavior stays consistent —
 * see docs/production-readiness.md's sibling admin-UX pass for context.
 */
export function CardCarousel({ children }: CardCarouselProps) {
  const items = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries.reduce((best, entry) =>
          entry.intersectionRatio > (best?.intersectionRatio ?? 0) ? entry : best
        , entries[0]);
        if (mostVisible?.isIntersecting) {
          const index = cards.indexOf(mostVisible.target as HTMLElement);
          if (index !== -1) setActiveIndex(index);
        }
      },
      { root: track, threshold: 0.6 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [items.length]);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div className={styles.wrapper}>
      <div ref={trackRef} className={`${styles.track} scrollbar-hidden`}>
        {items.map((child, index) => (
          <div key={index} className={styles.item}>
            {child}
          </div>
        ))}
      </div>
      {items.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Overview cards">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Card ${index + 1} of ${items.length}`}
              className={`${styles.dot} ${index === activeIndex ? styles["dot--active"] : ""}`}
              onClick={() => scrollToIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
