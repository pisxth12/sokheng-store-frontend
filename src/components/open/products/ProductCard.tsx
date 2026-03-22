"use client";

import { Product } from "@/types/open/product.type";
import Link from "next/link";
import { useState } from "react";
import "./ProductCard.css";

interface Props {
  product: Product;
}

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x600/e2e8f0/1e293b?text=No+Image";

export default function ProductCard({ product }: Props) {
  const [imageError, setImageError] = useState(false);

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
      className="pc-link"
    >
      <div className={`pc-wrap ${hasSecondImage ? "" : "pc-wrap--single"}`}>

        {/* ── Image ── */}
        <div className="pc-image-wrap">

          {/* Main image */}
          <img
            src={mainImageSrc}
            alt={product.name}
            className="pc-img pc-img--main"
            onError={() => setImageError(true)}
          />

          {/* Alternate image */}
          {hasSecondImage && secondImage && (
            <img
              src={secondImage}
              alt={`${product.name} — alternate view`}
              className="pc-img pc-img--alt"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}

          {/* Sale badge */}
          {discountLabel && (
            <span className="pc-badge-sale">{discountLabel}</span>
          )}

          {/* Out of stock badge */}
          {product.stock === 0 && (
            <span className="pc-badge-oos">Out of stock</span>
          )}

          {/* Hover overlay */}
          <div className="pc-overlay">
            <span className="pc-quick-view">View product</span>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="pc-info">
          <p className="pc-category">{product.categoryName}</p>

          <h3 className="pc-name">{product.name}</h3>

          <div className="pc-price-row">
            {product.stock > 0 ? (
              product.isOnSale && product.salePrice ? (
                <>
                  <span className="pc-price pc-price--sale">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="pc-price-original">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="pc-price">${product.price.toFixed(2)}</span>
              )
            ) : (
              <span className="pc-oos-label">Out of stock</span>
            )}
          </div>

          {product.stock > 0 && product.stock <= 3 && (
            <p className="pc-low-stock">Only {product.stock} left</p>
          )}
        </div>

      </div>
    </Link>
  );
}