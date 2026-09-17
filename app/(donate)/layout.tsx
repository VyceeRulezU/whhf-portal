import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";

// See the identical export in app/(marketing)/layout.tsx — SiteFooter
// reads family-editable content from the database, which forces every
// page under this layout to be dynamically rendered too.
export const dynamic = "force-dynamic";

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
