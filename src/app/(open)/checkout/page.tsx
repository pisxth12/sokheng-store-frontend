// app/(open)/checkout/page.tsx (Server Component)
import { cookies } from "next/headers";
import { getUserProfile } from "@/lib/services/user.server";
import { getServerCart } from "@/lib/services/cart.server";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const sessionId = cookieStore.get("cartSessionId")?.value;

  const user = await getUserProfile(token);
  const cart = await getServerCart(sessionId);

  if (!user) {
    redirect("/checkout/guest");
  }
  if (!cart) {
    redirect("/cart");
  }

  return <CheckoutClient initialUser={user} cart={cart} />;
}
