'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  username: string;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '🏠' },
  { href: '/admin/students', label: 'Students', icon: '👥' },
  { href: '/admin/schedules', label: 'Schedule', icon: '📅' },
  { href: '/admin/announcements', label: 'Announcements', icon: '📢' },
  { href: '/admin/activities', label: 'Activities', icon: '🎯' },
];

export default function AdminSidebar({ username }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <aside
      className={`${collapsed ? 'w-16' : 'w-64'} bg-[#1e3a8a] text-white flex flex-col transition-all duration-300 sticky top-0 h-screen`}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-lg">🎓</span>
        </div>
        {!collapsed && (
          <div>
            <div className="font-bold text-sm font-display">SCHOOL APP</div>
            <div className="text-xs text-blue-300">Admin Panel</div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-white/60 hover:text-white transition"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {!collapsed && (
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider px-3 mb-2 mt-1">
            ADMIN MENU
          </p>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive ? 'bg-white/20 text-white border-l-2 border-white' : 'text-blue-200 hover:text-white hover:bg-white/10'}`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
              {username[0]?.toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-semibold">{username}</div>
              <div className="text-xs text-blue-300">Administrator</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:text-white hover:bg-red-500/30 transition"
        >
          <span className="text-lg flex-shrink-0">🚪</span>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}
