import { redirect } from 'next/navigation';
import { getAuthFromCookies } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = getAuthFromCookies();
  
  if (!auth) redirect('/login');
  if (auth.role !== 'admin') redirect('/student');

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar username={auth.username} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
