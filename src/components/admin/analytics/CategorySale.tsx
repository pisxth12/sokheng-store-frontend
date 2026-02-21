interface Props {
  data: Array<{
    category: string;
    sales: number;
    revenue: number;
    percentage: number;
  }>;
}

export default function CategorySales({ data }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-4">Sales by Category</h3>
      
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.category}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-700">{item.category}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">
                  ${item.revenue.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 w-12 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{item.sales} units sold</p>
          </div>
        ))}
      </div>
    </div>
  );
}