import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { InterestForm } from "@/components/marketing/InterestForm";
import { getPageContent } from "@/lib/content/getPageContent";
import styles from "./interest.module.css";

export const metadata: Metadata = {
  title: "Get Involved",
  description:
    "Tell the William & Helen Heritage Foundation you're interested in getting involved: volunteering, partnering, or supporting the work."
};

export default async function InterestPage() {
  const content = await getPageContent("interest");

  return (
    <>
      <PageHero
        eyebrow={content["interest.hero.eyebrow"] as string}
        title={content["interest.hero.title"] as string}
        lede={content["interest.hero.lede"] as string}
      />
      <div className="section">
        <div className="container container--narrow">
          <Card>
            <h2 className={styles.formHeading}>{content["interest.form.heading"] as string}</h2>
            <InterestForm />
          </Card>
        </div>
      </div>
    </>
  );
}
