import { useEffect, useCallback } from "react";
import { useStore } from "../store";
import { supabase } from "../supabase";

export function useMatches() {
  const { matches, setMatches, setMatchesLoading, company } = useStore();

  // 🚀 OTTIMIZZATO: da 3 + (N×2) query a 2 query parallele
  // Con 20 candidati: prima → 43 query, ora → 2 query
  const fetchMatches = useCallback(async () => {
    if (!company?.id) return;

    try {
      setMatchesLoading(true);

      const [swipesRes, matchesRes] = await Promise.all([
        // Query 1: tutti i candidati che abbiamo swipato right (con dati candidato in join)
        supabase
          .from("company_swipes")
          .select(
            `
            candidate_id,
            created_at,
            candidate:candidates(*)
          `,
          )
          .eq("direction", "right"),

        // Query 2: tutti i match reciproci già confermati (con job info in join)
        supabase
          .from("matches")
          .select(
            `
            candidate_id,
            job_id,
            job:jobs(id, title, location, salary_min, salary_max)
          `,
          )
          .eq("company_id", company.id),
      ]);

      if (swipesRes.error) throw swipesRes.error;
      if (matchesRes.error) throw matchesRes.error;

      const ourSwipes = swipesRes.data || [];
      const confirmedMatches = matchesRes.data || [];

      // Mappa candidato → match info (lookup O(1) invece di N query)
      const matchMap = new Map();
      confirmedMatches.forEach((m) => matchMap.set(m.candidate_id, m));

      // Merge client-side: O(N) invece di O(N) query al database
      const merged = ourSwipes
        .filter((swipe) => swipe.candidate) // Filtra candidati eliminati
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

      // Ordina: match reciproci prima, poi per data swipe (più recente prima)
      const sorted = merged.sort((a, b) => {
        if (a.hasMatch && !b.hasMatch) return -1;
        if (!a.hasMatch && b.hasMatch) return 1;
        return new Date(b.swipedAt) - new Date(a.swipedAt);
      });

      console.log(
        `✅ Matches loaded: ${sorted.length} (2 queries instead of ${3 + ourSwipes.length * 2})`,
      );
      setMatches(sorted);
    } catch (error) {
      console.error("❌ Error fetching matches:", error);
    } finally {
      setMatchesLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    if (!company?.id) return;

    fetchMatches();
    const unsubscribe = subscribeToMatches();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [company?.id, fetchMatches]);

  const subscribeToMatches = () => {
    if (!company?.id) return;

    console.log("🔄 Subscribing to matches real-time...");

    const channel = supabase
      .channel(`matches-${company.id}`)

      // ✅ Ottimizzato: ascolta solo i match della nostra company
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `company_id=eq.${company.id}`,
        },
        async (payload) => {
          console.log("🎉 New mutual match!", payload.new.candidate_id);

          // Fetch job info per il nuovo match (solo 1 query piccola)
          const { data: jobData } = await supabase
            .from("jobs")
            .select("id, title, location, salary_min, salary_max")
            .eq("id", payload.new.job_id)
            .single();

          // Aggiorna localmente senza refetch totale
          setMatches((prev) =>
            prev
              .map((m) =>
                m.id === payload.new.candidate_id
                  ? {
                      ...m,
                      hasMatch: true,
                      matchedJob: jobData || null,
                      status: "matched",
                    }
                  : m,
              )
              // Riordina: i nuovi match vanno in cima
              .sort((a, b) => {
                if (a.hasMatch && !b.hasMatch) return -1;
                if (!a.hasMatch && b.hasMatch) return 1;
                return new Date(b.swipedAt) - new Date(a.swipedAt);
              }),
          );
        },
      )

      .subscribe((status) => {
        console.log("📡 Matches subscription:", status);
      });

    return () => {
      console.log("🔴 Unsubscribing from matches real-time...");
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
    refetch: fetchMatches,
  };
}
