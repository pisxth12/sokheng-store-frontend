import './OrderPage.css'; 
import { getOrderByNumber } from "@/lib/services/order.server";
import OrderClientPage from "./OrderClient";
interface OrderPageProps{
  searchParams: Promise<{orderID: string}>;
}

export default async function OrderPage({ searchParams }: OrderPageProps) {
  const {orderID } = await searchParams;
    if (!orderID) {
    return <div>No order ID provided</div>;
  }
  const order = await getOrderByNumber(orderID);
  return <OrderClientPage  initialOrder={order} orderNumber={orderID} />;
}
