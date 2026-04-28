import React from "react";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import ServerProviders from "@/providers/ServerProviders";

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
         <React.StrictMode>
          <NextIntlClientProvider locale="en">
            <ServerProviders>{children}</ServerProviders>
          </NextIntlClientProvider>
        </React.StrictMode>
      </body>
    </html>
  );
}
