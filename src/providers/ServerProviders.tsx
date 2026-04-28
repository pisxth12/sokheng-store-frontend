import { getUserProfile } from "@/lib/services/user.server";
import ClientProviders from "./ClientProviders";
import { getCartCountForUser } from "@/lib/services/cart.server";

export default async function ServerProviders({
  children,
}: {
  children: React.ReactNode;
}) {

  const initialUser = await getUserProfile();
  const initialCount = await getCartCountForUser();

  return (
    <ClientProviders initialCount={initialCount} initialUser={initialUser}>
      {children}
    </ClientProviders>
  );
}
