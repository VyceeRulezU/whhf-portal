import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/brand/logo.jpg";
import styles from "./donate-layout.module.css";

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className={styles.header}>
        <div className="container">
          <Link href="/" className={styles.logo} aria-label="William & Helen Heritage Foundation — home">
            <Image src={logo} alt="" width={40} height={40} className={styles.logoImage} />
            <span className={styles.logoText}>William &amp; Helen Heritage Foundation</span>
          </Link>
        </div>
      </header>
      <main className="section">
        <div className="container container--narrow">{children}</div>
      </main>
    </>
  );
}
