/**
 * Real WHHF photography, supplied by the site owner and hosted on WHHF's
 * own Cloudflare R2 bucket — unlike lib/content/placeholderImages.ts, these
 * are not stand-ins; swap only when the owner supplies a replacement.
 */
export const sitePhotos = {
  // "Our Story" section — Rev. (Mrs) Helen Titilayo Okoye.
  ourStory: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/mummy-Helen-Okoye-1.jpg",
  // "How We Work" section.
  howWeWork: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/649531155_17984201615874766_6774910805288153881_n.webp",
  // "Who We Are" section — full-width photo beneath the stat row.
  aboutUsFill: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/627673414_18361507168160333_4291544863867280766_n.jpg",
  // "Who We Are" section — small secondary thumbnail beside the stat card.
  aboutUsThumb: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/2151940449.jpg",
  // "A Word of Faith" section.
  revWilliam: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/rev%20dr%20william%20okoye.jpg"
} as const;
