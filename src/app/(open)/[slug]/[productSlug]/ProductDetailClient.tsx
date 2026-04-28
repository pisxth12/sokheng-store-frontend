// app/products/[productSlug]/ProductDetailClient.tsx
"use client";

import { useCallback, useState } from "react";
import {
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Tag,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import WishlistButton from "@/components/open/wishlists/WishlistButton";
import toast from "react-hot-toast";
import ImageModal from "@/components/ui/productImageModal";
import { ProductDetail } from "@/types/open/product.type";
import "./ProductDetailClient.css";
import { addToCart } from "../../actions/cart.actions";
import { CartResponse } from "@/types/open/cart.type";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x600/e2e8f0/1e293b?text=No+Image";

interface ProductDetailClientProps {
  product: ProductDetail;
  initialIsInWishlist: boolean;
  children?: React.ReactNode;
}

export default function ProductDetailClient({
  product,
  children,
  initialIsInWishlist = false,
}: ProductDetailClientProps) {
  const t = useTranslations("ProductDetail");
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [cart, setCart] = useState<CartResponse | null>(null);

  const getItemQuantity = useCallback(
    (productId: number) => {
      if (!cart) return 0;
      const item = cart.items.find((i) => i.productId === productId);
      return item?.quantity ?? 0;
    },
    [cart],
  );

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      if (!product) return;
      try {
        const updatedCart = await addToCart(product.id, quantity);
        setCart(updatedCart);
      } catch {
        toast.error("Could not add to cart");
      }
    },
    [addToCart, product?.id, quantity],
  );

  const currentInCart = getItemQuantity(product.id);
  const availableStock = Math.max(0, product.stock - currentInCart);
  const isOutOfStock = availableStock <= 0;

  const allImages = product.images?.map((img) => img.imageUrl) || [];
  if (product.mainImage && !allImages.includes(product.mainImage)) {
    allImages.unshift(product.mainImage);
  }

  const mainImageSrc = imageErrors["main"]
    ? PLACEHOLDER_IMAGE
    : allImages[selectedImage] || product.mainImage || PLACEHOLDER_IMAGE;

  const discountPercent =
    product.isOnSale && product.salePrice
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : 0;

  return (
    <div className="pd-page  px-primary! dark:bg-[#0f0f0e]">
      <div className="container mx-auto px-primary lg:px-8">
        {/* Breadcrumb */}
        <nav className="pd-breadcrumb">
          <Link href="/">{t("breadcrumb.home")}</Link>
          <span className="pd-breadcrumb-sep">/</span>
          <Link href="/products">{t("breadcrumb.products")}</Link>
          <span className="pd-breadcrumb-sep">/</span>
          <span className="pd-breadcrumb-current">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="pd-grid">
          {/* Gallery Column */}
          <div className="pd-gallery">
            <div className="pd-main-image-wrap cursor-zoom-in">
              <img
                src={mainImageSrc}
                onClick={() => {
                  setModalImageIndex(selectedImage);
                  setIsModalOpen(true);
                }}
                alt={product.name}
                onError={() =>
                  setImageErrors((prev) => ({ ...prev, main: true }))
                }
              />

              {discountPercent > 0 && (
                <span className="pd-badge-sale">−{discountPercent}%</span>
              )}

              {allImages.length > 1 && (
                <>
                  <button
                    className="pd-nav-btn pd-nav-btn--prev"
                    onClick={() =>
                      setSelectedImage((p) =>
                        p === 0 ? allImages.length - 1 : p - 1,
                      )
                    }
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    className="pd-nav-btn pd-nav-btn--next"
                    onClick={() =>
                      setSelectedImage((p) =>
                        p === allImages.length - 1 ? 0 : p + 1,
                      )
                    }
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="pd-thumbs">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`pd-thumb-btn ${selectedImage === idx ? "pd-thumb-btn--active" : ""}`}
                    onClick={() => setSelectedImage(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <img
                      src={
                        imageErrors[`thumb-${idx}`] ? PLACEHOLDER_IMAGE : img
                      }
                      alt={`${product.name} ${idx + 1}`}
                      onError={() =>
                        setImageErrors((prev) => ({
                          ...prev,
                          [`thumb-${idx}`]: true,
                        }))
                      }
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Column */}
          <div className="pd-info">
            <span className="pd-category-tag">{product.categoryName}</span>
            {product.brandName && (
              <span className="pd-brand-tag">{product.brandName}</span>
            )}

            <h1 className="pd-title">{product.name}</h1>
             
             <div className="flex gap-2">
              {product.hex && (
                product.hex.map((color, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center h-5 w-5 gap-1.5 px-2 py-1 rounded-lg border-2 border-slate-300"
                    style={{ backgroundColor: color }}
                  />
                ))
              )}
             </div>

            <div className="pd-divider" />

            <div className="pd-price-block">
              {product.isOnSale && product.salePrice ? (
                <>
                  <span className="pd-price-current pd-price-current--sale">
                    ${product.salePrice.toFixed(2)}
                  </span>
                  <span className="pd-price-original">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="pd-price-current">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="pd-stock">
              <span
                className={`pd-stock-dot ${
                  product.stock > 0 ? "pd-stock-dot--in" : "pd-stock-dot--out"
                }`}
              />
              <span
                className={`${
                  product.stock > 0
                    ? "pd-stock-label--in"
                    : "pd-stock-label--out"
                }`}
              >
                {product.stock > 0
                  ? t("labels.inStock", { count: product.stock })
                  : t("labels.outOfStock")}
              </span>
             
            </div>

            <div className="pd-divider" />

            {product.description && (
              <>
                <p className="pd-desc-title">{t("labels.description")}</p>
                <p className="pd-desc-body">{product.description}</p>
                <div className="pd-divider" />
              </>
            )}

            {(product.brandName || product.categoryName) && (
              <>
                <div className="pd-meta-row">
                  {product.brandName && (
                    <span className="pd-meta-chip">
                      <Tag size={11} />
                      <strong>{product.brandName}</strong>
                    </span>
                  )}
                  {product.categoryName && (
                    <span className="pd-meta-chip">
                      <Layers size={11} />
                      <strong>{product.categoryName}</strong>
                    </span>
                  )}
                </div>
                <div className="pd-divider" />
              </>
            )}

            {/* Quantity */}
            <div>
              <p className="pd-qty-label">{t("labels.quantity")}</p>
              <div className="pd-qty-control">
                <button
                  className="pd-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="pd-qty-value">{quantity}</span>
                <button
                  className="pd-qty-btn"
                  onClick={() =>
                    setQuantity((q) => Math.min(availableStock, q + 1))
                  }
                  disabled={quantity >= availableStock || isOutOfStock}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA Row */}
            <div className="pd-cta-row">
              <button
                className="pd-btn-cart"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart size={16} />
                {isOutOfStock ? t("labels.outOfStock") : t("labels.addToCart")}
              </button>

              <button className="pd-btn-wish" aria-label="Wishlist">
                <WishlistButton
                  productId={product.id}
                  initialIsInWishlist={initialIsInWishlist}
                />
              </button>
            </div>

            {product.sku && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    CODE:
                  </span>
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
                    {product.sku}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {product && <div className="pd-related-wrap">{children}</div>}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={allImages}
        currentIndex={modalImageIndex}
        onIndexChange={setModalImageIndex}
      />
    </div>
  );
}
