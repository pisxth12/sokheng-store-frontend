"use client";
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import './Header.css';

export default function DesktopNav() {
  const t = useTranslations('DesktopNav');
  return (
    <nav className="hd-nav">
      <Link href="/products" className="hd-nav-link">{t('products')}</Link>
      <Link href="/sale"     className="hd-nav-link hd-nav-link--sale">{t('sale')}</Link>
      <Link href="/about"    className="hd-nav-link">{t('about')}</Link>
    </nav>
  );
}