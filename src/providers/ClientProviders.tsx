// components/providers/ClientProviders.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Your custom providers
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeProvider';
import { SearchProvider } from '@/context/SearchContext';
import WishlistProvider from '@/context/WishlistContext';
import { User } from '@/types/open/user.type';
import { ToastProvider } from '@/context/ToastContext';

export default function ClientProviders({
  children,
  initialUser =  null,
  initialCount = 0,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialCount?: number;
}) {
  const [queryClient] = useState(
    () => new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 1000 * 60 * 5,
          gcTime: 1000 * 60 * 10,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    })
  );


  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const Providers = ({ children }: { children: React.ReactNode }) => (
    <SearchProvider>
      <ThemeProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
          <AuthProvider initialUser={initialUser}>
            <WishlistProvider>
                {children}
                <Toaster position="top-right" />
            </WishlistProvider>
          </AuthProvider>
        </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </SearchProvider>
  );

  if (googleClientId) {
    return (
      <GoogleOAuthProvider clientId={googleClientId}>
        <NextIntlClientProvider locale="en">
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </GoogleOAuthProvider>
    );
  }

  return (
    <NextIntlClientProvider locale="en">
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}