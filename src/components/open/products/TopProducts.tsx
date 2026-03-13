'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
  sold: number;
}

// Mock data - replace with API later
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Baby Stroller',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1596460107916-430662021b0e',
    rating: 4.8,
    sold: 1234
  },
  {
    id: 2,
    name: 'Baby Clothes Set',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1522771930-78848d60c6e2',
    rating: 4.6,
    sold: 2345
  },
  {
    id: 3,
    name: 'Feeding Bottle',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2449c',
    rating: 4.9,
    sold: 3456
  },
  {
    id: 4,
    name: 'Baby Crib',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
    rating: 4.7,
    sold: 789
  }
];

export default function TopProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Top Selling Products
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Most popular items loved by parents
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Wishlist Button */}
              <button className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Product Image */}
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({product.sold} sold)
                  </span>
                </div>

                {/* Price and Cart */}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  <button className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block px-8 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-gray-900 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}