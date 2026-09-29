import { z } from "zod";

/**
 * Single source of truth for the interest form's category options — used
 * by the form UI (components/marketing/InterestForm), this validation
 * schema, and the admin dashboard's display (app/admin/(protected)/interest)
 * so the three can never drift out of sync.
 */
export const INTEREST_CATEGORIES = [
  {
    value: "donor",
    label: "Donor / Financial Supporter",
    description: "Contribute financially to the initiative"
  },
  { value: "volunteer", label: "Volunteer", description: "Give your time, skills, or expertise" },
  {
    value: "corporate-partner",
    label: "Corporate Partner",
    description: "Support through a company or organisation"
  },
  {
    value: "fundraising-partner",
    label: "Fundraising Partner",
    description: "Help raise funds or organise fundraising activities"
  },
  {
    value: "in-kind-donor",
    label: "In-Kind Donor",
    description: "Provide goods, services, equipment, or other resources"
  },
  {
    value: "medical-professional",
    label: "Medical / Healthcare Professional",
    description: "Contribute professional expertise or services"
  },
  {
    value: "community-ambassador",
    label: "Community Ambassador",
    description: "Help spread awareness and encourage others to participate"
  },
  {
    value: "media-partner",
    label: "Media / Communications Partner",
    description: "Support with publicity, content, media, or storytelling"
  },
  {
    value: "event-partner",
    label: "Event / Programme Partner",
    description: "Support or collaborate on activities for cancer patients"
  },
  { value: "other", label: "Other", description: "I'd like to discuss another way to help" }
] as const;

export type InterestCategory = (typeof INTEREST_CATEGORIES)[number]["value"];

const CATEGORY_VALUES = INTEREST_CATEGORIES.map((c) => c.value) as [InterestCategory, ...InterestCategory[]];

export function interestCategoryLabel(value: string): string {
  return INTEREST_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

/**
 * Shared between the /interest form (client) and POST /api/interest
 * (server) — same split as lib/validation/contact.ts.
 */
export const createInterestSubmissionSchema = z
  .object({
    name: z.string().min(2).max(120),
    phone: z.string().min(7).max(20),
    email: z.string().email(),
    category: z.enum(CATEGORY_VALUES),
    otherDetails: z.string().max(1000).optional()
  })
  .refine((data) => data.category !== "other" || (data.otherDetails?.trim().length ?? 0) > 0, {
    message: "Tell us a little about how you'd like to help.",
    path: ["otherDetails"]
  });

export type CreateInterestSubmissionInput = z.infer<typeof createInterestSubmissionSchema>;
