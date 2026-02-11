'use client';

import { useEffect, useState } from 'react';
import { Home, Briefcase, Users, MessageSquare, MessageCircle, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';
import { useStore } from '@/lib/store';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const { logout, user, company } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const navigation = [
    { name: 'Home', href: '/dashboard', icon: Home },
    { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Candidati', href: '/dashboard/candidates', icon: Users },
    { name: 'Matches', href: '/dashboard/matches', icon: MessageSquare },
    { name: 'Chat', href: '/dashboard/chat', icon: MessageCircle },
    { name: 'Impostazioni', href: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  // 🔔 Conta messaggi non letti + realtime notification
  useEffect(() => {
    if (!company?.id) return;

    const fetchUnread = async () => {
      try {
        // Prendi tutti i match della company
        const { data: matches } = await supabase
          .from('matches')
          .select('id')
          .eq('company_id', company.id);

        if (!matches?.length) return;

        const matchIds = matches.map((m) => m.id);

        // Conta messaggi non letti (non inviati dalla company)
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .in('match_id', matchIds)
          .neq('sender_id', company.id)
          .is('read_at', null);

        setUnreadCount(count || 0);
      } catch (e) {
        console.error('❌ Error fetching unread:', e);
      }
    };

    fetchUnread();

    // Realtime: ascolta nuovi messaggi per questa company
    const channel = supabase
      .channel(`layout-messages-${company.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, async (payload) => {
        // Verifica che il messaggio sia per un match della nostra company
        const { data: match } = await supabase
          .from('matches')
          .select('id, company_id')
          .eq('id', payload.new.match_id)
          .single();

        if (match?.company_id !== company.id) return;
        if (payload.new.sender_id === company.id) return; // messaggio nostro, ignora

        // Aggiorna contatore
        setUnreadCount((prev) => prev + 1);

        // Toast solo se non siamo già nella chat
        if (!pathname.startsWith('/dashboard/chat')) {
          showToast.info('💬 Nuovo messaggio ricevuto!');
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [company?.id, pathname]);

  // Reset unread quando entriamo nella chat
  useEffect(() => {
    if (pathname.startsWith('/dashboard/chat')) {
      setUnreadCount(0);
    }
  }, [pathname]);

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
            const isChat = item.href === '/dashboard/chat';

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
                <span className="flex-1">{item.name}</span>

                {/* 🔴 Badge unread messaggi */}
                {isChat && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Company Info */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="text-2xl">🏢</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {company?.name || 'Company'}
              </p>
              <p className="text-xs text-gray-500">
                {company?.location || 'Location'}
              </p>
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