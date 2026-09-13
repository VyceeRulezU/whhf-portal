import Link from "next/link";
import { Button } from "@/components/ui/Button";
import styles from "./thank-you.module.css";

export default function ThankYouPage() {
  return (
    <div className="stack">
      <h1>Thank you for your gift.</h1>
      <p className={styles.message}>
        Your donation is confirmed, and a receipt is on its way to your
        email. Your generosity carries forward Rev. (Mrs) Helen
        Okoye&rsquo;s legacy of giving.
      </p>
      <Link href="/">
        <Button variant="outline">Back to the homepage</Button>
      </Link>
    </div>
  );
}
