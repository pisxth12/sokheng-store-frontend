// app/products/[productSlug]/page.tsx (Server Component)
import { getProductBySlug } from "@/lib/services/product.server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import RelatedProductsSection from "./RelatedProductsSection";
import "./RelatedProductsClient.css";
import { getWishlist } from "../../actions/wishlist.actions";

interface ProductPageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
   const wishlist = await getWishlist();


  const isInWishlist = wishlist?.items?.some(item => item.productId === product?.id) || false;
  

  if (!product) {
    notFound();
  }

  return (
     <ProductDetailClient product={product}  initialIsInWishlist={isInWishlist} >
      <RelatedProductsSection productId={product.id} />
    </ProductDetailClient>
  )
}