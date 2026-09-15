import Image from "next/image";
import styles from "./CoreValuesTimeline.module.css";

// WHHF's eight core values, from the Foundation's own printed materials —
// the highlighted letters spell out "GIVE HELP". The one-line description
// under each is editorial copy (not a sourced fact from that document).
const CORE_VALUES = [
  {
    letter: "G",
    rest: "odliness",
    sentence: "We anchor every decision in reverence for God and the character He calls us to reflect."
  },
  {
    letter: "I",
    rest: "ntegrity",
    sentence: "We do what we say, matching our public commitments to how every gift is actually used."
  },
  {
    letter: "V",
    rest: "eracity",
    sentence: "We speak and report plainly and truthfully, even when it would be easier not to."
  },
  {
    letter: "E",
    rest: "xcellence",
    sentence: "We hold our work to a high standard, because the people we serve deserve nothing less."
  },
  {
    letter: "H",
    rest: "umility",
    sentence: "We serve quietly, without needing recognition for the good that gets done."
  },
  {
    letter: "E",
    rest: "arnestness",
    sentence: "We show up wholehearted and consistent, not just when it's convenient."
  },
  {
    letter: "L",
    rest: "ove",
    sentence: "We treat every person we serve with genuine compassion, not obligation."
  },
  {
    letter: "P",
    rest: "eace",
    sentence: "We pursue reconciliation and calm in how we work with patients, partners, and each other."
  }
];

interface CoreValuesTimelineProps {
  image: string;
}

/** Full-bleed photo panel (blurred + dark overlay, same radius/elevation
    as the site's other wide banners — see DonateCta) with WHHF's eight
    core values laid out as an alternating vertical timeline. */
export function CoreValuesTimeline({ image }: CoreValuesTimelineProps) {
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
                    <p className={styles.cardBody}>{value.sentence}</p>
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
