import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/supabase-server";
import DashboardHomeClient from "@/components/DashboardHomeClient";
import { SkeletonDashboard } from "@/components/ui/Skeletons";

export const dynamic = "force-dynamic";

// ✅ Fetch iniziale spostata in un componente figlio per sfruttare Suspense
async function DashboardContent() {
  const { user, company, supabase } = await getServerSession();

  if (!user || !company) {
    redirect("/login");
  }

  // 🚀 Fetch iniziale in parallelo server-side
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

// ✅ Main component con Suspense
export default function DashboardPage() {
  return (
    <Suspense fallback={<SkeletonDashboard />}>
      <DashboardContent />
    </Suspense>
  );
}
