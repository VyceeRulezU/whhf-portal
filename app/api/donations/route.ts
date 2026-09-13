import { NextRequest, NextResponse } from "next/server";
import { createDonationSchema } from "@/lib/validation/donation";
import { prisma } from "@/lib/db/prisma";
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
    const cause = await prisma.cause.findUnique({ where: { slug: input.causeSlug } });
    if (!cause) {
      return NextResponse.json(
        { error: { code: "unknown_cause", message: "That cause could not be found." } },
        { status: 400 }
      );
    }

    const donor = await prisma.donor.create({
      data: {
        name: input.donor.name,
        email: input.donor.email,
        phone: input.donor.phone,
        address: input.donor.address
      }
    });

    const reference = `whhf_${crypto.randomUUID()}`;
    const provider = selectProvider({
      currency: input.currency,
      paymentMethod: input.paymentMethod
    });

    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        causeId: cause.id,
        amount: input.amount,
        currency: input.currency,
        provider: provider.name,
        providerReference: reference,
        isRecurring: input.isRecurring,
        message: input.message,
        status: "pending"
      }
    });

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
