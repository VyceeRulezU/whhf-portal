import { placeholderImages } from "./placeholderImages";
import { sitePhotos } from "./sitePhotos";

/**
 * TEMPORARY placeholder editorial content, general/thematic writing, not
 * attributed quotes or invented WHHF-specific facts/figures. Swap for real
 * posts as WHHF supplies them; see AGENTS.md on never fabricating specific
 * facts (donor counts, partner names, registration numbers).
 */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  body: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-we-give",
    title: "Why We Give: The Story Behind WHHF",
    excerpt:
      "Every organization has a reason it exists. For WHHF, that reason is a promise made in memory of a woman known for her generosity.",
    category: "Our Story",
    date: "2026-08-04",
    readTime: "4 min read",
    image: placeholderImages.aboutStory,
    body: [
      "The William & Helen Heritage Foundation was established in memory of Rev. (Mrs) Helen Titilayo Okoye, who passed away in 2019. Under the umbrella of the All Christians Fellowship Mission, WHHF was created to carry forward a simple but demanding calling: give directly, give practically, and give to the people who need it most.",
      "That calling started with support for indigent cancer patients, men and women whose treatment costs stood between them and survival. It is a narrow starting point by design. Rather than spread support thin across many causes, WHHF chose to go deep on one, learning what real, effective help looks like before growing further.",
      "Giving, for WHHF, is not an abstract idea. It is a grant that pays for a round of chemotherapy. It is a family that no longer has to choose between treatment and rent. It is a promise kept, one patient at a time.",
      "This is the story every programme, every donation, and every partnership traces back to: a single act of remembered generosity, still finding new ways to reach people today."
    ]
  },
  {
    slug: "cost-of-cancer-treatment-in-nigeria",
    title: "Understanding the Cost of Cancer Treatment in Nigeria",
    excerpt:
      "For many Nigerian families, a cancer diagnosis brings a second crisis close behind the medical one: the cost of treatment itself.",
    category: "Awareness",
    date: "2026-07-18",
    readTime: "5 min read",
    image: sitePhotos.aboutUsThumb,
    body: [
      "Chemotherapy, radiotherapy, diagnostic imaging, and the surrounding care a cancer diagnosis requires are expensive by any standard, and for households without health insurance that covers oncology care, the burden falls directly on the family.",
      "It is common for treatment to stall or stop entirely once a family's savings run out, not because the treatment stopped working, but because it became unaffordable. This is the specific gap WHHF's flagship programme exists to close: direct grants paid toward chemotherapy and treatment costs, so a shortage of funds is never the reason a patient's care is interrupted.",
      "Every case supported through this programme is reviewed individually before any funds move, confirming genuine medical need first. It is slower than writing a single large check to a general fund, but it means support reaches the patients who need it, without unnecessary delay or waste.",
      "Awareness is the first step toward closing this gap at scale. The more people understand what cancer treatment actually costs in Nigeria, the easier it becomes to build the kind of sustained, community-backed support that patients need."
    ]
  },
  {
    slug: "five-ways-your-donation-changes-a-life",
    title: "5 Ways Your Donation Changes a Life",
    excerpt:
      "A donation to WHHF rarely stops at one person. Here's what a single gift sets in motion.",
    category: "Impact",
    date: "2026-06-29",
    readTime: "3 min read",
    image: placeholderImages.impactHero,
    body: [
      "1. It pays for treatment that would otherwise be delayed. Every grant is applied directly toward chemotherapy or treatment costs, the exact expense standing between a patient and continued care.",
      "2. It relieves pressure on the whole family. Medical bills rarely affect one person alone; a grant that covers treatment costs frees up household income for rent, food, and other children's needs.",
      "3. It builds trust in the surrounding community. Every case WHHF supports is reviewed by the board before funds move, so families and hospital partners alike know the support is genuine and accountable.",
      "4. It strengthens a growing partnership with National Hospital, Abuja, where WHHF's distributions have taken place, support that compounds as the relationship continues.",
      "5. It keeps a promise alive. Every gift, however large or small, carries forward the same generosity WHHF was founded on, one life at a time."
    ]
  },
  {
    slug: "faith-in-action",
    title: "Faith in Action: Living Out Generosity",
    excerpt:
      "For WHHF, faith isn't a backdrop to the work. It's the reason the work looks the way it does.",
    category: "Faith",
    date: "2026-06-05",
    readTime: "4 min read",
    image: placeholderImages.whoWeAre,
    body: [
      "“Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.” (2 Corinthians 9:7)",
      "This verse sits at the center of WHHF's approach to giving, not as decoration, but as a working principle. Generosity, in this understanding, is not owed reluctantly or performed for recognition. It is offered cheerfully, because it reflects a character already at work in the giver.",
      "That conviction runs through the All Christians Fellowship Mission community WHHF operates within, and it shapes how the Foundation treats every patient it supports: not as a case number, but as a person worth the same dignity and care any of us would want for our own family.",
      "Faith, expressed this way, is not separate from practical action. It is what makes the action possible in the first place. Every grant paid toward a patient's treatment is, in a very direct sense, that faith put to work."
    ]
  },
  {
    slug: "inside-the-national-hospital-partnership",
    title: "Inside Our Partnership with National Hospital, Abuja",
    excerpt:
      "Distributions don't happen in isolation. They depend on a working relationship with the hospital treating each patient.",
    category: "Programmes",
    date: "2026-05-14",
    readTime: "4 min read",
    image: placeholderImages.programmeFlagship,
    body: [
      "WHHF's flagship programme, direct grants toward chemotherapy and treatment costs for indigent cancer patients, is carried out in partnership with National Hospital, Abuja, where the Foundation's distributions have taken place.",
      "A hospital partnership matters because it grounds every grant in real clinical need. Rather than WHHF independently assessing who qualifies for support, cases are identified and confirmed alongside the medical professionals already treating each patient, keeping the process both faster and more accountable.",
      "It also means support arrives where it's needed without unnecessary friction: funds go directly toward the treatment costs a patient already has in front of them, not through a separate reimbursement process that could slow care down.",
      "As WHHF grows, this kind of grounded, hospital-linked partnership is the model the Foundation intends to build on: depth and accountability first, scale second."
    ]
  },
  {
    slug: "meet-the-people-carrying-the-legacy-forward",
    title: "Meet the People Carrying the Legacy Forward",
    excerpt:
      "Behind every grant WHHF pays out is a small board of people committed to keeping Helen's generosity alive.",
    category: "Leadership",
    date: "2026-04-22",
    readTime: "3 min read",
    image: sitePhotos.howWeWork,
    body: [
      "WHHF's board reviews every case before funds move, a deliberate choice to keep the Foundation small enough that no grant happens without real oversight.",
      "That board sits within the wider All Christians Fellowship Mission community, the same community Rev. (Mrs) Helen Titilayo Okoye and Rev. Dr. William Okoye served for years. Continuing WHHF's work is, for many of them, personal.",
      "See the full leadership page for who currently serves on the board, and what each person brings to the work of keeping this promise going.",
      "As the Foundation grows, so will this team, but the underlying commitment stays the same: verify the need, move the funds directly, and never let overhead get between a donor's gift and a patient's care."
    ]
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
