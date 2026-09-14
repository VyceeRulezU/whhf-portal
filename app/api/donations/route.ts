import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { createDonationSchema } from "@/lib/validation/donation";
import { withDb } from "@/lib/db/client";
import { causes, donors, donations } from "@/lib/db/schema";
import { selectProvider } from "@/lib/payments/router";

/**
 * Creates a pending Donation row and initializes a charge with the routed
 * payment provider. See architecture.md ("Data flow: a donation, end to
 * end") — this route does NOT mark anything as succeeded; that only
 * happens after webhook + server-to-server verification.
 * See .agent/skills/api-route-scaffolder/skill.md for the pattern this follows.
 */
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = createDonationSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "invalid_input", message: parsed.error.message } },
      { status: 400 }
    );
  }

  const input = parsed.data;

  try {
    const result = await withDb(async (db) => {
      const cause = await db.query.causes.findFirst({ where: eq(causes.slug, input.causeSlug) });
      if (!cause) {
        return { error: "unknown_cause" as const };
      }

      const [donor] = await db
        .insert(donors)
        .values({
          name: input.donor.name,
          email: input.donor.email,
          phone: input.donor.phone,
          address: input.donor.address
        })
        .returning();
      if (!donor) {
        throw new Error("insert returned no row");
      }

      const reference = `whhf_${crypto.randomUUID()}`;
      const provider = selectProvider({
        currency: input.currency,
        paymentMethod: input.paymentMethod
      });

      const [donation] = await db
        .insert(donations)
        .values({
          donorId: donor.id,
          causeId: cause.id,
          amount: input.amount,
          currency: input.currency,
          provider: provider.name,
          providerReference: reference,
          isRecurring: input.isRecurring,
          message: input.message,
          status: "pending"
        })
        .returning();
      if (!donation) {
        throw new Error("insert returned no row");
      }

      return { donation, reference, provider };
    });

    if ("error" in result) {
      return NextResponse.json(
        { error: { code: "unknown_cause", message: "That cause could not be found." } },
        { status: 400 }
      );
    }

    const { donation, reference, provider } = result;

    const charge = await provider.initialize({
      reference,
      amountSmallestUnit: input.amount,
      currency: input.currency,
      customer: { name: input.donor.name, email: input.donor.email },
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/donate/callback`
    });

    return NextResponse.json(
      { data: { donationId: donation.id, redirectUrl: charge.redirectUrl } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[api/donations] unexpected error", err);
    return NextResponse.json(
      { error: { code: "internal_error", message: "Something went wrong." } },
      { status: 500 }
    );
  }
}
