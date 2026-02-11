// ⚠️ NON aggiungere 'use client' → questo è un Server Component
// Fetch dati lato server → zero loading spinners al primo caricamento

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase-server";
import DashboardHomeClient from "@/components/DashboardHomeClient";

// Forza questo componente a essere sempre SSR (dashboard autenticata)
export const dynamic = "force-dynamic"; // Cache solo i dati pubblici, non quelli specifici dell'utente

export default async function DashboardPage() {
  const { user, company, supabase } = await getServerSession();

  // Se non c'è sessione valida, reindirizza a login (Server-side redirect)
  if (!user || !company) {
    redirect("/login");
  }

  // 🚀 Fetch iniziale in parallelo server-side (zero CSR waterfall)
  const [jobsRes, swipesRes, matchesRes, recentRes] = await Promise.all([
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id)
      .eq("is_active", true),

    supabase
      .from("company_swipes")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id)
      .eq("direction", "right"),

    supabase
      .from("matches")
      .select("*", { count: "exact", head: true })
      .eq("company_id", company.id),

    supabase
      .from("company_swipes")
      .select(
        "id, direction, created_at, candidate:candidates(id, first_name, last_name, headline)",
      )
      .eq("company_id", company.id)
      .eq("direction", "right")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const initialStats = {
    activeJobs: jobsRes.count || 0,
    totalCandidates: swipesRes.count || 0,
    totalMatches: matchesRes.count || 0,
    pendingMatches: Math.max(
      0,
      (swipesRes.count || 0) - (matchesRes.count || 0),
    ),
  };

  return (
    <DashboardHomeClient
      company={company}
      initialStats={initialStats}
      initialActivity={recentRes.data || []}
    />
  );
}
