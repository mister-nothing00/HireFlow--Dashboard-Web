"use client";

import { useEffect, useState, useCallback } from "react";
import { Briefcase, Users, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";

export default function DashboardHome() {
  const { company } = useStore();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    totalMatches: 0,
    pendingMatches: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 OTTIMIZZATO: tutte le query in parallelo con Promise.all
  const fetchDashboardData = useCallback(async () => {
    if (!company?.id) return;

    try {
      setLoading(true);

      const [jobsRes, swipesRes, matchesRes, recentRes] = await Promise.all([
        // 1. Jobs attivi
        supabase
          .from("jobs")
          .select("*", { count: "exact", head: true })
          .eq("company_id", company.id)
          .eq("is_active", true),

        // 2. Swipes totali (candidati interessati)
        supabase
          .from("company_swipes")
          .select("*", { count: "exact", head: true })
          .eq("direction", "right"),

        // 3. Matches totali
        supabase
          .from("matches")
          .select("*", { count: "exact", head: true })
          .eq("company_id", company.id),

        // 4. Attività recente
        supabase
          .from("company_swipes")
          .select(
            `
            id,
            direction,
            created_at,
            candidate:candidates(id, first_name, last_name, headline)
          `,
          )
          .eq("direction", "right")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const jobsCount = jobsRes.count || 0;
      const swipesCount = swipesRes.count || 0;
      const matchesCount = matchesRes.count || 0;

      setStats({
        activeJobs: jobsCount,
        totalCandidates: swipesCount,
        totalMatches: matchesCount,
        pendingMatches: Math.max(0, swipesCount - matchesCount),
      });

      setRecentActivity(recentRes.data || []);
      console.log("✅ Dashboard loaded (parallel)");
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [company?.id]);

  useEffect(() => {
    if (company?.id) fetchDashboardData();
  }, [company?.id, fetchDashboardData]);

  // 🔔 REALTIME: stats si aggiornano live senza ricaricare la pagina
  useEffect(() => {
    if (!company?.id) return;

    const channel = supabase
      .channel(`dashboard-stats-${company.id}`)

      // Nuovo job pubblicato
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
          filter: `company_id=eq.${company.id}`,
        },
        (payload) => {
          console.log("📊 Job changed, updating stats...");
          if (payload.eventType === "INSERT") {
            setStats((prev) => ({ ...prev, activeJobs: prev.activeJobs + 1 }));
          } else if (payload.eventType === "DELETE") {
            setStats((prev) => ({
              ...prev,
              activeJobs: Math.max(0, prev.activeJobs - 1),
            }));
          }
        },
      )

      // Nuovo match
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `company_id=eq.${company.id}`,
        },
        () => {
          console.log("🎉 New match! Updating stats...");
          setStats((prev) => ({
            ...prev,
            totalMatches: prev.totalMatches + 1,
            pendingMatches: Math.max(0, prev.pendingMatches - 1),
          }));
        },
      )

      // Nuovo swipe su candidato
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "company_swipes",
          filter: `direction=eq.right`,
        },
        async (payload) => {
          console.log("👤 New swipe, updating recent activity...");
          setStats((prev) => ({
            ...prev,
            totalCandidates: prev.totalCandidates + 1,
            pendingMatches: prev.pendingMatches + 1,
          }));
          // Aggiorna attività recente fetchando solo il nuovo elemento
          const { data } = await supabase
            .from("company_swipes")
            .select(
              `
            id, direction, created_at,
            candidate:candidates(id, first_name, last_name, headline)
          `,
            )
            .eq("id", payload.new.id)
            .single();
          if (data) {
            setRecentActivity((prev) => [data, ...prev.slice(0, 4)]);
          }
        },
      )

      .subscribe((status) => {
        console.log("📡 Dashboard realtime:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [company?.id]);

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMins = Math.floor((now - date) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "Ora";
    if (diffMins < 60) return `${diffMins} min fa`;
    if (diffHours < 24) return `${diffHours}h fa`;
    if (diffDays === 1) return "1 giorno fa";
    return `${diffDays} giorni fa`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  const statsData = [
    {
      name: "Jobs Attivi",
      value: stats.activeJobs,
      icon: Briefcase,
      color: "bg-blue-100 text-blue-600",
      trend:
        stats.activeJobs > 0
          ? `${stats.activeJobs} pubblicati`
          : "Nessun job attivo",
      href: "/dashboard/jobs",
    },
    {
      name: "Candidati Interessati",
      value: stats.totalCandidates,
      icon: Users,
      color: "bg-green-100 text-green-600",
      trend:
        stats.totalCandidates > 0 ? "Swipe effettuati" : "Inizia a swipare",
      href: "/dashboard/candidates",
    },
    {
      name: "Match Attivi",
      value: stats.totalMatches,
      icon: CheckCircle,
      color: "bg-purple-100 text-purple-600",
      trend: stats.totalMatches > 0 ? "Match reciproci" : "Nessun match",
      href: "/dashboard/matches",
    },
    {
      name: "In Attesa",
      value: stats.pendingMatches,
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
      trend: "Aspettano risposta",
      href: "/dashboard/matches",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Benvenuto, {company?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Ecco una panoramica della tua attività di recruiting
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Link
          href="/dashboard/jobs/new"
          className="flex items-center gap-4 p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
        >
          <div className="p-3 bg-white/20 rounded-lg">
            <Briefcase size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Pubblica Nuovo Job</h3>
            <p className="text-blue-100 text-sm">Setup in 2 minuti</p>
          </div>
        </Link>
        <Link
          href="/dashboard/candidates"
          className="flex items-center gap-4 p-6 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition shadow-lg"
        >
          <div className="p-3 bg-white/20 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg mb-1">Swipe Candidati</h3>
            <p className="text-green-100 text-sm">
              {stats.totalCandidates > 0
                ? `${stats.totalCandidates} swipe effettuati`
                : "Inizia a scoprire talenti"}
            </p>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.name} href={stat.href}>
              <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  {/* 🔴 Dot realtime per indicare che è live */}
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">live</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-700">{stat.name}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Attività Recente
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
                  👤
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {activity.candidate?.first_name}{" "}
                    {activity.candidate?.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activity.candidate?.headline}
                  </p>
                </div>
                <span className="text-sm text-gray-400">
                  {formatTimeAgo(activity.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
