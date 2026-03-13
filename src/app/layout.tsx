import React from "react";
import "./globals.css";
import { AppProvider } from "@/providers/AppProvider";
import { NextIntlClientProvider } from "next-intl";

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale="en">
          <AppProvider>{children}</AppProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
