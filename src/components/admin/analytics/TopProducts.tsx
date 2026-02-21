import { Package } from "lucide-react";

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
    <div className="bg-white p-5 rounded-xl border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-4">Top Products</h3>
      
      <div className="space-y-3">
        {products.map((product, index) => (
          <div key={product.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-medium text-gray-600">
              #{index + 1}
            </div>
            
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
              <p className="text-xs text-gray-500">{product.sold} units sold</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">${product.revenue.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}