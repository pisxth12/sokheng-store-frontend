// components/brands/BrandCard.tsx
'use client';

import { memo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Brand } from '@/types/open/brand.type';
import './BrandCard.css';

interface BrandCardProps {
  brand: Brand;
}

export const BrandCard = memo(function BrandCard({ brand }: BrandCardProps) {
  const [imgError, setImgError]   = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const src = imgError
    ? '/placeholder-brand.jpg'
    : (brand.logoUrl || '/placeholder-brand.jpg');

  return (
    <Link
      href={`/${brand.slug}`}
      prefetch={false}
      className="brand-card"
    >
      {/* Skeleton shimmer — removed once image loads */}
      {!imgLoaded && (
        <div className="brand-card__skeleton" aria-hidden="true" />
      )}

      {/* Full-bleed image */}
      <Image
        src={src}
        alt={brand.name}
        fill
        className="brand-card__img"
        style={{ opacity: imgLoaded ? 1 : 0 }}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 17vw"
        onLoad={() => setImgLoaded(true)}
        onError={() => { setImgError(true); setImgLoaded(true); }}
      />

      {/* Dark gradient scrim */}
      <div className="brand-card__overlay" aria-hidden="true" />

      {/* Hover badge */}
      <span className="brand-card__badge" aria-hidden="true">
        {brand.slug}
      </span>

      {/* Name + sub over the image */}
      <div className="brand-card__body">
        <span className="brand-card__name">{brand.name}</span>
        <span className="brand-card__sub">Browse collection</span>
      </div>
    </Link>
  );
});

BrandCard.displayName = 'BrandCard';