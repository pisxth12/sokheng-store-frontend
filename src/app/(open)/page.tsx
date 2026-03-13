
import HeroBanner from "@/components/open/banners/HeroBanner";
import { getTranslations } from "next-intl/server";
import { FeaturedPage } from "./featured/page";
import Newsletter from "@/components/open/layouts/Newsletter";
export default async function HomePage() {
//   const t = await getTranslations("HomePage");

  return (
    <div className="m-w-primary">
      <HeroBanner />
      <FeaturedPage />
    </div>
  );
}
