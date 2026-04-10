'use client';

import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { supabase } from "../supabase.js";

export function useMatches() {
  const { company } = useApp();
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(true); // ✅ FIX: stato locale invece di useStore
  const companyId = company?.id;

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

        if (!cancelled) setMatches(sorted);
      } catch (error) {
        console.error("❌ Error fetching matches:", error);
      } finally {
        if (!cancelled) setMatchesLoading(false);
      }
    };

    fetchMatches();

    channel = supabase
      .channel(`matches-${companyId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "matches",
        filter: `company_id=eq.${companyId}`,
      }, () => fetchMatches())
      .subscribe();

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [companyId]);

  const stats = {
    total: matches.length,
    matched: matches.filter((m) => m.hasMatch).length,
    interested: matches.filter((m) => !m.hasMatch).length,
  };

  return { matches, stats, loading: matchesLoading };
}