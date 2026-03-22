import Footer from "@/components/open/layouts/footer/Footer";
import HeaderServer from "@/components/open/layouts/header/HeaderServer";
import { getContactInfo } from "@/lib/services/contact.server";
import type { Metadata } from "next";

import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Vanessa Baby Shop",
  description: "Your one-stop shop for baby products",
};

export default async function PublicLayout({ children }: { children: ReactNode }) {
   const contactInfo = await getContactInfo();
  return (
    <>
      <HeaderServer />
      {/* Main Content */}
      <main className="">{children}</main>
      {/* Public Footer */}
      <Footer contactInfo={contactInfo} />
    </>
  );
}
