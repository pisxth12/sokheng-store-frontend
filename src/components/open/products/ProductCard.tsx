"use client";

import { Product } from "@/types/open/product.type";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./ProductCard.module.css";

interface Props {
  product: Product;
  index?: number;
}

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x600/e2e8f0/1e293b?text=No+Image";

export default function ProductCard({ product, index = 0 }: Props) {
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() =>{
    const observer = new IntersectionObserver(
      ([entry]) => {
        if(entry.isIntersecting){
          setTimeout(() => {
            setIsVisible(true);
          }, index * 5); 
          observer.disconnect();
        }
      },{
        threshold: 0.15,
        rootMargin: "300px" 
      }
    );
    if(cardRef.current){
      observer.observe(cardRef.current);
    }
    return () => observer.disconnect();
  },[]);

  const hasSecondImage = product.images && product.images.length > 1;
  const secondImage = hasSecondImage
    ? product.images.find((img) => !img.isMain)?.imageUrl ||
      product.images[1]?.imageUrl
    : null;

  const mainImageSrc =
    !product.mainImage || imageError ? PLACEHOLDER_IMAGE : product.mainImage;

  const discountLabel =
    product.isOnSale && product.salePrice && product.discountPercent
      ? `−${product.discountPercent}%`
      : null;

  return (
    <Link
      href={`/${product.categorySlug}/${product.slug}`}
      className={styles['pc-link']}
    >
      <div className={`${styles['pc-wrap']} ${hasSecondImage ? "" : styles['pc-wrap--single']} ${isVisible ? styles['pc-visible'] : styles['pc-hidden']}`} ref={cardRef}>

        <div className={styles['pc-image-wrap']}>

          <img
            src={mainImageSrc}
            alt={product.name}
            loading="lazy"
            className={`${styles['pc-img']} ${styles['pc-img--main']}`}
            onError={() => setImageError(true)}
          />

          {hasSecondImage && secondImage && (
            <img
              src={secondImage}
              alt={`${product.name} — alternate view`}
              className={`${styles['pc-img']} ${styles['pc-img--alt']}`}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}

          {discountLabel && (
            <span className={styles['pc-badge-sale']}>{discountLabel}</span>
          )}

          {product.stock === 0 && (
            <span className={styles['pc-badge-oos']}>Out of stock</span>
          )}

          <div className={styles['pc-overlay']}>
            <span className={styles['pc-quick-view']}>View product</span>
          </div>
        </div>

        <div className={styles['pc-info']}>
          <p className={styles['pc-category']}>{product.categoryName}</p>

          <h3 className={styles['pc-name']+ `e`}>{product.name.length > 25 ? `${product.name.slice(0, 25)}...` : product.name}</h3>

          <div className={styles['pc-price-row']}>
            {product.stock > 0 ? (
              product.isOnSale && product.salePrice ? (
                <>
                  <span className={`${styles['pc-price']} ${styles['pc-price--sale']}`}>
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className={styles['pc-price-original']}>
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className={styles['pc-price'] + ` dark:text-gray-200/50!`}>${product.price.toFixed(2)}</span>
              )
            ) : (
              <span className={styles['pc-oos-label']}>Out of stock</span>
            )}
          </div>

          {product.stock > 0 && product.stock <= 3 && (
            <p className={styles['pc-low-stock']}>Only {product.stock} left</p>
          )}
        </div>
      </div>
    </Link>
  );
}