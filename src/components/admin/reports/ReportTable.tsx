"use client";

import { TopProduct } from "@/types/admin/report.type";

interface Props {
  products: TopProduct[];
}

export default function ReportTable({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Product
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Sold
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Revenue
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{product.name}</td>
                <td className="px-6 py-4">{product.sold}</td>
                <td className="px-6 py-4">${product.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
