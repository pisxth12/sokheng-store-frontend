'use client';

interface Props {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  averageOrderValue: number;
}

export default function ReportSummary({ 
  totalRevenue, 
  totalOrders, 
  totalUsers, 
  averageOrderValue 
}: Props) {
  const cards = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Total Orders', value: totalOrders.toString(), bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Total Users', value: totalUsers.toString(), bg: 'bg-purple-50', text: 'text-purple-700' },
    { label: 'Avg Order', value: `$${averageOrderValue.toFixed(2)}`, bg: 'bg-orange-50', text: 'text-orange-700' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.label} className={`${card.bg} p-4 rounded-lg`}>
          <p className="text-sm text-gray-600">{card.label}</p>
          <p className={`text-xl font-bold ${card.text}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}