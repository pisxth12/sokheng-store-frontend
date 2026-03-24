// app/search/page.tsx (Server Component)
import { searchProducts } from "@/lib/services/product.server";
import SearchClient from "./SearchClient";
import { Product } from "@/types/open/product.type";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  const query = params.q || "";
  const page = parseInt(params.page || "0");
  const size = 32;
  
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";


  let initialProducts: Product[] = [];
  let initialTotal = 0;
  let initialHasMore = false;

  if (query) {
    const result = await searchProducts(
      query, 
      page, 
      size,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      categoryId
    );
    initialProducts = result.products;
    initialTotal = result.total;
    initialHasMore = result.hasMore;
  }

  return (
    <SearchClient
      initialQuery={query}
      initialProducts={initialProducts}
      initialTotal={initialTotal}
      initialHasMore={initialHasMore}
      currentPage={page}
      limit={size}
      initialFilters={{
        minPrice: minPrice?.toString() || "",
        maxPrice: maxPrice?.toString() || "",
        categoryId: categoryId?.toString() || "",
        sortBy,
        sortOrder,
      }}
    />
  );
}