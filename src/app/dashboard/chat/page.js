'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';

export default function ChatListPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { company } = useStore();

  useEffect(() => {
    if (company?.id) {
      fetchMatches();
    }
  }, [company?.id]);

  const fetchMatches = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          candidate:candidates(id, first_name, last_name, headline, avatar_url),
          job:jobs(id, title)
        `)
        .eq('company_id', company.id) // ✅ Dinamico
        .order('last_message_at', { ascending: false, nullsFirst: false });

      if (error) throw error;

      console.log('✅ Matches loaded:', data?.length || 0);
      setMatches(data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription
  useEffect(() => {
    if (!company?.id) return;

    const channel = supabase
      .channel('chat-list-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `company_id=eq.${company.id}`,
        },
        () => {
          console.log('🔔 Chat list update detected');
          fetchMatches();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        () => {
          console.log('🔔 New message detected');
          fetchMatches();
        }
      )
      .subscribe((status) => {
        console.log('📡 Chat list subscription:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [company?.id]);

  const filteredMatches = matches.filter(match => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const candidateName = `${match.candidate?.first_name} ${match.candidate?.last_name}`.toLowerCase();
    return candidateName.includes(searchLower) || 
           match.candidate?.headline?.toLowerCase().includes(searchLower);
  });

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ora';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays === 1) return 'Ieri';
    if (diffDays < 7) return `${diffDays}g`;
    return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <div className="sr-only">Caricamento chat...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Lista Chat */}
      <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chat</h1>
          
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cerca candidato..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Nessuna chat ancora
              </h3>
              <p className="text-gray-600 text-sm">
                I tuoi match appariranno qui. Vai a swipare i candidati!
              </p>
              <Link 
                href="/dashboard/candidates"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
              >
                Swipe Candidati
              </Link>
            </div>
          ) : (
            filteredMatches.map((match) => (
              <Link
                key={match.id}
                href={`/dashboard/chat/${match.id}`}
                className="block hover:bg-gray-50 transition border-b border-gray-100"
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                      {match.candidate?.avatar_url || '👤'}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {match.candidate?.first_name} {match.candidate?.last_name}
                        </h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {formatTime(match.last_message_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1 truncate">
                        {match.job?.title}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {match.last_message || 'Inizia una conversazione...'}
                      </p>
                    </div>

                    {/* Unread badge */}
                    {match.unread_count_company > 0 && (
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {match.unread_count_company}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Empty State - Seleziona Chat */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Seleziona una chat
          </h2>
          <p className="text-gray-600">
            Scegli un candidato dalla lista per iniziare a chattare
          </p>
        </div>
      </div>
    </div>
  );
}