"use client"
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function DesktopNav() {
  const t = useTranslations('DesktopNav');
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <Link href="/products" className="transition">
        {t('products')}
      </Link>
      <Link href="/sale" className="font-medium transition">
        {t('sale')}
      </Link>
      <Link href="/about" className="transition">
        {t('about')}
      </Link>
    </nav>
  );
}