import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import { sitePhotos } from "@/lib/content/sitePhotos";
import styles from "./leadership.module.css";

export const metadata: Metadata = {
  title: "Leadership",
  description: "The board and leadership behind the William & Helen Heritage Foundation."
};

const BOARD = [
  { name: "Engr. Titus Omolewa", role: "Vice Chairman" },
  { name: "Joy Okoye", role: "Programmes Manager" },
  { name: "Victor Okoye", role: "Board Member" },
  { name: "Emma Okoye", role: "Board Member" },
  { name: "Pauline Okoye", role: "Board Member", photo: sitePhotos.boardPauline },
  { name: "Sarah Okoye", role: "Board Member", photo: sitePhotos.boardSarah },
  { name: "Barr. Patrick Abah", role: "Legal Adviser" }
];

function initials(name: string): string {
  return name
    .split(" ")
    .filter((part) => /^[A-Z]/.test(part))
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Leadership"
        title="The people behind WHHF."
        lede="Publicly reported board membership, pending confirmation of the current full roster and bios."
      />
      <section className="section">
        <div className="container">
          {/* TODO: confirm this is the current full roster, and add bios/headshots for the
              rest — see PRD.md §10 item 2. Initials avatars are used deliberately in place
              of stock photography for members without a supplied photo — do not substitute
              generic stock headshots for named individuals; wait for real photos. */}
          <div className="grid-auto">
            {BOARD.map((member) =>
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
