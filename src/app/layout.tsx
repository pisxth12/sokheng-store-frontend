  
import React from 'react';
import './globals.css';
import {NextIntlClientProvider} from 'next-intl';
import { ThemeProvider } from '../context/ThemeProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider } from '@/providers/AppProvider';
 
type Props = {
  children: React.ReactNode;
};
 
export default async function RootLayout({children}: Props) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}