import { getProducts } from "@/lib/services/product.server";
import ProductsClient from "./ProductsClient";

interface ProductPageProps{
 searchParams: Promise<{
    page?: string;
    limit?: string;
  }>; 
}

export default async function ProductPage({ searchParams }: ProductPageProps){
  const params = await searchParams;
  const page = parseInt(params.page || "0");
  const limit = parseInt(params.limit || "32");


  const { products, total, hasMore} = await getProducts(page, limit);

  return (
    <ProductsClient
      initialProducts={products}
      initialTotal={total}
      initialHasMore={hasMore}
      currentPage={page}
      limit={limit}
    />
  )
  
}