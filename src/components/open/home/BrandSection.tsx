// components/brands/BrandSection.tsx
import { BrandCard } from "../brands/BrandCard";
import { Brand } from "@/types/open/brand.type";

interface brands{
    brands: Brand[];
}


export async function BrandSection({brands }: brands) {


    if (!brands.length) {
        return null;
    }

    return (
        <section className="max-w-primary mx-auto py-12">
           
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {brands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} />
                ))}
            </div>
        </section>
    );
}

