import { publicProductApi } from "@/lib/open/products";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/lib/services/brand.server";
import { getTopCategoryBySlug } from "@/lib/services/category.server";
import { getCategoriesByBrand } from "@/lib/services/category.server";
import { getBrandsByCategory } from "@/lib/services/brand.server";
import BrandClient from "./BrandClient";
import CategoryClient from "./CategoryClient";

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    sortBy?: string;
    sortOrder?: string;
    minPrice?: string;
    maxPrice?: string;
    categoryId?: string;
    brandId?: string;
  }>;
}


export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const search = await searchParams;

  const page = parseInt(search.page || "0");
  const sortBy = search.sortBy || "createdAt";
  const sortOrder = search.sortOrder || "desc";
  const minPrice = search.minPrice ? Number(search.minPrice) : undefined;
  const maxPrice = search.maxPrice ? Number(search.maxPrice) : undefined;

  const brand = await getBrandBySlug(slug);
  if (brand) {
    const categoryId = search.categoryId ? Number(search.categoryId) : undefined;
    
   const data = await publicProductApi.getProductsByBrandWithFilters(
  slug,
  {
    page,
    size: 32,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    categoryId,
  }
);

    
    const categories = await getCategoriesByBrand(brand.id);
    
    return (
      <BrandClient
        brand={brand}
        initialData={data}
        initialFilters={{
          sortBy, sortOrder,
          minPrice: minPrice?.toString() || "",
          maxPrice: maxPrice?.toString() || "",
          categoryId: categoryId?.toString() || "",
          brandId: "",
        }}
        categories={categories}
      />
    );
  }

  const category = await getTopCategoryBySlug(slug);
  if (category) {
    const brandId = search.brandId ? Number(search.brandId) : undefined;
    
   const data = await publicProductApi.getProductsByCategoryWithFilters(
  slug,
  {
    page,
    size: 32,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    brandId,
  }
);
    
    const brands = await getBrandsByCategory(category.id);
    
    return (
      <CategoryClient
        category={category}
        initialData={data}
        initialFilters={{
          sortBy, sortOrder,
          minPrice: minPrice?.toString() || "",
          maxPrice: maxPrice?.toString() || "",
          brandId: brandId?.toString() || "",
          categoryId: "",
        }}
        brands={brands}
      />
    );
  }

  notFound();
}