import type { Metadata } from "next";
import { DonationForm } from "@/components/donate";
import { Card } from "@/components/ui/Card";
import styles from "./donate.module.css";

export const metadata: Metadata = {
  title: "Donate",
  description: "Make a donation to the William & Helen Heritage Foundation — every gift goes directly toward supporting indigent cancer patients."
};

export default function DonatePage() {
  return (
    <div className="stack">
      <h1>Make a donation</h1>
      <p className={styles.lede}>
        Every gift goes directly toward WHHF&rsquo;s programmes, starting
        with support for indigent cancer patients.
      </p>
      <Card>
        <DonationForm />
      </Card>
    </div>
  );
}
