import TrackOrder from '@/components/open/orders/TrackOrder';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order - Vanessa Baby Shop',
  description: 'Track your order status and details',
};

export default function TrackOrderPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <TrackOrder />
    </div>
  );
}