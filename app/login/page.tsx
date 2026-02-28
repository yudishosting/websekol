'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login gagal');
        setLoading(false);
        return;
      }

      if (data.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/student');
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="login-bg flex items-center justify-center relative">
      {/* Decorative shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rotate-45 rounded-lg" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full" />
      <div className="absolute bottom-32 left-32 w-24 h-24 bg-white/10 rotate-12 rounded-lg" />
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-white/10 rounded-full" />

      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3Z" fill="white"/>
              <path d="M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white font-display">SCHOOL APP</h1>
          <p className="text-blue-200 mt-1 text-sm">Sistem Informasi Kelas Digital</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Masuk ke Akun</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                required
                className="w-full bg-white/10 border border-white/30 text-white placeholder-blue-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              />
            </div>

            <div>
              <label className="block text-blue-200 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                required
                className="w-full bg-white/10 border border-white/30 text-white placeholder-blue-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/50 text-red-200 rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-blue-900 font-semibold rounded-xl px-4 py-3 mt-2 hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Memproses...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <p className="text-center text-blue-300 text-xs mt-6">
            Default admin: <span className="text-white font-mono">admin / admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
