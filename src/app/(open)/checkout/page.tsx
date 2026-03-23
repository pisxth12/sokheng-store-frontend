// app/(open)/checkout/page.tsx (Server Component)
import { getUserProfile } from "@/lib/services/user.server";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";
import { getCart } from "@/lib/services/cart.server";

export default async function CheckoutPage() {
  
  const user = await getUserProfile();
  const cart = await getCart();

  if (!user) {
    redirect("/checkout/guest");
  }
  if (!cart) {
    redirect("/cart");
  }

  return <CheckoutClient initialUser={user} cart={cart} />;
}
