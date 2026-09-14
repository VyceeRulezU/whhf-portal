/**
 * TEMPORARY placeholder photography standing in for real WHHF programme/
 * beneficiary photos — see design-system.md ("Imagery"): prefer
 * documentary-style photos of actual WHHF activity once available, and
 * clearly label placeholders until then.
 *
 * All free-licensed (Unsplash License, not Unsplash+), chosen to be
 * topically relevant rather than generic — deliberately avoiding staged
 * "charity stock photo" close-ups or anything exploiting a child's
 * medical situation for a placeholder. Swap each entry for a real photo
 * and this file can go away.
 */
export const placeholderImages = {
  // Hosted on WHHF's own Cloudflare R2 bucket — set by the site owner directly.
  homeHero: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/2151565852.jpg",
  // Community education/charity event, Port Harcourt, Nigeria.
  whoWeAre: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?w=900&q=80&fm=jpg&fit=crop",
  // Family moment during recovery from cancer surgery — resilience, not suffering.
  programmeFlagship: "https://images.unsplash.com/photo-1578496781307-30c2b531c05a?w=900&q=80&fm=jpg&fit=crop",
  // Single candle — symbolic of memory/legacy, deliberately not a staged "memorial" scene.
  aboutStory: "https://images.unsplash.com/photo-1561212856-44e9bae482aa?w=1200&q=80&fm=jpg&fit=crop",
  // Children, warm and smiling — impact/celebration context.
  impactHero: "https://images.unsplash.com/photo-1543689604-6fe8dbcd1f59?w=1200&q=80&fm=jpg&fit=crop",
  // Two generations of women, Abuja — same city WHHF is based in.
  contactHero: "https://images.unsplash.com/photo-1761370981139-c1fe5402c709?w=1200&q=80&fm=jpg&fit=crop"
} as const;
