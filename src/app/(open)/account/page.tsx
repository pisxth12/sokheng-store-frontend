import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AccountClient from "./AccountClient";
import { getOrderCount } from "@/lib/services/order.server";
import { getWishlistCountForUser } from "@/lib/services/wishlist.server";
import { getUserProfile } from "@/lib/services/user.server";

export default async function AccountPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  // const sessionId = cookieStore.get('cartSessionId')?.value;

  if (!token) {
    redirect("/login");
  }

  const [orderCount, wishlistCount, user] = await Promise.all([
    getOrderCount(token),
    getWishlistCountForUser(token),
    getUserProfile(token),
  ]);

  return (
    <AccountClient
      initialUser={user}
      initialOrderCount={orderCount}
      initialWishlistCount={wishlistCount}
    />
  );
}
