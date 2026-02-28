import { redirect } from 'next/navigation';
import { getAuthFromCookies } from '@/lib/auth';

export default function WaliKelasLayout({ children }: { children: React.ReactNode }) {
  const auth = getAuthFromCookies();

  if (!auth) redirect('/login');
  if (auth.role !== 'wali_kelas') redirect('/login');

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Navbar */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            🏫
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-sm">Portal Wali Kelas</h1>
            <p className="text-xs text-slate-400">{auth.username}</p>
          </div>
        </div>
        <form action="/api/auth/logout" method="POST">
          <a href="/api/auth/logout-get" className="text-sm text-slate-500 hover:text-red-500 transition">
            Keluar →
          </a>
        </form>
      </header>
      <main className="max-w-4xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
