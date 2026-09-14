import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { placeholderImages } from "@/lib/content/placeholderImages";
import logo from "@/assets/brand/logo-transparent.png";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <Image src={placeholderImages.homeHero} alt="" fill sizes="100vw" className={styles.bgImage} />
      <div className={styles.scrim} />
      <div className={styles.content}>
        <Image src={logo} alt="William & Helen Heritage Foundation" width={80} height={80} className={styles.logo} />
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>This page doesn&rsquo;t exist.</h1>
        <p className={styles.body}>
          The page you&rsquo;re looking for may have moved or never existed. Let&rsquo;s get you back on track.
        </p>
        <div className="cluster">
          <Link href="/">
            <Button variant="primary" showIconChip>
              Back to homepage
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Contact us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
