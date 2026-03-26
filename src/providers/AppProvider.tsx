"use client";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import WishlistProvider from "@/context/WishlistContext";
import { getUserProfile } from "@/lib/services/user.server";

export async function  AppProvider({ children }: { children: React.ReactNode }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const initialUser = await getUserProfile();

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      }),
  );

 
  return (
    <SearchProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {googleClientId ? (
            <GoogleOAuthProvider clientId={googleClientId}>
              <AuthProvider initialUser={initialUser}>
                <WishlistProvider>  
                  <CartProvider>
                    {children}
                    <Toaster position="top-right" />
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </GoogleOAuthProvider>
          ) : (
            <AuthProvider>
              <WishlistProvider>    
                <CartProvider>
                  {children}
                  <Toaster position="top-right" />
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          )}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </SearchProvider>
  );
}