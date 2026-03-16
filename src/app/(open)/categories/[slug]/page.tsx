
import { publicProductApi } from "@/lib/open/products";
import CategoryClient from "./CategoryClient";
import { notFound } from "next/navigation";
import { getTopCategoryBySlug } from "@/lib/services/category.server";

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params; 
  const { page: pageStr } = await searchParams; 

  const page = pageStr ? parseInt(pageStr) : 0;
  const [ category ,initialData] = await Promise.all([
    getTopCategoryBySlug(slug),
    await publicProductApi.getProductsByCategory(slug, page, 32)
  ])
   if (!category) {
    notFound();
  }


  return (
    <CategoryClient
      category={category}
      slug={slug}
      initialData={initialData}
    />
  );
}