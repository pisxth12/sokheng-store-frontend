import { cookies } from "next/headers";
import { getUserProfile } from "@/lib/services/user.server";
import ClientProviders from "./ClientProviders";
import { getCartCountForUser } from "@/lib/services/cart.server";

export default async function ServerProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const cartSession = cookieStore.get("cartSessionId")?.value;
  const initialUser = await getUserProfile(token);
  const initialCount = await getCartCountForUser(cartSession);

  return (
    <ClientProviders initialCount={initialCount} initialUser={initialUser}>
      {children}
    </ClientProviders>
  );
}
