import { publicProductApi } from "@/lib/open/products";
import { notFound } from "next/navigation";
import BrandClientPage from "./BrandClient";
import { getBrandBySlug } from "@/lib/services/brand.server";

interface PageProps {
  params: { slug: string };
  searchParams: { page?: string };
}

export default async function BrandProductsPage({ params, searchParams }: PageProps) {
    const { slug } = await params; 
  const { page: pageStr } = await searchParams; 

  const page = pageStr ? parseInt(pageStr) : 0;

  // SSR - Fetch brand and products in parallel
  const [brand, initailaData] = await Promise.all([
     getBrandBySlug(slug),
    publicProductApi.getProductsByBrand(slug, page, 32),
  ]);

  if(!brand){
    notFound();
  }

  return (
     <BrandClientPage
      brand={brand}
      slug={slug}
      initialData={initailaData}
    />
  );

}