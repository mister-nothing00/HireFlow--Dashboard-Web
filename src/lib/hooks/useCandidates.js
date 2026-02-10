import { useEffect, useCallback } from 'react';
import { useStore } from '../store';
import { supabase } from '../supabase';

export function useCandidates() {
  const {
    candidates,
    setCandidates,
    setCandidatesLoading,
    currentCandidateIndex,
    nextCandidate,
    resetCandidateIndex,
    company,
  } = useStore();

  const fetchCandidates = useCallback(async () => {
    try {
      setCandidatesLoading(true);

      // 🚀 2 query parallele: candidati attivi + quelli già swipati da noi
      const [candidatesRes, swipedRes] = await Promise.all([
        supabase
          .from('candidates')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(50),

        // ✅ FIX: recupera i candidati già swipati così da escluderli
        // Prima: mostrava candidati già visti ad ogni reload
        company?.id
          ? supabase
              .from('company_swipes')
              .select('candidate_id')
          : Promise.resolve({ data: [] }),
      ]);

      if (candidatesRes.error) throw candidatesRes.error;

      // Set degli ID già swipati per lookup O(1)
      const alreadySwiped = new Set(
        (swipedRes.data || []).map(s => s.candidate_id)
      );

      // Filtra candidati non ancora visti
      const filtered = (candidatesRes.data || []).filter(
        c => !alreadySwiped.has(c.id)
      );

      console.log(`✅ Candidates: ${candidatesRes.data?.length} totali, ${filtered.length} non ancora visti`);
      setCandidates(filtered);
      resetCandidateIndex(); // Resetta l'indice quando ricarichiamo
    } catch (error) {
      console.error('❌ Error fetching candidates:', error);
    } finally {
      setCandidatesLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    // Ricarica se non ci sono candidati oppure se l'indice ha raggiunto la fine
    if (candidates.length === 0) {
      fetchCandidates();
    }
  }, []);

  const currentCandidate = candidates[currentCandidateIndex] || null;
  const remainingCandidates = Math.max(0, candidates.length - currentCandidateIndex);

  return {
    candidates,
    currentCandidate,
    currentIndex: currentCandidateIndex,
    remainingCandidates,
    loading: useStore((state) => state.candidatesLoading),
    nextCandidate,
    resetCandidateIndex,
    refetch: fetchCandidates,
  };
}