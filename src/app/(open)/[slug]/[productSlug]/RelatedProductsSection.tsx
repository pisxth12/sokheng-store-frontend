
import { getRelatedProducts } from "@/lib/services/product.server";
import RelatedProductsClient from "./RelatedProductsClient";

interface RelatedProductsSectionProps {
  productId: number;
}

export default async function RelatedProductsSection({ productId }: RelatedProductsSectionProps) {
  const { products, total, hasMore } = await getRelatedProducts(productId, 0, 8);

  if (products.length === 0) {
    return null;
  }

  return (
      <RelatedProductsClient
      initialProducts={products}
      initialTotal={total}
      initialHasMore={hasMore}
      productId={productId}
      pageSize={8}
    />
  );
}