import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/marketing/PageHero";
import styles from "./leadership.module.css";

const BOARD = [
  { name: "Engr. Titus Omolewa", role: "Vice Chairman" },
  { name: "Joy Okoye", role: "Programmes Manager" },
  { name: "Victor Okoye", role: "Board Member" },
  { name: "Emma Okoye", role: "Board Member" },
  { name: "Pauline Okoye", role: "Board Member" },
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
          {/* TODO: confirm this is the current full roster, and add bios/headshots — see PRD.md §10 item 2.
              Initials avatars are used deliberately in place of stock photography — do not
              substitute generic stock headshots for named individuals; wait for real photos. */}
          <div className="grid-auto">
            {BOARD.map((member) => (
              <Card key={member.name} className={styles.card}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(member.name)}
                </span>
                <h3>{member.name}</h3>
                <p className={styles.role}>{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
