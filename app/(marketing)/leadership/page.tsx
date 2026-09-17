import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { getPageContent } from "@/lib/content/getPageContent";
import styles from "./leadership.module.css";

export const metadata: Metadata = {
  title: "Leadership",
  description: "The board and leadership behind the William & Helen Heritage Foundation."
};

// Page content (hero text, board roster) is now family-editable — see
// /admin/content/leadership and lib/content/registry.ts. This is
// deliberately a dynamic page (not statically generated) so an edit is
// live on the next request, no redeploy — see docs/production-readiness.md
// CMS section for why.
export const dynamic = "force-dynamic";

interface BoardMember {
  name: string;
  role: string;
  photo?: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter((part) => /^[A-Z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export default async function LeadershipPage() {
  const content = await getPageContent("leadership");
  const board = content["leadership.board"] as BoardMember[];

  return (
    <>
      <PageHero
        eyebrow={content["leadership.hero.eyebrow"] as string}
        title={content["leadership.hero.title"] as string}
        lede={content["leadership.hero.lede"] as string}
      />
      <section className="section">
        <div className="container">
          {/* Roster is family-editable (/admin/content/leadership), including
              photos. Initials avatars remain the fallback for any member
              without a supplied photo — do not substitute generic stock
              headshots for named individuals. */}
          <div className="grid-auto">
            {board.map((member) =>
              member.photo ? (
                <div key={member.name} className={styles.photoCard}>
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    sizes="(max-width: 900px) 100vw, 360px"
                    className={styles.photoCard__image}
                  />
                  <div className={styles.photoCard__scrim} />
                  <div className={styles.photoCard__caption}>
                    <p className={styles.photoCard__name}>{member.name}</p>
                    <p className={styles.photoCard__role}>{member.role}</p>
                  </div>
                </div>
              ) : (
                <Card key={member.name} className={styles.card}>
                  <span className={styles.avatar} aria-hidden="true">
                    {initials(member.name)}
                  </span>
                  <h3>{member.name}</h3>
                  <p className={styles.role}>{member.role}</p>
                </Card>
              )
            )}
          </div>
        </div>
      </section>
    </>
  );
}
