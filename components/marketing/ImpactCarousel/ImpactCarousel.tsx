"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import styles from "./ImpactCarousel.module.css";

export interface ImpactCarouselItem {
  image: string;
  title: string;
  body: string;
  href: string;
  linkLabel: string;
}

interface ImpactCarouselProps {
  items: ImpactCarouselItem[];
}

export function ImpactCarousel({ items }: ImpactCarouselProps) {
  const [index, setIndex] = useState(0);
  const item = items[index];

  if (!item) return null;

  function goPrev() {
    setIndex((current) => (current - 1 + items.length) % items.length);
  }

  function goNext() {
    setIndex((current) => (current + 1) % items.length);
  }

  return (
    <div className={styles.carousel}>
      <Card overlay className={styles.carousel__card}>
        <div className={styles.carousel__imageWrap}>
          <Image src={item.image} alt="" fill sizes="(max-width: 900px) 100vw, 500px" className={styles.carousel__image} />
        </div>
        <div className={styles.carousel__content}>
          <p className={styles.carousel__count}>
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </p>
          <h3 className={styles.carousel__title}>{item.title}</h3>
          <p className={styles.carousel__body}>{item.body}</p>
          <Link href={item.href} className={styles.carousel__link}>
            {item.linkLabel} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Card>

      <div className={styles.carousel__controls}>
        <button type="button" className={styles.carousel__arrow} onClick={goPrev} aria-label="Previous">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 3.5L5.5 9L11 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className={styles.carousel__arrow} onClick={goNext} aria-label="Next">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M7 3.5L12.5 9L7 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
