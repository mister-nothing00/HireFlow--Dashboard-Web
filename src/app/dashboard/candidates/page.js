'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, X, Heart, Star, MapPin, Euro, Briefcase } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeDirection, setSwipeDirection] = useState(null);

  // TODO: Replace with real company_id from auth
  const COMPANY_ID = 'cdf8c6e0-8f89-4d3f-b123-456789abcdef';

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      console.log('✅ Candidates loaded:', data?.length || 0);
      setCandidates(data || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    const currentCandidate = candidates[currentIndex];
    if (!currentCandidate) return;

    console.log(`${direction === 'right' ? '✅' : '❌'} Swipe ${direction}:`, currentCandidate.first_name);

    // Animazione swipe
    setSwipeDirection(direction);

    try {
      // Salva swipe su DB
      const { error } = await supabase
        .from('company_swipes')
        .insert([{
          job_id: null, // TODO: Collegare a job specifico
          candidate_id: currentCandidate.id,
          direction: direction === 'right' ? 'right' : 'left',
        }]);

      if (error) {
        console.error('Error saving swipe:', error);
      }

      // Se swipe right, controlla se c'è match
      if (direction === 'right') {
        await checkForMatch(currentCandidate.id);
      }

    } catch (err) {
      console.error('Swipe error:', err);
    }

    // Passa al prossimo candidato dopo animazione
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex(prev => prev + 1);
    }, 300);
  };

  const checkForMatch = async (candidateId) => {
    try {
      // Controlla se candidato ha swipato right su un nostro job
      const { data: candidateSwipes, error } = await supabase
        .from('swipes')
        .select('job_id')
        .eq('candidate_id', candidateId)
        .eq('direction', 'right');

      if (error) throw error;

      if (candidateSwipes && candidateSwipes.length > 0) {
        console.log('🎉 MATCH! Candidato ha swipato right su uno dei nostri job!');
        // TODO: Crea match nella tabella matches
        // TODO: Mostra notification
        alert('🎉 È un MATCH! Il candidato ha già swipato right su un tuo job!');
      }
    } catch (error) {
      console.error('Error checking match:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento candidati...</p>
        </div>
      </div>
    );
  }

  const currentCandidate = candidates[currentIndex];

  if (!currentCandidate) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Hai visto tutti i candidati!
          </h2>
          <p className="text-gray-600 mb-8">
            Torna più tardi per nuovi profili o rivedi i tuoi match.
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Ricomincia da Capo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Scopri Candidati
            </h1>
            <p className="text-gray-600 mt-1">
              {candidates.length - currentIndex} {candidates.length - currentIndex === 1 ? 'profilo disponibile' : 'profili disponibili'}
            </p>
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative" style={{ height: '600px' }}>
          {/* Next cards (preview) */}
          {candidates.slice(currentIndex + 1, currentIndex + 3).map((candidate, offset) => (
            <div
              key={candidate.id}
              className="absolute inset-0 bg-white rounded-2xl shadow-lg"
              style={{
                transform: `scale(${1 - (offset + 1) * 0.05}) translateY(${(offset + 1) * 10}px)`,
                zIndex: 100 - offset,
                opacity: 1 - (offset + 1) * 0.2,
              }}
            />
          ))}

          {/* Current card */}
          <div
            className={`absolute inset-0 bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
              swipeDirection === 'left' ? '-translate-x-full opacity-0' :
              swipeDirection === 'right' ? 'translate-x-full opacity-0' : ''
            }`}
            style={{ zIndex: 200 }}
          >
            <div className="h-full flex flex-col overflow-hidden">
              {/* Avatar + Header */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                    👤
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">
                      {currentCandidate.first_name} {currentCandidate.last_name}
                    </h2>
                    <p className="text-blue-100">{currentCandidate.headline}</p>
                  </div>
                </div>

                {/* Quick info */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                    <MapPin size={14} />
                    <span>{currentCandidate.location}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                    <Euro size={14} />
                    <span>€{currentCandidate.salary_min?.toLocaleString()} - €{currentCandidate.salary_max?.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                    <Briefcase size={14} />
                    <span>{currentCandidate.remote_preference}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Bio</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {currentCandidate.bio || 'Nessuna bio disponibile.'}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentCandidate.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-8 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-center gap-6">
                  {/* Dislike */}
                  <button
                    onClick={() => handleSwipe('left')}
                    className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                  >
                    <X size={32} color="white" strokeWidth={3} />
                  </button>

                  {/* Like */}
                  <button
                    onClick={() => handleSwipe('right')}
                    className="w-20 h-20 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
                  >
                    <Heart size={36} color="white" strokeWidth={3} />
                  </button>

                  {/* Super Like (future) */}
                  <button
                    disabled
                    className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center shadow-lg opacity-50 cursor-not-allowed"
                  >
                    <Star size={28} color="white" />
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                  ❌ Passa • ✅ Interessa • ⭐ Super (coming soon)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hints */}
        <div className="mt-8 text-center text-sm text-gray-600">
          💡 <strong>Tip:</strong> Swipe right se il candidato ti interessa. Se anche lui ha swipato right su un tuo job, è MATCH!
        </div>
      </div>
    </div>
  );
}

// ese