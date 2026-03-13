import HeroBanner from "@/components/open/banners/HeroBanner";
import { TopCategories } from "@/components/open/home/topCategories";
import FeaturedPage from "@/components/open/home/featuredProducts";
export default async function HomePage() {

  return (
    <div className="m-w-primary">
      <HeroBanner />
      <TopCategories/>
      <FeaturedPage/>
    </div>
  );
}
