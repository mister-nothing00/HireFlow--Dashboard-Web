
// ════════════════════════════════════
// src/app/dashboard/matches/MatchesClient.jsx
// ════════════════════════════════════
'use client';

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import { MessageCircle, User, MapPin, Briefcase, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';

const MatchCard = memo(function MatchCard({ match }) {
  const c = match.candidate;
  const initials = `${c?.first_name?.[0] || ''}${c?.last_name?.[0] || ''}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
      {/* Avatar + Nome */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {initials}
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{c?.first_name} {c?.last_name}</h3>
          <p className="text-sm text-gray-500">{c?.headline}</p>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-wrap gap-2 mb-4">
        {c?.location && (
          <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
            <MapPin size={12} /> {c.location}
          </span>
        )}
        {match.job?.title && (
          <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
            <Briefcase size={12} /> {match.job.title}
          </span>
        )}
      </div>

      {/* Skills */}
      {c?.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {c.skills.slice(0, 3).map((s, i) => (
            <span key={i} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{s}</span>
          ))}
          {c.skills.length > 3 && (
            <span className="text-xs text-gray-400">+{c.skills.length - 3}</span>
          )}
        </div>
      )}

      {/* Status badge */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          match.status === 'matched' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {match.status === 'matched' ? '🎉 Match!' : match.status}
        </span>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/candidates/${c?.id}`}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
          >
            <User size={14} /> Profilo
          </Link>
          <Link
            href={`/dashboard/chat/${match.id}`}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <MessageCircle size={14} /> Chat
          </Link>
        </div>
      </div>
    </div>
  );
});

export default function MatchesClient({ company, initialMatches }) {
  const [matches, setMatches] = useState(initialMatches);
  const [search, setSearch]   = useState('');

  // 📡 Real-time: nuovi match
  useEffect(() => {
    if (!company?.id) return;

    const channel = supabase
      .channel(`matches-realtime-${company.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'matches',
        filter: `company_id=eq.${company.id}`,
      }, async (payload) => {
        // Fetch il match completo con join
        const { data } = await supabase
          .from('matches')
          .select(`*, candidate:candidates(*), job:jobs(id, title, location)`)
          .eq('id', payload.new.id)
          .single();

        if (data) {
          setMatches(prev => [data, ...prev]);
          showToast.success('🎉 Nuovo match!');
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [company?.id]);

  const filtered = useMemo(() => {
    if (!search) return matches;
    const q = search.toLowerCase();
    return matches.filter(m => {
      const name = `${m.candidate?.first_name} ${m.candidate?.last_name}`.toLowerCase();
      return name.includes(q) || m.candidate?.headline?.toLowerCase().includes(q);
    });
  }, [matches, search]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">I Tuoi Match</h1>
        <p className="text-gray-600">{matches.length} match{matches.length !== 1 ? 's' : ''} totali</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Cerca per nome o ruolo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">{search ? '🔍' : '💔'}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {search ? 'Nessun risultato' : 'Ancora nessun match'}
          </h3>
          <p className="text-gray-500">
            {search ? 'Prova un altro termine' : 'Inizia a swipare i candidati!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(m => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}