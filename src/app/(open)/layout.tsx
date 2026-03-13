import Footer from '@/components/open/layouts/Footer';
import Header from '@/components/open/layouts/header';
import { Search, ShoppingCart, User } from 'lucide-react';
import type { Metadata } from 'next';

import { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'Vanessa Baby Shop',
  description: 'Your one-stop shop for baby products',
};

export default function PublicLayout({children,}: {children: ReactNode}){

    return (
    <>
      <Header/>      
      {/* Main Content */}
      <main className=''>
        {children}
      </main>
      {/* Public Footer */}
      <Footer/>
      
    </>
  );

}