import { useEffect } from 'react';
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
  } = useStore();

  useEffect(() => {
    if (candidates.length === 0) {
      fetchCandidates();
    }
  }, []);

  const fetchCandidates = async () => {
    try {
      setCandidatesLoading(true);

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      console.log('✅ Candidates loaded:', data?.length || 0);
      setCandidates(data || []);
    } catch (error) {
      console.error('❌ Error fetching candidates:', error);
    } finally {
      setCandidatesLoading(false);
    }
  };

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