import { NextRequest, NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { withDb } from "@/lib/db/client";
import { donations } from "@/lib/db/schema";

/**
 * See security.md: "Any admin export of donor data must be behind
 * authentication, and should log who exported what and when." This route
 * checks the session directly (not just relying on the page-level guard,
 * since API routes are independently reachable) and writes an audit log
 * line before streaming the CSV.
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const rowsData = await withDb((db) =>
    db.query.donations.findMany({
      with: { donor: true, cause: true },
      orderBy: [desc(donations.createdAt)]
    })
  );

  // Audit trail: who exported, when, how many rows. Kept minimal and
  // append-only — do not let this write block the export on failure, but
  // do log if it fails so a missing audit trail is at least visible in
  // server logs.
  console.info(
    `[admin export] adminUserId=${session.adminUserId} rows=${rowsData.length} at=${new Date().toISOString()}`
  );

  const header = ["Date", "Donor Name", "Donor Email", "Cause", "Amount", "Currency", "Status", "Provider", "Reference"];
  const rows = rowsData.map((d) => [
    d.createdAt.toISOString(),
    d.donor.name,
    d.donor.email,
    d.cause.name,
    (d.amount / 100).toString(),
    d.currency,
    d.status,
    d.provider,
    d.providerReference
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="whhf-donations-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
