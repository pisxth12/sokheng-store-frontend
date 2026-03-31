// app/search/page.tsx (Server Component)
import { searchProducts } from "@/lib/services/product.server";
import SearchClient from "./SearchClient";
import { Product } from "@/types/open/product.type";
import { getCategoryNames } from "@/lib/services/category.server";
import { getBrandNames } from "@/lib/services/brand.server";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    brandId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  
  const [categories, brands] = await Promise.all([
    getCategoryNames(),
    getBrandNames()
  ]);

  const query = params.q || "";
  const page = parseInt(params.page || "0");
  const size = 32;
  
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const brandId = params.brandId ? Number(params.brandId) : undefined;
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";

  let initialProducts: Product[] = [];
  let initialTotal = 0;
  let initialHasMore = false;
  let priceRange = { min: 0, max: 1000 };

  if (query) {
    const result = await searchProducts(
      query, 
      page, 
      size,
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      categoryId,
      brandId
    );
    initialProducts = result.items;
    initialTotal = result.pagination.total;
    initialHasMore = result.pagination.hasMore;
    priceRange = {
      min: result.filters.minPrice,
      max: result.filters.maxPrice
    };
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
        brandId: brandId?.toString() || "",
        sortBy,
        sortOrder,
      }}
      priceRange={priceRange}
      categories={categories}
      brands={brands}
    />
  );
}