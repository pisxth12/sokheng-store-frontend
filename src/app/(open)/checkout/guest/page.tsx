import { getCart } from "@/lib/services/cart.server";
import { redirect } from "next/navigation";
import GuestCheckoutClient from "./GuestCheckoutClient";
import "./GuestCheckoutPage.css";

export default async function GuestCheckoutPage() {
    const cart = await getCart();
    if(!cart?.items.length){
        redirect("/cart");
    }
    return <GuestCheckoutClient initialCart={cart} />;

    
}