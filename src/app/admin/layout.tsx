
import { cookies } from 'next/headers';
import { getUserProfile } from '@/lib/services/user.server';
import AdminClient from './AdminClient';
import ClientProviders from '@/providers/ClientProviders';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const initialUser = await getUserProfile(token);

 return (
    <ClientProviders initialUser={initialUser}>
      <AdminClient >{children}</AdminClient>
    </ClientProviders>
  );
}