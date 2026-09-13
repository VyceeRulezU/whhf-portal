import { DonationForm } from "@/components/donate";
import { Card } from "@/components/ui/Card";
import styles from "./donate.module.css";

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
