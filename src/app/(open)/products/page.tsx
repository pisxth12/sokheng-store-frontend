// app/products/page.tsx
import { getProductsWithFilter } from "@/lib/services/product.server";
import { FilterState } from "@/types/open/product.type";
import ProductsClient from "./ProductClient";
import { getCategoryNames } from "@/lib/services/category.server";
import { getBrandNames } from "@/lib/services/brand.server";

interface ProductPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    brandId?: string;
  }>;
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "0");
  const limit = parseInt(params.limit || "32");
  
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const brandId = params.brandId ? Number(params.brandId) : undefined;

   const [productsData, categories, brands] = await Promise.all([
    getProductsWithFilter(page, limit, {
      sortBy,
      sortOrder,
      minPrice,
      maxPrice,
      categoryId,
      brandId,
    }),
    getCategoryNames(),
    getBrandNames(),
  ]);

  const initialFilters: FilterState = {
    sortBy,
    sortOrder,
    minPrice: minPrice?.toString() || "",
    maxPrice: maxPrice?.toString() || "",
    categoryId: categoryId?.toString() || "",
    brandId: brandId?.toString() || "",
  };

  return (
    <ProductsClient
      initialProducts={productsData.items}
      initialTotal={productsData.pagination.total}
      initialHasMore={productsData.pagination.hasMore}
      currentPage={page}
      limit={limit}
      initialFilters={initialFilters}
      priceRange={{ min: productsData.filters.minPrice, max: productsData.filters.maxPrice }}
      initialCategories={categories}  
      initialBrands={brands}    
    />
  );
}