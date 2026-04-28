

import { getUserProfile } from '@/lib/services/user.server';
import AdminClient from './AdminClient';
import ClientProviders from '@/providers/ClientProviders';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialUser = await getUserProfile();

 return (
    <ClientProviders initialUser={initialUser}>
      <AdminClient >{children}</AdminClient>
    </ClientProviders>
  );
}