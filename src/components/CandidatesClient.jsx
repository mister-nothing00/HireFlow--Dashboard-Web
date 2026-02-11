'use client';

import { useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { X, Heart, MapPin, Euro, Briefcase, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';
import { useApp } from '@/context/AppContext'; // ✅ Context

// ─── Candidate Card ───────────────────────────────────────────────
const CandidateCard = memo(function CandidateCard({ candidate, direction }) {
  const c = candidate;
  const initials = `${c.first_name?.[0] || ''}${c.last_name?.[0] || ''}`;

  return (
    <div className={`absolute inset-0 bg-white rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
      direction === 'left'  ? 'rotate-[-5deg] opacity-0 -translate-x-20' :
      direction === 'right' ? 'rotate-[5deg] opacity-0 translate-x-20'  : ''
    }`}>
      {/* Overlay feedback */}
      {direction === 'right' && (
        <div className="absolute top-8 left-8 z-10 rotate-[-12deg] border-4 border-green-500 text-green-500 font-black text-3xl px-4 py-2 rounded-xl">
          LIKE ❤️
        </div>
      )}
      {direction === 'left' && (
        <div className="absolute top-8 right-8 z-10 rotate-[12deg] border-4 border-red-500 text-red-500 font-black text-3xl px-4 py-2 rounded-xl">
          NOPE ✕
        </div>
      )}

      {/* Header Avatar */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
          {initials}
        </div>
        <h2 className="text-2xl font-bold">{c.first_name} {c.last_name}</h2>
        <p className="text-blue-200 mt-1">{c.headline}</p>
        {c.location && (
          <p className="flex items-center gap-1 text-blue-300 text-sm mt-2">
            <MapPin size={14} /> {c.location}
          </p>
        )}
      </div>

      {/* Body */}
      <div className="p-6 overflow-y-auto" style={{ maxHeight: '320px' }}>
        {c.bio && <p className="text-gray-600 text-sm leading-relaxed mb-4">{c.bio}</p>}

        <div className="flex flex-wrap gap-2 mb-4">
          {c.remote_preference && (
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
              {c.remote_preference === 'remote' ? '🏠 Remote' : c.remote_preference === 'hybrid' ? '🔀 Hybrid' : '🏢 On-site'}
            </span>
          )}
          {(c.salary_min || c.salary_max) && (
            <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-lg font-medium">
              <Euro size={10} className="inline" /> {c.salary_min?.toLocaleString()} – {c.salary_max?.toLocaleString()}
            </span>
          )}
          {c.experience_years && (
            <span className="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded-lg font-medium">
              <Briefcase size={10} className="inline" /> {c.experience_years}y exp
            </span>
          )}
        </div>

        {c.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {c.skills.slice(0, 6).map((s, i) => (
              <span key={i} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{s}</span>
            ))}
            {c.skills.length > 6 && <span className="text-xs text-gray-400">+{c.skills.length - 6}</span>}
          </div>
        )}
      </div>

      {/* Link profilo completo */}
      <div className="absolute bottom-4 right-4">
        <Link
          href={`/dashboard/candidates/${c.id}`}
          className="text-xs text-blue-600 hover:underline"
          onClick={e => e.stopPropagation()}
        >
          Vedi profilo completo →
        </Link>
      </div>
    </div>
  );
});

// ─── Main ─────────────────────────────────────────────────────────
export default function CandidatesClient({ company, initialCandidates }) {
  const { candidateIndex, nextCandidate } = useApp(); // ✅ Context
  const [candidates, setCandidates] = useState(initialCandidates);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentCandidate = candidates[candidateIndex];
  const remaining = Math.max(0, candidates.length - candidateIndex);

  const handleSwipe = useCallback(async (direction) => {
    if (!currentCandidate || loading || !company?.id) return;

    setSwipeDirection(direction);
    setLoading(true);

    try {
      const { error } = await supabase.from('company_swipes').insert([{
        candidate_id: currentCandidate.id,
        company_id: company.id,
        direction,
        job_id: null,
      }]);

      if (error && error.code !== '23505') {
        console.error('❌ Swipe error:', error);
      }

      if (direction === 'right') {
        await checkMatch(currentCandidate.id);
      }
    } catch (err) {
      console.error('❌ handleSwipe error:', err);
    }

    // Animazione completata → prossimo candidato
    setTimeout(() => {
      setSwipeDirection(null);
      setLoading(false);
      nextCandidate();
    }, 350);
  }, [currentCandidate, loading, company?.id, nextCandidate]);

  const checkMatch = useCallback(async (candidateId) => {
    try {
      // Controlla se candidato ha swipato right su un job della company
      const { data } = await supabase
        .from('swipes')
        .select('job_id, job:jobs!inner(id, company_id)')
        .eq('candidate_id', candidateId)
        .eq('direction', 'right')
        .eq('job.company_id', company.id)
        .limit(1);

      if (!data?.length) return;

      const { error } = await supabase.from('matches').insert({
        candidate_id: candidateId,
        job_id: data[0].job_id,
        company_id: company.id,
        status: 'matched',
      });

      if (!error || error.code === '23505') {
        showToast.success('🎉 È un MATCH!');
      }
    } catch (e) {
      console.error('❌ checkMatch error:', e);
    }
  }, [company?.id]);

  if (!currentCandidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hai visto tutti i candidati!</h2>
          <p className="text-gray-500 mb-6">Torna più tardi per nuovi profili</p>
          <Link href="/dashboard/matches" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold">
            Vedi i tuoi match
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Scopri Candidati</h1>
            <p className="text-gray-500 text-sm mt-1">{remaining} profili disponibili</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm text-sm">
            <span className="text-gray-400 text-xs block">Swipe come</span>
            <span className="font-bold text-gray-900">{company?.name}</span>
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative" style={{ height: '580px' }}>
          {/* Card successiva (stacked sotto) */}
          {candidates[candidateIndex + 1] && (
            <div className="absolute inset-0 bg-white rounded-2xl shadow-lg scale-95 translate-y-2 opacity-60" />
          )}

          {/* Card corrente */}
          <CandidateCard candidate={currentCandidate} direction={swipeDirection} />
        </div>

        {/* Bottoni */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={() => handleSwipe('left')}
            disabled={loading}
            className="w-16 h-16 bg-white border-2 border-red-200 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:border-red-400 transition disabled:opacity-40 shadow-lg"
          >
            <X size={28} />
          </button>
          <button
            onClick={() => handleSwipe('right')}
            disabled={loading}
            className="w-16 h-16 bg-white border-2 border-green-200 rounded-full flex items-center justify-center text-green-500 hover:bg-green-50 hover:border-green-400 transition disabled:opacity-40 shadow-lg"
          >
            <Heart size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}