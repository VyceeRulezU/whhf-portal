/**
 * The single source of truth for what's family-editable across the site:
 * every page's editable fields, in the same order they render on the live
 * page (this order also drives the admin editor's layout — one array, two
 * uses). Every `default` is copied verbatim from what was hardcoded on
 * that page before it was wired up here, so a page renders identically
 * whether or not a DB row exists yet for any given field — see
 * lib/content/getPageContent.ts. See docs/production-readiness.md's CMS
 * section for the full design rationale (why one generic table+registry
 * instead of a table per content type).
 *
 * Deliberately excluded from this registry: Privacy/Terms pages (legal
 * text pending lawyer review) and site navigation links (a broken href
 * from a non-technical edit would break sitewide navigation) — per direct
 * confirmation, not an oversight.
 */

export interface TextFieldDef {
  type: "text";
  key: string;
  label: string;
  default: string;
  multiline?: boolean;
}

export interface ImageFieldDef {
  type: "image";
  key: string;
  label: string;
  default: string;
}

export interface ListFieldDef {
  type: "list";
  key: string;
  label: string;
  itemFields: (TextFieldDef | ImageFieldDef)[];
  default: Record<string, string>[];
}

export type FieldDef = TextFieldDef | ImageFieldDef | ListFieldDef;

export interface PageManifest {
  slug: string;
  label: string;
  sections: FieldDef[];
}

/**
 * Grows page by page as each is migrated (see docs/production-readiness.md
 * CMS rollout phases) — starts empty/skeleton, not all pages at once.
 */
export const contentRegistry: PageManifest[] = [
  {
    slug: "leadership",
    label: "Leadership",
    sections: [
      { type: "text", key: "leadership.hero.eyebrow", label: "Hero eyebrow", default: "Leadership" },
      { type: "text", key: "leadership.hero.title", label: "Hero title", default: "The people behind WHHF." },
      {
        type: "text",
        key: "leadership.hero.lede",
        label: "Hero subtitle",
        default: "Publicly reported board membership, pending confirmation of the current full roster and bios.",
        multiline: true
      },
      {
        type: "list",
        key: "leadership.board",
        label: "Board members",
        itemFields: [
          { type: "text", key: "name", label: "Name", default: "" },
          { type: "text", key: "role", label: "Role", default: "" },
          { type: "image", key: "photo", label: "Photo (optional — shows initials if left blank)", default: "" }
        ],
        default: [
          { name: "Engr. Titus Omolewa", role: "Vice Chairman", photo: "" },
          { name: "Joy Okoye", role: "Programmes Manager", photo: "" },
          { name: "Victor Okoye", role: "Board Member", photo: "" },
          { name: "Emma Okoye", role: "Board Member", photo: "" },
          {
            name: "Pauline Okoye",
            role: "Board Member",
            photo: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/paulineO.jpeg"
          },
          {
            name: "Sarah Okoye",
            role: "Board Member",
            photo: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/SarahO.jpeg"
          },
          { name: "Barr. Patrick Abah", role: "Legal Adviser", photo: "" }
        ]
      }
    ]
  },
  {
    slug: "contact",
    label: "Contact",
    sections: [
      { type: "text", key: "contact.hero.eyebrow", label: "Hero eyebrow", default: "Contact" },
      { type: "text", key: "contact.hero.title", label: "Hero title", default: "Get in touch." },
      {
        type: "text",
        key: "contact.hero.lede",
        label: "Hero subtitle",
        default: "Reach out about partnerships, volunteering, or general enquiries.",
        multiline: true
      },
      {
        // Also read directly by components/marketing/SiteFooter (via
        // getFieldValue, not this page's manifest) so the footer's contact
        // info can never drift out of sync with this page's — see
        // docs/production-readiness.md's CMS section.
        type: "list",
        key: "contact.rows",
        label: "Contact details",
        itemFields: [
          { type: "text", key: "label", label: "Label", default: "" },
          { type: "text", key: "value", label: "Value", default: "" }
        ],
        default: [
          {
            label: "Office address",
            value: "3FVM+H9M, Along Nile Street, Maitama, Abuja 904101, Federal Capital Territory"
          },
          { label: "Phone", value: "0806 432 0084" },
          { label: "Email", value: "contact@whheritagefoundation.org" }
        ]
      }
    ]
  },
  {
    slug: "about",
    label: "Our Story (About)",
    sections: [
      { type: "text", key: "about.hero.eyebrow", label: "Hero eyebrow", default: "Our Story" },
      { type: "text", key: "about.hero.title", label: "Hero title", default: "A legacy of giving, continued." },
      {
        type: "image",
        key: "about.intro.image",
        label: "Intro photo",
        default: "https://images.unsplash.com/photo-1561212856-44e9bae482aa?w=1200&q=80&fm=jpg&fit=crop"
      },
      {
        type: "text",
        key: "about.intro.paragraph1",
        label: "Intro — paragraph 1",
        multiline: true,
        default:
          "The William & Helen Heritage Foundation was established in memory of Rev. (Mrs) Helen Titilayo Okoye, who passed away in 2019. WHHF was created to continue the generosity she was known for during her lifetime."
      },
      {
        type: "text",
        key: "about.intro.paragraph2",
        label: "Intro — paragraph 2",
        multiline: true,
        default:
          "WHHF operates under the umbrella of the All Christians Fellowship Mission, the same community Rev. (Mrs) Helen Titilayo Okoye served for years alongside Rev. Dr. William Okoye. Rather than spread support across many causes, the Foundation chose to start narrow and deliberate: direct financial grants toward chemotherapy and treatment costs for indigent cancer patients, distributed in partnership with National Hospital, Abuja. Every case is reviewed by the board before any funds move, so support reaches the patients who need it most, without unnecessary delay."
      },
      {
        type: "text",
        key: "about.intro.paragraph3",
        label: "Intro — paragraph 3",
        multiline: true,
        default:
          "That approach has already translated into real support, including a distribution of over ₦1.5M to five indigent cancer patients, made on the 4th memorial anniversary of Rev. (Mrs) Helen Okoye. It is a small, tangible expression of a much larger conviction: that generosity, offered cheerfully and without compulsion, is worth continuing, one life at a time."
      },
      { type: "text", key: "about.purpose.heading", label: "Purpose heading", default: "Why WHHF exists." },
      {
        type: "text",
        key: "about.purpose.body",
        label: "Purpose body",
        multiline: true,
        default: "William and Helen Heritage Foundation exists to promote godly values, transform lives and society."
      },
      {
        type: "text",
        key: "about.vision.heading",
        label: "Vision heading",
        default: "What we're working toward."
      },
      {
        type: "text",
        key: "about.vision.body",
        label: "Vision body",
        multiline: true,
        default:
          "William and Helen Heritage Foundation envisions a society guided by godly values, where people's lives are transformed to live optimally."
      },
      {
        type: "image",
        key: "about.coreValues.image",
        label: "Core Values panel background photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/WhatsApp%20Image%202026-09-14%20at%204.33.10%20PM.jpeg"
      },
      // Only the sentence per core value is editable — letter/rest are a
      // fixed "GIVE HELP" acrostic in components/marketing/CoreValuesTimeline,
      // deliberately not a generic list (see that component's comment).
      {
        type: "text",
        key: "about.coreValues.godliness",
        label: "Core value — Godliness",
        multiline: true,
        default: "We anchor every decision in reverence for God and the character He calls us to reflect."
      },
      {
        type: "text",
        key: "about.coreValues.integrity",
        label: "Core value — Integrity",
        multiline: true,
        default: "We do what we say, matching our public commitments to how every gift is actually used."
      },
      {
        type: "text",
        key: "about.coreValues.veracity",
        label: "Core value — Veracity",
        multiline: true,
        default: "We speak and report plainly and truthfully, even when it would be easier not to."
      },
      {
        type: "text",
        key: "about.coreValues.excellence",
        label: "Core value — Excellence",
        multiline: true,
        default: "We hold our work to a high standard, because the people we serve deserve nothing less."
      },
      {
        type: "text",
        key: "about.coreValues.humility",
        label: "Core value — Humility",
        multiline: true,
        default: "We serve quietly, without needing recognition for the good that gets done."
      },
      {
        type: "text",
        key: "about.coreValues.earnestness",
        label: "Core value — Earnestness",
        multiline: true,
        default: "We show up wholehearted and consistent, not just when it's convenient."
      },
      {
        type: "text",
        key: "about.coreValues.love",
        label: "Core value — Love",
        multiline: true,
        default: "We treat every person we serve with genuine compassion, not obligation."
      },
      {
        type: "text",
        key: "about.coreValues.peace",
        label: "Core value — Peace",
        multiline: true,
        default: "We pursue reconciliation and calm in how we work with patients, partners, and each other."
      },
      { type: "text", key: "about.values.heading", label: "\"What We Stand For\" heading", default: "The values behind every gift." },
      {
        type: "image",
        key: "about.values.image",
        label: "\"What We Stand For\" photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/WhatsApp%20Image%202026-09-14%20at%204.33.10%20PM%20(2).jpeg"
      },
      {
        // Icons are fixed in about/page.tsx, matched to items by index —
        // only title/body are editable. Adding an item beyond the
        // original 4 renders without a custom icon (graceful, not broken).
        type: "list",
        key: "about.values",
        label: "Values cards",
        itemFields: [
          { type: "text", key: "title", label: "Title", default: "" },
          { type: "text", key: "body", label: "Body", multiline: true, default: "" }
        ],
        default: [
          {
            title: "Faith-Led",
            body: "Every act of generosity is grounded in the same conviction WHHF was founded on, cheerful, practical faith in action."
          },
          {
            title: "Direct to Patients",
            body: "Grants go straight toward chemotherapy and treatment costs, not overhead, not intermediaries."
          },
          {
            title: "Transparent",
            body: "Every donation is tracked and reported, so you can see exactly how your generosity is put to work."
          },
          {
            title: "Community-Rooted",
            body: "Carried forward within the All Christians Fellowship Mission community Helen served for years."
          }
        ]
      }
    ]
  },
  {
    slug: "programmes",
    label: "Programmes",
    sections: [
      { type: "text", key: "programmes.hero.eyebrow", label: "Hero eyebrow", default: "Programmes" },
      { type: "text", key: "programmes.hero.title", label: "Hero title", default: "Where your gift goes." },
      {
        type: "text",
        key: "programmes.hero.lede",
        label: "Hero subtitle",
        multiline: true,
        default:
          "WHHF's programme work starts with direct, practical support for indigent cancer patients, with more programmes to follow as they're confirmed."
      },
      {
        type: "image",
        key: "programmes.flagship.image",
        label: "Flagship programme photo",
        default: "https://images.unsplash.com/photo-1578496781307-30c2b531c05a?w=900&q=80&fm=jpg&fit=crop"
      },
      { type: "text", key: "programmes.flagship.badge", label: "Flagship badge", default: "Flagship Programme" },
      {
        type: "text",
        key: "programmes.flagship.heading",
        label: "Flagship heading",
        default: "Indigent Cancer Patient Support"
      },
      {
        type: "text",
        key: "programmes.flagship.body1",
        label: "Flagship body — paragraph 1",
        multiline: true,
        default:
          "Direct financial grants toward chemotherapy and treatment costs for patients who cannot afford care, distributed in partnership with National Hospital, Abuja. Every case is reviewed individually before any funds move, so support reaches the patients who need it most, without unnecessary delay."
      },
      {
        type: "text",
        key: "programmes.flagship.body2",
        label: "Flagship body — paragraph 2",
        multiline: true,
        default:
          "This remains WHHF's founding programme, and the clearest expression of the promise the Foundation was built to keep: give directly, give practically, and give to the people who need it most."
      },
      { type: "text", key: "programmes.areas.heading", label: "\"Programme Areas\" heading", default: "Where WHHF focuses its work." },
      {
        type: "list",
        key: "programmes.areas",
        label: "Programme areas",
        itemFields: [
          { type: "text", key: "heading", label: "Heading", default: "" },
          { type: "text", key: "body", label: "Body", multiline: true, default: "" }
        ],
        default: [
          {
            heading: "Value Promotion",
            body: "We believe that the lives of individuals and society can become better by imbibing certain moral and upright values. We plan promoting these values through diverse activities and strategies."
          },
          {
            heading: "Social and Community Development",
            body: "Through our Social and Community Development programmes, we plan touching the lives of widows, widowers, orphans, less privileged persons, and persons at risk or in distress, positively. We also believe in peaceful coexistence and development of communities, which will contribute to the improvement of the quality of life of the individuals in such communities."
          },
          {
            heading: "Skills and Entrepreneurial Development",
            body: "Our Skills and Entrepreneurial Development programme is aimed at empowering individuals to be economically stable, to be able to care for themselves and their families, and contribute meaningfully to the development of society."
          },
          {
            heading: "Holistic Development",
            body: "We believe that the best way to care for human beings is to be holistic, and therefore we plan implementing activities that care for the “total man.” Our holistic development programme addresses the health, educational, psycho-social, and spiritual needs of people."
          }
        ]
      },
      { type: "text", key: "programmes.steps.heading", label: "\"How It Works\" heading", default: "From reaching out to a life changed." },
      {
        type: "list",
        key: "programmes.steps",
        label: "How-it-works steps",
        itemFields: [
          { type: "text", key: "number", label: "Number", default: "" },
          { type: "text", key: "heading", label: "Heading", default: "" },
          { type: "text", key: "body", label: "Body", multiline: true, default: "" }
        ],
        default: [
          {
            number: "01",
            heading: "Reach & Referral",
            body: "Patients and families reach us directly, or through our network within the All Christians Fellowship Mission community."
          },
          {
            number: "02",
            heading: "Board Verification",
            body: "Every case is reviewed by the board before any funds move, confirming the medical need first."
          },
          {
            number: "03",
            heading: "Direct Grant",
            body: "Approved grants are paid straight toward treatment costs, not through intermediaries."
          },
          {
            number: "04",
            heading: "Follow-Up",
            body: "WHHF stays in touch through recovery, rather than treating a grant as the end of the relationship."
          }
        ]
      },
      {
        type: "image",
        key: "programmes.approach.image",
        label: "\"Looking Ahead\" photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/649531155_17984201615874766_6774910805288153881_n.webp"
      },
      { type: "text", key: "programmes.approach.heading", label: "\"Looking Ahead\" heading", default: "Depth first, then scale." },
      {
        type: "text",
        key: "programmes.approach.body1",
        label: "\"Looking Ahead\" body — paragraph 1",
        multiline: true,
        default:
          "WHHF chose to start narrow on purpose: one programme, one hospital partnership, reviewed case by case, rather than spread support thin across many causes before learning what real, effective help looks like."
      },
      {
        type: "text",
        key: "programmes.approach.body2",
        label: "\"Looking Ahead\" body — paragraph 2",
        multiline: true,
        default:
          "As that foundation proves out, the same criteria will guide any programme WHHF adds next: direct impact over overhead, verified need over volume, and a hospital or community partnership grounded in real accountability."
      },
      { type: "text", key: "programmes.faq.heading", label: "FAQ heading", default: "Programme questions, answered." },
      {
        type: "text",
        key: "programmes.faq.intro",
        label: "FAQ intro",
        multiline: true,
        default: "How grants are approved, who qualifies, and how WHHF decides where support goes."
      },
      {
        type: "text",
        key: "programmes.faq.sideBody",
        label: "FAQ side panel body",
        multiline: true,
        default:
          "Every question here traces back to the same principle: grants go straight to treatment costs, only after a case is genuinely reviewed."
      },
      {
        type: "list",
        key: "programmes.faq.items",
        label: "FAQ items",
        itemFields: [
          { type: "text", key: "question", label: "Question", default: "" },
          { type: "text", key: "answer", label: "Answer", multiline: true, default: "" }
        ],
        default: [
          {
            question: "How does a patient qualify for support?",
            answer:
              "Cases are reviewed by the WHHF board, alongside the medical professionals already treating the patient, to confirm genuine need before any funds move."
          },
          {
            question: "Where does the money actually go?",
            answer:
              "Directly toward chemotherapy and treatment costs at National Hospital, Abuja, for the flagship programme, not toward overhead or intermediaries."
          },
          {
            question: "How fast can a grant be paid?",
            answer:
              "As soon as a case is reviewed and confirmed. The review step exists to protect donors and patients alike, not to slow things down unnecessarily."
          },
          {
            question: "Will WHHF add more programmes?",
            answer:
              "Yes, over time, following the same standard: verified need, a real partner institution, and direct impact. Announcements will be published here once confirmed."
          },
          {
            question: "Can a hospital or organization refer a patient?",
            answer: "Yes, reach out through our Contact page to start that conversation."
          }
        ]
      },
      {
        type: "image",
        key: "programmes.donateCta.image",
        label: "Bottom donate banner photo",
        default: "https://images.unsplash.com/photo-1543689604-6fe8dbcd1f59?w=1200&q=80&fm=jpg&fit=crop"
      }
    ]
  },
  {
    slug: "donate",
    label: "Donate",
    sections: [
      { type: "text", key: "donate.hero.eyebrow", label: "Hero eyebrow", default: "Donate" },
      { type: "text", key: "donate.hero.title", label: "Hero title", default: "Make a donation." },
      {
        type: "text",
        key: "donate.hero.lede",
        label: "Hero subtitle",
        multiline: true,
        default: "Every gift goes directly toward WHHF's programmes, starting with support for indigent cancer patients."
      },
      { type: "text", key: "donate.bank.heading", label: "Bank transfer heading", default: "Prefer a bank transfer?" },
      {
        type: "text",
        key: "donate.bank.note",
        label: "Bank transfer note",
        multiline: true,
        default:
          "While online card payments are being finalized, you can also give directly by bank transfer using the details below."
      },
      {
        type: "list",
        key: "donate.bank.rows",
        label: "Bank details",
        itemFields: [
          { type: "text", key: "label", label: "Label", default: "" },
          { type: "text", key: "value", label: "Value", default: "" }
        ],
        default: [
          { label: "Account name", value: "William and Helen Heritage Foundation" },
          { label: "Account number", value: "5600513265" },
          { label: "Bank", value: "Fidelity Bank" }
        ]
      }
    ]
  },
  {
    slug: "gallery",
    label: "Gallery",
    sections: [
      { type: "text", key: "gallery.hero.eyebrow", label: "Hero eyebrow", default: "Gallery" },
      { type: "text", key: "gallery.hero.title", label: "Hero title", default: "Moments from the work." },
      {
        type: "text",
        key: "gallery.hero.lede",
        label: "Hero subtitle",
        multiline: true,
        default: "A look at WHHF's programmes and the community carrying them forward. Click any photo to view it full-size."
      },
      {
        type: "list",
        key: "gallery.images",
        label: "Gallery photos",
        itemFields: [
          { type: "image", key: "src", label: "Photo", default: "" },
          { type: "text", key: "caption", label: "Caption", default: "" }
        ],
        default: [
          {
            src: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/WhatsApp%20Image%202026-09-14%20at%204.33.10%20PM.jpeg",
            caption: "WHHF programme activity"
          },
          {
            src: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/WhatsApp%20Image%202026-09-14%20at%204.33.10%20PM%20(1).jpeg",
            caption: "Community engagement"
          },
          {
            src: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/649531155_17984201615874766_6774910805288153881_n.webp",
            caption: "Case review and outreach"
          },
          {
            src: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/627673414_18361507168160333_4291544863867280766_n.jpg",
            caption: "Promoting godly values"
          },
          {
            src: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/654712004_18100318330938352_452443779084317951_n.webp",
            caption: "WHHF community outreach"
          },
          {
            src: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/658187139_18313702102283882_396341819537141756_n.webp",
            caption: "WHHF programme activity"
          },
          {
            src: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/659814391_18339030712300134_1657967389436416368_n.webp",
            caption: "WHHF in the community"
          },
          {
            src: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/670317138_18121245112616977_1879193932980889521_n.webp",
            caption: "Celebrating patients supported"
          },
          {
            src: "https://images.unsplash.com/photo-1578496781307-30c2b531c05a?w=900&q=80&fm=jpg&fit=crop",
            caption: "Recovery and treatment support"
          },
          {
            src: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?w=900&q=80&fm=jpg&fit=crop",
            caption: "Faith and community"
          },
          {
            src: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/2151940449.jpg",
            caption: "WHHF in the community"
          },
          {
            src: "https://images.unsplash.com/photo-1561212856-44e9bae482aa?w=1200&q=80&fm=jpg&fit=crop",
            caption: "Remembering our founding story"
          },
          {
            src: "https://images.unsplash.com/photo-1761370981139-c1fe5402c709?w=1200&q=80&fm=jpg&fit=crop",
            caption: "Reaching families in Abuja"
          }
        ]
      }
    ]
  },
  {
    slug: "faith",
    label: "A Word of Faith",
    sections: [
      { type: "text", key: "faith.title", label: "Title", default: "A legacy rooted in faith and compassion." },
      {
        type: "image",
        key: "faith.image",
        label: "Photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/rev%20dr%20william%20okoye.jpg"
      },
      // This is memorial content about a specific person (see AGENTS.md /
      // docs/content-style-guide.md's memorial-content note) — the family
      // themselves are the ones with standing to edit it through their own
      // admin panel; that guidance is about an engineer/agent not
      // rewriting it unilaterally, not about restricting the family here.
      {
        type: "text",
        key: "faith.paragraph1",
        label: "Paragraph 1 (scripture quote)",
        multiline: true,
        default:
          "“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” (2 Corinthians 9:7)"
      },
      {
        type: "text",
        key: "faith.paragraph2",
        label: "Paragraph 2",
        multiline: true,
        default:
          "In loving memory of Rev. Dr. William Okoye, whose ministry, alongside Rev. (Mrs) Helen Titilayo Okoye, helped carry that spirit of cheerful, practical generosity through the All Christians Fellowship Mission for years."
      },
      {
        type: "text",
        key: "faith.paragraph3",
        label: "Paragraph 3",
        multiline: true,
        default:
          "WHHF continues that same calling today: care for the sick, support for the struggling, and faith put into action rather than left as words alone. It is not a passive belief held quietly, it is a conviction that shows up in a paid chemotherapy bill, a hospital visit, a case reviewed carefully before any funds move."
      },
      {
        type: "text",
        key: "faith.paragraph4",
        label: "Paragraph 4",
        multiline: true,
        default:
          "Generosity, understood this way, is not an obligation grudgingly met. It is offered cheerfully, because it reflects a character already at work in the giver, the same character this Foundation was built to carry forward, one life at a time."
      },
      {
        type: "text",
        key: "faith.paragraph5",
        label: "Paragraph 5",
        multiline: true,
        default:
          "Every gift given to WHHF, however large or small, becomes part of that same continuing act of faith, a promise kept, again and again, to the people who need it most."
      }
    ]
  },
  {
    slug: "impact",
    label: "Impact",
    sections: [
      { type: "text", key: "impact.hero.eyebrow", label: "Hero eyebrow", default: "Impact" },
      {
        type: "text",
        key: "impact.hero.title",
        label: "Hero title",
        default: "What your generosity has made possible."
      },
      {
        type: "text",
        key: "impact.hero.lede",
        label: "Hero subtitle",
        multiline: true,
        default: "Confirmed figures below, updated as new distributions are made and admin reporting comes online."
      },
      {
        type: "image",
        key: "impact.image",
        label: "Photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/670317138_18121245112616977_1879193932980889521_n.webp"
      },
      { type: "text", key: "impact.stat1.figure", label: "Stat 1 — figure", default: "₦1.5M+" },
      {
        type: "text",
        key: "impact.stat1.description",
        label: "Stat 1 — description",
        multiline: true,
        default:
          "Distributed to five indigent cancer patients at National Hospital, Abuja, on the 4th memorial anniversary of Rev. (Mrs) Helen Okoye."
      },
      { type: "text", key: "impact.stat2.figure", label: "Stat 2 — figure", default: "5" },
      {
        type: "text",
        key: "impact.stat2.description",
        label: "Stat 2 — description",
        default: "Patients directly supported in this distribution."
      },
      {
        type: "text",
        key: "impact.stories.heading",
        label: "\"Where your support goes\" heading",
        default: "Where your support goes."
      }
    ]
  },
  {
    slug: "home",
    label: "Home",
    sections: [
      { type: "text", key: "home.hero.heading", label: "Hero heading", default: "Continuing a legacy of giving, one life at a time." },
      {
        type: "text",
        key: "home.hero.lede",
        label: "Hero subtitle",
        multiline: true,
        default:
          "The William & Helen Heritage Foundation supports indigent cancer patients in Abuja and beyond, carrying forward the generosity of Rev. (Mrs) Helen Titilayo Okoye."
      },
      {
        type: "image",
        key: "home.hero.image",
        label: "Hero photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/2151565852.jpg"
      },
      { type: "text", key: "home.hero.statLabel", label: "Hero stat card — label", default: "In loving memory of" },
      {
        type: "text",
        key: "home.hero.statValue",
        label: "Hero stat card — value",
        default: "Rev. Dr. William & Rev. (Mrs.) Helen Okoye"
      },
      {
        type: "text",
        key: "home.hero.statCaption",
        label: "Hero stat card — caption",
        default: "Whose generosity continues through WHHF"
      },

      { type: "text", key: "home.aboutUs.eyebrow", label: "\"Who We Are\" eyebrow", default: "Who We Are" },
      { type: "text", key: "home.aboutUs.heading", label: "\"Who We Are\" heading", default: "Driven by compassion, guided by faith." },
      {
        type: "image",
        key: "home.aboutUs.image",
        label: "\"Who We Are\" main photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/WhatsApp%20Image%202026-09-14%20at%204.33.10%20PM.jpeg"
      },
      { type: "text", key: "home.aboutUs.statValue", label: "\"Who We Are\" stat — value", default: "5+" },
      { type: "text", key: "home.aboutUs.statLabel", label: "\"Who We Are\" stat — label", default: "Patients Supported" },
      {
        type: "text",
        key: "home.aboutUs.statCaption",
        label: "\"Who We Are\" stat — caption",
        default: "Direct grants toward chemotherapy and treatment costs."
      },
      {
        type: "image",
        key: "home.aboutUs.thumbImage",
        label: "\"Who We Are\" thumbnail photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/2151940449.jpg"
      },
      {
        type: "text",
        key: "home.aboutUs.body",
        label: "\"Who We Are\" body",
        multiline: true,
        default:
          "WHHF was established in memory of Rev. (Mrs) Helen Titilayo Okoye, under the umbrella of the All Christians Fellowship Mission. What began as a single act of giving, support for indigent cancer patients, continues as an ongoing commitment to carry her generosity forward."
      },
      {
        type: "image",
        key: "home.aboutUs.fillImage",
        label: "\"Who We Are\" full-width photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/627673414_18361507168160333_4291544863867280766_n.jpg"
      },

      { type: "text", key: "home.story.eyebrow", label: "\"Our Story\" eyebrow", default: "Our Story" },
      { type: "text", key: "home.story.heading", label: "\"Our Story\" heading", default: "A loss that became a promise." },
      {
        type: "text",
        key: "home.story.lede",
        label: "\"Our Story\" body",
        multiline: true,
        default:
          "Rev. (Mrs) Helen Titilayo Okoye passed away in 2019. WHHF was established in her memory, under the umbrella of the All Christians Fellowship Mission, to continue the generosity she was known for, starting with support for indigent cancer patients who cannot afford treatment."
      },
      {
        type: "image",
        key: "home.story.image",
        label: "\"Our Story\" photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/WhatsApp%20Image%202026-09-14%20at%204.33.10%20PM%20(1).jpeg"
      },
      { type: "text", key: "home.story.stat1Value", label: "\"Our Story\" stat 1 — value", default: "Faith-Led" },
      { type: "text", key: "home.story.stat1Caption", label: "\"Our Story\" stat 1 — caption", default: "Rooted in the values Helen lived by." },
      { type: "text", key: "home.story.stat2Value", label: "\"Our Story\" stat 2 — value", default: "Direct to Patients" },
      {
        type: "text",
        key: "home.story.stat2Caption",
        label: "\"Our Story\" stat 2 — caption",
        default: "Grants go straight to treatment costs, not overhead."
      },
      { type: "text", key: "home.story.stat3Value", label: "\"Our Story\" stat 3 — value", default: "Transparent" },
      {
        type: "text",
        key: "home.story.stat3Caption",
        label: "\"Our Story\" stat 3 — caption",
        default: "Every donation accounted for and reported."
      },

      { type: "text", key: "home.howWeWork.eyebrow", label: "\"How We Work\" eyebrow", default: "How We Work" },
      { type: "text", key: "home.howWeWork.heading", label: "\"How We Work\" heading", default: "From reaching out to a life changed." },
      {
        type: "image",
        key: "home.howWeWork.image",
        label: "\"How We Work\" photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/649531155_17984201615874766_6774910805288153881_n.webp"
      },
      { type: "text", key: "home.howWeWork.step1Heading", label: "Step 1 — heading", default: "Reach & Referral" },
      {
        type: "text",
        key: "home.howWeWork.step1Body",
        label: "Step 1 — body",
        multiline: true,
        default: "Patients and families reach us directly, or through our network within the All Christians Fellowship Mission community."
      },
      { type: "text", key: "home.howWeWork.step2Heading", label: "Step 2 — heading", default: "Board Verification" },
      {
        type: "text",
        key: "home.howWeWork.step2Body",
        label: "Step 2 — body",
        multiline: true,
        default: "Every case is reviewed by the board before any funds move, confirming the medical need first."
      },
      { type: "text", key: "home.howWeWork.step3Heading", label: "Step 3 — heading", default: "Direct Grant" },
      {
        type: "text",
        key: "home.howWeWork.step3Body",
        label: "Step 3 — body",
        multiline: true,
        default: "Approved grants are paid straight toward treatment costs, not through intermediaries."
      },
      { type: "text", key: "home.howWeWork.ctaHeading", label: "CTA card — heading", default: "See it in action" },
      { type: "text", key: "home.howWeWork.ctaBody", label: "CTA card — body", default: "Explore the programmes this process supports." },

      { type: "text", key: "home.getInvolved.eyebrow", label: "\"Get Involved\" eyebrow", default: "Get Involved" },
      { type: "text", key: "home.getInvolved.heading", label: "\"Get Involved\" heading", default: "Ways to support the work." },
      {
        type: "text",
        key: "home.getInvolved.intro",
        label: "\"Get Involved\" intro",
        multiline: true,
        default: "From a direct gift to sharing our story, every form of support carries Helen's generosity a little further."
      },
      {
        type: "image",
        key: "home.getInvolved.card1Image",
        label: "Card 1 (links to /programmes) — photo",
        default: "https://images.unsplash.com/photo-1578496781307-30c2b531c05a?w=900&q=80&fm=jpg&fit=crop"
      },
      { type: "text", key: "home.getInvolved.card1Badge", label: "Card 1 — badge", default: "Flagship Programme" },
      { type: "text", key: "home.getInvolved.card1Heading", label: "Card 1 — heading", default: "Indigent Cancer Patient Support" },
      {
        type: "text",
        key: "home.getInvolved.card1Body",
        label: "Card 1 — body",
        multiline: true,
        default: "Direct grants toward chemotherapy and treatment costs for patients who cannot afford care."
      },
      {
        type: "image",
        key: "home.getInvolved.card2Image",
        label: "Card 2 (links to /about) — photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/mummy-Helen-Okoye-1.jpg"
      },
      { type: "text", key: "home.getInvolved.card2Badge", label: "Card 2 — badge", default: "Our Story" },
      { type: "text", key: "home.getInvolved.card2Heading", label: "Card 2 — heading", default: "Founded in Helen's Memory" },
      {
        type: "text",
        key: "home.getInvolved.card2Body",
        label: "Card 2 — body",
        multiline: true,
        default: "Read how WHHF came to be, and the family behind it."
      },
      {
        type: "image",
        key: "home.getInvolved.card3Image",
        label: "Card 3 (links to /donate) — photo",
        default: "https://images.unsplash.com/photo-1543689604-6fe8dbcd1f59?w=1200&q=80&fm=jpg&fit=crop"
      },
      { type: "text", key: "home.getInvolved.card3Badge", label: "Card 3 — badge", default: "Give" },
      { type: "text", key: "home.getInvolved.card3Heading", label: "Card 3 — heading", default: "Make a Donation" },
      {
        type: "text",
        key: "home.getInvolved.card3Body",
        label: "Card 3 — body",
        multiline: true,
        default: "Every gift goes directly toward treatment costs for patients who need it most."
      },

      { type: "text", key: "home.impact.eyebrow", label: "\"Our Impact\" eyebrow", default: "Our Impact" },
      { type: "text", key: "home.impact.heading", label: "\"Our Impact\" heading", default: "Where your support goes." },
      {
        type: "text",
        key: "home.impact.intro",
        label: "\"Our Impact\" intro",
        multiline: true,
        default: "Four things carry every gift forward, browse through what your support makes possible."
      },
      {
        type: "image",
        key: "home.impact.panelImage",
        label: "\"Our Impact\" panel background photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/2151940449.jpg"
      },
      {
        // href/linkLabel per card stay fixed — each points to a specific
        // /impact/[slug] detail route, and a broken/typo'd href here would
        // silently 404. Only image/title/body are editable.
        type: "list",
        key: "home.impact.items",
        label: "Impact carousel cards (in fixed order — links are not editable)",
        itemFields: [
          { type: "image", key: "image", label: "Photo", default: "" },
          { type: "text", key: "title", label: "Title", default: "" },
          { type: "text", key: "body", label: "Body", multiline: true, default: "" }
        ],
        default: [
          {
            image: "https://images.unsplash.com/photo-1578496781307-30c2b531c05a?w=900&q=80&fm=jpg&fit=crop",
            title: "Treatment & Recovery",
            body: "Direct financial grants toward chemotherapy and treatment costs, distributed in partnership with National Hospital, Abuja. Every case is reviewed individually, so support reaches the patients who need it most, without unnecessary delay."
          },
          {
            image: "https://images.unsplash.com/photo-1632215861513-130b66fe97f4?w=900&q=80&fm=jpg&fit=crop",
            title: "Faith & Community",
            body: "Rooted in the All Christians Fellowship Mission, our work carries forward a legacy of compassion within the community Helen served, grounded in faith, and carried out in practical, everyday ways."
          },
          {
            image: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/649531155_17984201615874766_6774910805288153881_n.webp",
            title: "Community Outreach",
            body: "From hospital visits to community engagements, WHHF stays connected to the people it serves, because lasting support starts with genuinely knowing the families behind every case."
          },
          {
            image: "https://images.unsplash.com/photo-1543689604-6fe8dbcd1f59?w=1200&q=80&fm=jpg&fit=crop",
            title: "Transparency & Accountability",
            body: "Every donation is tracked and reported, so donors can see exactly how their generosity is put to work, no hidden fees, no unexplained gaps."
          }
        ]
      },

      {
        type: "image",
        key: "home.faith.image",
        label: "\"A Word of Faith\" photo",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/rev%20dr%20william%20okoye.jpg"
      },
      {
        type: "text",
        key: "home.faith.body1",
        label: "\"A Word of Faith\" — paragraph 1",
        multiline: true,
        default:
          "“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” (2 Corinthians 9:7)"
      },
      {
        type: "text",
        key: "home.faith.body2",
        label: "\"A Word of Faith\" — paragraph 2",
        multiline: true,
        default:
          "In loving memory of Rev. Dr. William Okoye, whose ministry, alongside Rev. (Mrs) Helen Titilayo Okoye, helped carry that spirit of cheerful, practical generosity through the All Christians Fellowship Mission for years."
      },
      {
        type: "text",
        key: "home.faith.body3",
        label: "\"A Word of Faith\" — paragraph 3",
        multiline: true,
        default:
          "WHHF continues that same calling today: care for the sick, support for the struggling, and faith put into action rather than left as words alone."
      },

      { type: "text", key: "home.blog.eyebrow", label: "\"From the Blog\" eyebrow", default: "From the Blog" },
      { type: "text", key: "home.blog.heading", label: "\"From the Blog\" heading", default: "Stories, updates, and reflections." },

      { type: "text", key: "home.faq.heading", label: "FAQ heading", default: "Frequently asked questions." },
      {
        type: "text",
        key: "home.faq.intro",
        label: "FAQ intro",
        multiline: true,
        default: "Straightforward answers about giving, our programmes, and how WHHF operates, no pressure, just what you need to know."
      },
      {
        type: "text",
        key: "home.faq.sideBody",
        label: "FAQ side panel body",
        multiline: true,
        default:
          "We answer common questions about giving, our programmes, and how WHHF operates with full transparency, before you ever commit to anything."
      },
      {
        type: "list",
        key: "home.faq.items",
        label: "FAQ items",
        itemFields: [
          { type: "text", key: "question", label: "Question", default: "" },
          { type: "text", key: "answer", label: "Answer", multiline: true, default: "" }
        ],
        default: [
          {
            question: "How can I donate?",
            answer:
              "You can give directly through our Donate page using bank transfer or card payment. Every gift goes toward supporting indigent cancer patients."
          },
          {
            question: "Where does my donation go?",
            answer:
              "Donations go directly toward chemotherapy and treatment costs for patients supported through our flagship programme, distributed in partnership with National Hospital, Abuja."
          },
          {
            question: "Is WHHF a registered organization?",
            answer:
              "WHHF operates under the umbrella of the All Christians Fellowship Mission. Our formal registration details are being finalized and will be published here once confirmed."
          },
          {
            question: "Can I volunteer or partner with WHHF?",
            answer: "Yes, reach out through our Contact page to discuss partnership or volunteering opportunities."
          },
          {
            question: "Who founded WHHF?",
            answer:
              "WHHF was established in memory of Rev. (Mrs) Helen Titilayo Okoye, continuing the generosity she was known for during her lifetime."
          },
          {
            question: "How do I get started?",
            answer: "Visit our Donate page to give directly, or use our Contact page to reach out with questions first."
          }
        ]
      },

      {
        // hrefs stay fixed (/about, /programmes, /impact) — only the
        // photo/title/line per card are editable.
        type: "list",
        key: "home.explore.items",
        label: "\"Explore more\" cards (in fixed order — links are not editable)",
        itemFields: [
          { type: "image", key: "image", label: "Photo", default: "" },
          { type: "text", key: "title", label: "Title", default: "" },
          { type: "text", key: "line", label: "Caption line", default: "" }
        ],
        default: [
          {
            image: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/web-images/mummy-Helen-Okoye-1.jpg",
            title: "Our Story",
            line: "How WHHF carries Helen's legacy forward."
          },
          {
            image: "https://images.unsplash.com/photo-1578496781307-30c2b531c05a?w=900&q=80&fm=jpg&fit=crop",
            title: "Our Programmes",
            line: "Direct support for indigent cancer patients."
          },
          {
            image: "https://images.unsplash.com/photo-1543689604-6fe8dbcd1f59?w=1200&q=80&fm=jpg&fit=crop",
            title: "Our Impact",
            line: "See how your generosity reaches patients."
          }
        ]
      },

      {
        type: "image",
        key: "home.donateCta.image1",
        label: "Bottom donate banner — photo 1",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/2151565852.jpg"
      },
      {
        type: "image",
        key: "home.donateCta.image2",
        label: "Bottom donate banner — photo 2",
        default: "https://pub-edb75a29dec547999359fcf854521a0f.r2.dev/2151565939.jpg"
      }
    ]
  }
];

export function getPageManifest(slug: string): PageManifest | undefined {
  return contentRegistry.find((page) => page.slug === slug);
}

/** Every field key declared across every page, flattened — used to validate an incoming save request references a real field. */
export function getAllFieldDefs(): Map<string, FieldDef> {
  const map = new Map<string, FieldDef>();
  for (const page of contentRegistry) {
    for (const field of page.sections) {
      map.set(field.key, field);
    }
  }
  return map;
}
