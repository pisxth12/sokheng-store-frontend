// app/products/[productSlug]/page.tsx (Server Component)
import { getProductBySlug } from "@/lib/services/product.server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";
import RelatedProductsSection from "./RelatedProductsSection";
import "./RelatedProductsClient.css";

interface ProductPageProps {
  params: Promise<{
    productSlug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);

  if (!product) {
    notFound();
  }

  return (
     <ProductDetailClient product={product}>
      <RelatedProductsSection productId={product.id} />
    </ProductDetailClient>
  )
}