'use client';

import { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { supabase } from "../supabase.js";

// Custom hook per gestire i matches, con supporto per fetch iniziale dei matches e sottoscrizione a real-time updates tramite Supabase, integrato con lo stato globale di AppContext
export function useMatches() {
  const { matches, setMatches, setMatchesLoading, company } = useApp();
  const companyId = company?.id;

  // Effettua il fetch iniziale dei matches e si sottoscrive a real-time updates tramite Supabase, con pulizia della sottoscrizione al unmount
  useEffect(() => {
   
    if (!companyId) {
      setMatchesLoading(false);
      return;
    }

    let channel;
    let cancelled = false;

    const fetchMatches = async () => {
      try {
        setMatchesLoading(true);

        const [swipesRes, matchesRes] = await Promise.all([
          supabase
            .from("company_swipes")
            .select(`candidate_id, created_at, candidate:candidates(*)`)
            .eq("direction", "right")
            .eq("company_id", companyId),

          supabase
            .from("matches")
            .select(`candidate_id, job_id, job:jobs(id, title, location, salary_min, salary_max)`)
            .eq("company_id", companyId),
        ]);

        if (cancelled) return;
        if (swipesRes.error) throw swipesRes.error;
        if (matchesRes.error) throw matchesRes.error;

        const ourSwipes = swipesRes.data || [];
        const confirmedMatches = matchesRes.data || [];

        const matchMap = new Map();
        confirmedMatches.forEach((m) => matchMap.set(m.candidate_id, m));

        const merged = ourSwipes
          .filter((swipe) => swipe.candidate)
          .map((swipe) => {
            const match = matchMap.get(swipe.candidate_id);
            return {
              ...swipe.candidate,
              hasMatch: !!match,
              matchedJob: match?.job || null,
              swipedAt: swipe.created_at,
              status: match ? "matched" : "interested",
            };
          });

        const sorted = merged.sort((a, b) => {
          if (a.hasMatch && !b.hasMatch) return -1;
          if (!a.hasMatch && b.hasMatch) return 1;
          return new Date(b.swipedAt) - new Date(a.swipedAt);
        });

        console.log(`✅ Matches loaded: ${sorted.length}`);
        setMatches(sorted);
      } catch (error) {
        console.error("❌ Error fetching matches:", error);
      } finally {
        if (!cancelled) setMatchesLoading(false);
      }
    };

    fetchMatches();

    // Realtime subscription
    channel = supabase
      .channel(`matches-${companyId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "matches",
        filter: `company_id=eq.${companyId}`,
      }, async (payload) => {
        console.log("🎉 New match real-time!", payload.new.candidate_id);
        // Refetch completo per avere tutti i dati aggiornati
        fetchMatches();
      })
      .subscribe((status) => {
        console.log("📡 Matches subscription:", status);
      });

    return () => {
      cancelled = true;
      console.log("🔴 Unsubscribing matches...");
      if (channel) supabase.removeChannel(channel);
    };
  }, [companyId]); // Rerun se cambia companyId

  // Calcola statistiche sui matches, memoizzate per evitare ricalcoli inutili
  const stats = {
    total: matches.length,
    matched: matches.filter((m) => m.hasMatch).length,
    interested: matches.filter((m) => !m.hasMatch).length,
  };

  return {
    matches,
    stats,
    loading: useStore((state) => state.matchesLoading),
  };
}