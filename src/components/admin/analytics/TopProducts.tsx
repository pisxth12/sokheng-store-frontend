import { Package } from "lucide-react";
import Link from "next/link";

interface Props {
  products: Array<{
    id: number;
    name: string;
    image: string;
    sold: number;
    revenue: number;
  }>;
}

export default function TopProducts({ products }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Top Products</h3>
          <p className="text-sm text-gray-500 mt-0.5">Best selling items</p>
        </div>
        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">
          {products.length} items
        </span>
      </div>
      
      <div className="space-y-2">
        {products.map((product, index) => (
          <Link 
            key={product.id} 
            href={`/admin/products/${product.id}`}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
          >
            {/* Rank Badge */}
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium
              ${index === 0 ? 'bg-amber-50 text-amber-600' : 
                index === 1 ? 'bg-gray-50 text-gray-500' : 
                index === 2 ? 'bg-orange-50 text-orange-600' : 
                'bg-gray-50 text-gray-400'}
            `}>
              #{index + 1}
            </div>
            
            {/* Product Image */}
            <div className="relative">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-gray-100 group-hover:ring-2 group-hover:ring-gray-200 transition-all"
                />
              ) : (
                <div className="w-12 h-12 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center ring-1 ring-gray-100">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-700">
                {product.name}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                {product.sold} units sold
              </p>
            </div>
            
            {/* Revenue */}
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">
                ${product.revenue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">revenue</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}