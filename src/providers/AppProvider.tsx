"use client";
import { AuthProvider } from "@/context/AuthContext";
import { SearchProvider } from "@/context/SearchContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { NextIntlClientProvider } from "next-intl";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <NextIntlClientProvider locale="en">
        <ThemeProvider>
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
           <AuthProvider>
            {children}
           </AuthProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    </SearchProvider>
  );
}
