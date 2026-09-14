import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

/**
 * Guards everything under app/admin/(protected)/**. app/admin/login lives
 * OUTSIDE this route group specifically so the login page itself isn't
 * gated behind the session check it's trying to create. See security.md
 * ("Admin auth") — fail closed: no session, no access, full stop.
 */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
