import HeroBanner from "@/components/open/banners/HeroBanner";
import { TopCategories } from "@/components/open/home/topCategories";
import FeaturedPage from "@/components/open/home/featuredProducts";
import { getBanners } from "@/lib/services/banner.server";
import { getTopCategories } from "@/lib/services/category.server";
import { getFeaturedProducts } from "@/lib/services/product.server";
import { BrandSection } from "@/components/open/home/BrandSection";
import { getBrands } from "@/lib/services/brand.server";
export default async function HomePage() {
  const [banners, categories, featured , brands] = await Promise.all([
    getBanners(),
    getTopCategories(8),
    getFeaturedProducts(),
    getBrands(8),
  ]);
  return (
    <div className="m-w-primary">
      <HeroBanner banners={banners} />
      <TopCategories categories={categories} />
      <BrandSection brands={brands} />
      <FeaturedPage products={featured} />
    </div>
  );
}
