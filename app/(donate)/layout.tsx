import { SiteHeader } from "@/components/marketing/SiteHeader";

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
    </>
  );
}
