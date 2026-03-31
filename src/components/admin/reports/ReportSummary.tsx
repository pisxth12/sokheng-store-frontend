'use client';

interface Props {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  averageOrderValue: number;
}

const cards = (props: Props) => [
  { label: 'Total Revenue', value: `$${props.totalRevenue.toFixed(2)}`, chip: 'USD',      color: 'blue'   },
  { label: 'Total Orders',  value: props.totalOrders.toString(),        chip: 'orders',   color: 'green'  },
  { label: 'Total Users',   value: props.totalUsers.toString(),         chip: 'accounts', color: 'purple' },
  { label: 'Avg Order',     value: `$${props.averageOrderValue.toFixed(2)}`, chip: 'per order', color: 'orange' },
];

const colorMap: Record<string, { bar: string; dot: string; border: string; value: string }> = {
  blue:   { bar: 'bg-blue-500',   dot: 'bg-blue-500',   border: 'border-blue-100',   value: 'text-blue-700'   },
  green:  { bar: 'bg-green-500',  dot: 'bg-green-500',  border: 'border-green-100',  value: 'text-green-800'  },
  purple: { bar: 'bg-purple-500', dot: 'bg-purple-500', border: 'border-purple-100', value: 'text-purple-800' },
  orange: { bar: 'bg-orange-500', dot: 'bg-orange-500', border: 'border-orange-100', value: 'text-orange-700' },
};

export default function ReportSummary(props: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ">
      {cards(props).map(({ label, value, chip, color }) => {
        const c = colorMap[color];
        return (
          <div
            key={label}
            className={`relative bg-white rounded-2xl pt-7 pb-6 px-6 border-[1.5px] ${c.border} overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200`}
          >
            {/* top bar */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] ${c.bar}`} />

            <span className={`block w-2 h-2 rounded-full ${c.dot} mb-3`} />
            <span className="block text-[10px] tracking-widest uppercase text-gray-400 mb-1 font-medium">
              {label}
            </span>
            <span className={`block text-4xl font-extrabold tracking-tight leading-none ${c.value}`}>
              {value}
            </span>

            <span className="absolute bottom-4 right-5 text-[9px] tracking-widest uppercase text-gray-300 font-medium">
              {chip}
            </span>
          </div>
        );
      })}
    </div>
  );
}