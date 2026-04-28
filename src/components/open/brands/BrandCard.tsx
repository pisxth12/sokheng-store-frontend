'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Brand } from '@/types/open/brand.type';
import styles from './BrandCard.module.css';

interface BrandCardProps {
  brand: Brand;
  wasDragging?: React.RefObject<boolean>;
}

export const BrandCard = memo(function BrandCard({ brand, wasDragging }: BrandCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const src = imgError
    ? '/placeholder-brand.jpg'
    : (brand.logoUrl || '/placeholder-brand.jpg');

  return (
    <Link
      href={`/${brand.slug}`}
      prefetch={false}
      className={styles['brand-card']}
      draggable={false}
      onClick={(e) => {
        if (wasDragging?.current) {
          e.preventDefault();
        }
      }}
    >
      {!imgLoaded && (
        <div className={styles['brand-card__skeleton']} aria-hidden="true" />
      )}

      <Image
        src={src}
        alt={brand.name}
        fill
        className={styles['brand-card__img']}
        style={{ opacity: imgLoaded ? 1 : 0 }}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
        onLoad={() => setImgLoaded(true)}
        onError={() => { setImgError(true); setImgLoaded(true); }}
        draggable={false}
      />

      <div className={styles['brand-card__overlay']} aria-hidden="true" />

      <span className={styles['brand-card__badge']} aria-hidden="true">
        {brand.slug}
      </span>
    </Link>
  );
});

BrandCard.displayName = 'BrandCard';