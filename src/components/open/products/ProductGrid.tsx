"use client"
import { Product } from "@/types/open/product.type";
import ProductCard from "./ProductCard";
import { notFound } from "next/navigation";

interface Props{
    products: Product[];
}
export const ProductGrid = ({products}:Props) => {
    if (products.length === 0) {
    return (
     notFound()
    );
  }

   return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 px-primary ">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}