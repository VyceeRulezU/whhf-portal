import { desc, count } from "drizzle-orm";
import { withDb } from "@/lib/db/client";
import { interestSubmissions } from "@/lib/db/schema";
import { InterestView } from "@/components/admin/InterestView";

/**
 * Read-only list of /interest form submissions (see app/(marketing)/interest
 * and app/api/interest/route.ts) — people who left their details wanting
 * to get involved. Newest first. See InterestView for the client-side
 * table + detail modal.
 */
export default async function AdminInterestPage() {
  const [submissions, totalRows] = await Promise.all([
    withDb((db) => db.query.interestSubmissions.findMany({ orderBy: [desc(interestSubmissions.createdAt)] })),
    withDb((db) => db.select({ count: count() }).from(interestSubmissions))
  ]);

  const total = totalRows[0]?.count ?? 0;

  return <InterestView submissions={submissions} total={total} />;
}
