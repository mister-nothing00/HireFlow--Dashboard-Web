import { useEffect } from 'react';
import { useStore } from '../store';
import { supabase } from '../supabase';

export function useMatches() {
  const { matches, setMatches, setMatchesLoading, company } = useStore();

  useEffect(() => {
    if (!company?.id) return;

    fetchMatches();
    const unsubscribe = subscribeToMatches();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [company?.id]);

  const fetchMatches = async () => {
    try {
      setMatchesLoading(true);

      // 1. Fetch nostri swipe RIGHT
      const { data: ourSwipes, error: ourError } = await supabase
        .from('company_swipes')
        .select('candidate_id, created_at')
        .eq('direction', 'right');

      if (ourError) throw ourError;

      if (!ourSwipes || ourSwipes.length === 0) {
        setMatches([]);
        setMatchesLoading(false);
        return;
      }

      const candidateIds = ourSwipes.map((s) => s.candidate_id);

      // 2. Fetch candidati info
      const { data: candidates, error: candidatesError } = await supabase
        .from('candidates')
        .select('*')
        .in('id', candidateIds);

      if (candidatesError) throw candidatesError;

      // 3. Check reciproci swipes
      const matchesData = await Promise.all(
        candidates.map(async (candidate) => {
          const { data: theirSwipes } = await supabase
            .from('swipes')
            .select('job_id')
            .eq('candidate_id', candidate.id)
            .eq('direction', 'right');

          const hasMatch = theirSwipes && theirSwipes.length > 0;
          const matchedJobId = hasMatch ? theirSwipes[0].job_id : null;

          let jobInfo = null;
          if (matchedJobId) {
            const { data: job } = await supabase
              .from('jobs')
              .select('title, location, salary_min, salary_max')
              .eq('id', matchedJobId)
              .single();
            jobInfo = job;
          }

          return {
            ...candidate,
            hasMatch,
            matchedJob: jobInfo,
            swipedAt: ourSwipes.find((s) => s.candidate_id === candidate.id)?.created_at,
            status: hasMatch ? 'matched' : 'interested',
          };
        })
      );

      const sorted = matchesData.sort((a, b) => {
        if (a.hasMatch && !b.hasMatch) return -1;
        if (!a.hasMatch && b.hasMatch) return 1;
        return new Date(b.swipedAt) - new Date(a.swipedAt);
      });

      console.log('✅ Matches loaded:', sorted.length);
      setMatches(sorted);
    } catch (error) {
      console.error('❌ Error fetching matches:', error);
    } finally {
      setMatchesLoading(false);
    }
  };

  const subscribeToMatches = () => {
    console.log('🔄 Subscribing to matches real-time updates...');

    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'company_swipes',
        },
        () => {
          console.log('🔔 New swipe detected, refetching matches...');
          fetchMatches();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'swipes',
        },
        () => {
          console.log('🔔 Candidate swipe detected, refetching matches...');
          fetchMatches();
        }
      )
      .subscribe((status) => {
        console.log('📡 Matches subscription status:', status);
      });

    return () => {
      console.log('🔴 Unsubscribing from matches real-time...');
      supabase.removeChannel(channel);
    };
  };

  const stats = {
    total: matches.length,
    matched: matches.filter((m) => m.hasMatch).length,
    interested: matches.filter((m) => !m.hasMatch).length,
  };

  return { 
    matches, 
    stats,
    loading: useStore((state) => state.matchesLoading), 
    refetch: fetchMatches 
  };
}