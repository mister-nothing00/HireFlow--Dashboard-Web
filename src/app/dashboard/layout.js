'use client';

import { Home, Briefcase, Users, MessageSquare, MessageCircle, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Candidati', href: '/dashboard/candidates', icon: Users },
    { name: 'Matches', href: '/dashboard/matches', icon: MessageSquare },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageCircle }, 
    { name: 'Impostazioni', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
          <div className="text-3xl">🚀</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">HireFlow</h1>
            <p className="text-sm text-gray-500">Recruiter</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Company Info (bottom) */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="text-2xl">🏢</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Tech Startup Inc.
              </p>
              <p className="text-xs text-gray-500">Milano, IT</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}