import Footer from "@/components/open/layouts/Footer";
import HeaderServer from "@/components/open/layouts/header/HeaderServer";
import type { Metadata } from "next";

import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Vanessa Baby Shop",
  description: "Your one-stop shop for baby products",
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeaderServer />
      {/* Main Content */}
      <main className="">{children}</main>
      {/* Public Footer */}
      <Footer />
    </>
  );
}
