"use client";

import { useState, useEffect, memo, useCallback } from "react";
import { Briefcase, Users, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ─── Sub-components ─────────────────────────────────────────────
const StatCard = memo(function StatCard({ stat }) {
  const Icon = stat.icon;
  return (
    <Link href={stat.href}>
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${stat.color}`}>
            <Icon size={24} />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-gray-400">live</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
        <p className="text-sm font-medium text-gray-700">{stat.name}</p>
        <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
      </div>
    </Link>
  );
});

const ActivityItem = memo(function ActivityItem({ activity }) {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
        👤
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900">
          {activity.candidate?.first_name} {activity.candidate?.last_name}
        </p>
        <p className="text-sm text-gray-500">{activity.candidate?.headline}</p>
      </div>
      <span className="text-sm text-gray-400">
        {formatTimeAgo(activity.created_at)}
      </span>
    </div>
  );
});

function formatTimeAgo(ts) {
  if (!ts) return "";
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ora";
  if (mins < 60) return `${mins}min fa`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h fa`;
  return `${Math.floor(hrs / 24)}g fa`;
}

// ─── Main Component ─────────────────────────────────────────────

export default function DashboardHomeClient({
  company,
  initialStats,
  initialActivity,
}) {
  const [stats, setStats] = useState(initialStats);
  const [activity, setActivity] = useState(initialActivity);

  // 📡 Real-time: aggiorna stats senza ricaricare
  useEffect(() => {
    if (!company?.id) return;

    const channel = supabase
      .channel(`dashboard-realtime-${company.id}`)

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "jobs",
          filter: `company_id=eq.${company.id}`,
        },
        (payload) => {
          setStats((prev) => ({
            ...prev,
            activeJobs:
              payload.eventType === "INSERT"
                ? prev.activeJobs + 1
                : Math.max(0, prev.activeJobs - 1),
          }));
        },
      )

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `company_id=eq.${company.id}`,
        },
        () =>
          setStats((prev) => ({
            ...prev,
            totalMatches: prev.totalMatches + 1,
          })),
      )

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "company_swipes",
          filter: `company_id=eq.${company.id}`,
        },
        (payload) => {
          if (payload.new.direction !== "right") return;
          setStats((prev) => ({
            ...prev,
            totalCandidates: prev.totalCandidates + 1,
          }));

          // Aggiorna activity recente
          setActivity((prev) => [payload.new, ...prev].slice(0, 5));
        },
      )

      .subscribe((status) => console.log("📡 Dashboard realtime:", status));

    return () => supabase.removeChannel(channel);
  }, [company?.id]);

  const statsData = [
    {
      name: "Jobs Attivi",
      value: stats.activeJobs,
      icon: Briefcase,
      color: "bg-blue-100 text-blue-600",
      href: "/dashboard/jobs",
      trend: "Jobs pubblicati e attivi",
    },
    {
      name: "Candidati Interessati",
      value: stats.totalCandidates,
      icon: Users,
      color: "bg-purple-100 text-purple-600",
      href: "/dashboard/candidates",
      trend:
        stats.totalCandidates > 0
          ? `${stats.totalCandidates} swipe effettuati`
          : "Inizia a scoprire talenti",
    },
    {
      name: "Match Totali",
      value: stats.totalMatches,
      icon: CheckCircle,
      color: "bg-green-100 text-green-600",
      href: "/dashboard/matches",
      trend: "Match reciproci confermati",
    },
    {
      name: "In Attesa",
      value: stats.pendingMatches,
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
      href: "/dashboard/candidates",
      trend: "Candidati da valutare",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ciao, {company?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Ecco il riepilogo della tua pipeline recruiting
        </p>
      </div>

      {/* Quick Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
        <Link
          href="/dashboard/candidates"
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-xl font-bold mb-1">Scopri Candidati</h2>
            <p className="text-blue-200 text-sm">
              {stats.totalCandidates > 0
                ? `${stats.totalCandidates} swipe effettuati`
                : "Inizia a scoprire talenti"}
            </p>
          </div>
          <div className="text-4xl">👥</div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </div>

      {/* Recent Activity */}
      {activity.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Attività Recente
          </h2>
          <div className="space-y-4">
            {activity.map((a) => (
              <ActivityItem key={a.id} activity={a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
