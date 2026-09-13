import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { SignOutButton } from "@/components/admin/SignOutButton";
import logo from "@/assets/brand/logo.jpg";
import styles from "./admin-layout.module.css";

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

  return (
    <div>
      <header className={styles.header}>
        <div className={`container ${styles.header__inner}`}>
          <Link href="/admin/donations" className={styles.brand}>
            <Image src={logo} alt="" width={36} height={36} className={styles.brandImage} />
            <span className={styles.brandText}>WHHF Admin</span>
          </Link>
          <nav className={styles.nav} aria-label="Admin">
            <Link href="/admin/donations">Donations</Link>
          </nav>
          <SignOutButton />
        </div>
      </header>
      <main className="section container">{children}</main>
    </div>
  );
}
