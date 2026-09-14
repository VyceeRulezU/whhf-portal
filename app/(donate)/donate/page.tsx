import type { Metadata } from "next";
import { DonationForm } from "@/components/donate";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Donate",
  description: "Make a donation to the William & Helen Heritage Foundation — every gift goes directly toward supporting indigent cancer patients."
};

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="Donate"
        title="Make a donation."
        lede="Every gift goes directly toward WHHF's programmes, starting with support for indigent cancer patients."
      />
      <div className="section">
        <div className="container container--narrow">
          <Card>
            <DonationForm />
          </Card>
        </div>
      </div>
    </>
  );
}
