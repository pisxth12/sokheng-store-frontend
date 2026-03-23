// // components/RelatedProducts.server.tsx
// import { getRelatedProducts } from "@/lib/services/product.server";
// import RelatedProductsClient from "./RelatedProductsClient";

// interface RelatedProductsServerProps {
//   productId: number;
//   initialSize?: number;
// }

// export default async function RelatedProductsServer({
//   productId,
//   initialSize = 8,
// }: RelatedProductsServerProps) {
//   const { products, total, hasMore } = await getRelatedProducts(
//     productId,
//     0,
//     initialSize
//   );

//   if (products.length === 0) {
//     return null;
//   }

//   return (
//     <RelatedProductsClient
//       initialProducts={products}
//       initialTotal={total}
//       initialHasMore={hasMore}
//       productId={productId}
//       pageSize={initialSize}
//     />
//   );
// }