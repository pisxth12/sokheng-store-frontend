// components/brands/BrandSection.tsx
import { BrandCard } from "../brands/BrandCard";
import { Brand } from "@/types/open/brand.type";

interface brands{
    brands: Brand[];
}





export async function BrandSection({brands  }: brands) {


    if (!brands.length) {
        return null;
    }

    return (
        <section className="max-w-primary mx-auto py-12">
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Brand
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Shop from trusted brands
                </p>
            </div>

           
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {brands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} />
                ))}
            </div>
        </section>
    );
}

