import Image from "next/image";
import styles from "./CoreValuesTimeline.module.css";

// WHHF's eight core values, from the Foundation's own printed materials —
// the highlighted letters spell out "GIVE HELP". letter/rest are a fixed
// acrostic and stay code-defined; only each `sentence` is family-editable
// (see lib/content/registry.ts's "about.coreValues.*" keys and
// /admin/content/about) — deliberately NOT a generic addable/reorderable
// list field, since deleting or reordering one of these would break the
// acrostic.
const CORE_VALUES = [
  { letter: "G", rest: "odliness" },
  { letter: "I", rest: "ntegrity" },
  { letter: "V", rest: "eracity" },
  { letter: "E", rest: "xcellence" },
  { letter: "H", rest: "umility" },
  { letter: "E", rest: "arnestness" },
  { letter: "L", rest: "ove" },
  { letter: "P", rest: "eace" }
];

interface CoreValuesTimelineProps {
  image: string;
  /** One sentence per CORE_VALUES entry above, same fixed order. */
  sentences: string[];
}

/** Full-bleed photo panel (blurred + dark overlay, same radius/elevation
    as the site's other wide banners — see DonateCta) with WHHF's eight
    core values laid out as an alternating vertical timeline. */
export function CoreValuesTimeline({ image, sentences }: CoreValuesTimelineProps) {
  return (
    <section className="section">
      <div className="container container--wide">
        <div className={styles.panel}>
          <Image src={image} alt="" fill sizes="(max-width: 900px) 100vw, 1880px" className={styles.bgImage} />
          <div className={styles.scrim} />

          <div className={styles.content}>
            <div className={styles.header}>
              <p className="eyebrow-label">/ Core Values /</p>
              <h2 className={styles.heading}>
                We <span className={styles.giveHelp}>give help</span>.
              </h2>
            </div>

            <div className={styles.timeline}>
              <div className={styles.timelineLine} aria-hidden="true" />
              {CORE_VALUES.map((value, index) => (
                <div
                  key={`${value.letter}-${value.rest}`}
                  className={`${styles.row} ${index % 2 === 0 ? styles["row--left"] : styles["row--right"]}`}
                >
                  <div className={styles.card}>
                    <p className={styles.cardTitle}>
                      <span className={styles.cardLetter}>{value.letter}</span>
                      {value.rest}
                    </p>
                    <p className={styles.cardBody}>{sentences[index]}</p>
                  </div>
                  <span className={styles.node} aria-hidden="true" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
