import { DonationForm } from "@/components/donate";
import { Card } from "@/components/ui/Card";

export default function DonatePage() {
  return (
    <div className="stack">
      <h1>Make a donation</h1>
      <p style={{ color: "var(--color-text-secondary)" }}>
        Every gift goes directly toward WHHF&rsquo;s programmes, starting
        with support for indigent cancer patients.
      </p>
      <Card>
        <DonationForm />
      </Card>
    </div>
  );
}
