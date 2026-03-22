import { publicProductApi } from "@/lib/open/products";
import { notFound } from "next/navigation";
import { getBrandBySlug } from "@/lib/services/brand.server";
import { getTopCategoryBySlug } from "@/lib/services/category.server";
import BrandClientPage from "./BrandClient";
import CategoryClient from "./CategoryClient";

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = pageStr ? parseInt(pageStr) : 0;

  const brand = await getBrandBySlug(slug);
  if (brand) {
    const initialData = await publicProductApi.getProductsByBrand(
      slug,
      page,
      32,
    );
    return (
      <BrandClientPage brand={brand} slug={slug} initialData={initialData} />
    );
  }
  // Try as category
  const category = await getTopCategoryBySlug(slug);
  if (category) {
    const initialData = await publicProductApi.getProductsByCategory(
      slug,
      page,
      32,
    );
    return (
      <CategoryClient
        category={category}
        slug={slug}
        initialData={initialData}
      />
    );
  }

  notFound();
}
