import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountClient from "./AccountClient";
import { getOrderCount } from "@/lib/services/order.server";
import { getUserProfile } from "@/lib/services/user.server";
import { getWishlistCount } from "../actions/wishlist.actions";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const [orderCount, wishlistCount, user] = await Promise.all([
    getOrderCount(),
    getWishlistCount(),
    getUserProfile(),
  ]);

  return (
    <AccountClient
      initialUser={user}
      initialOrderCount={orderCount}
      initialWishlistCount={wishlistCount}
    />
  );
}
