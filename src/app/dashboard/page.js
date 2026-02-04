'use client';

import { useEffect, useState } from 'react';
import { Briefcase, Users, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';

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

  useEffect(() => {
    if (company?.id) {
      fetchDashboardData();
    }
  }, [company?.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch active jobs count
      const { count: jobsCount } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('is_active', true);

      // 2. Fetch total swipes (candidati interessati)
      const { count: swipesCount } = await supabase
        .from('company_swipes')
        .select('*', { count: 'exact', head: true })
        .eq('direction', 'right');

      // 3. Fetch total matches
      const { count: matchesCount } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id);

      // 4. Fetch pending matches (swipati ma non matchati ancora)
      const pendingCount = (swipesCount || 0) - (matchesCount || 0);

      // 5. Fetch recent activity (ultimi 5 swipes)
      const { data: recentSwipes } = await supabase
        .from('company_swipes')
        .select(`
          id,
          direction,
          created_at,
          candidate:candidates(id, first_name, last_name, headline)
        `)
        .eq('direction', 'right')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        activeJobs: jobsCount || 0,
        totalCandidates: swipesCount || 0,
        totalMatches: matchesCount || 0,
        pendingMatches: Math.max(0, pendingCount),
      });

      setRecentActivity(recentSwipes || []);
      console.log('✅ Dashboard data loaded');
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ora';
    if (diffMins < 60) return `${diffMins} min fa`;
    if (diffHours < 24) return `${diffHours}h fa`;
    if (diffDays === 1) return '1 giorno fa';
    return `${diffDays} giorni fa`;
  };

  if (loading) {
    return (
      <div className="p-8">
        {/* Loading Skeletons */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const statsData = [
    {
      name: 'Jobs Attivi',
      value: stats.activeJobs,
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600',
      trend: stats.activeJobs > 0 ? `${stats.activeJobs} pubblicati` : 'Nessun job attivo',
      href: '/dashboard/jobs',
    },
    {
      name: 'Candidati Interessati',
      value: stats.totalCandidates,
      icon: Users,
      color: 'bg-green-100 text-green-600',
      trend: stats.totalCandidates > 0 ? 'Swipe effettuati' : 'Inizia a swipare',
      href: '/dashboard/candidates',
    },
    {
      name: 'Match Attivi',
      value: stats.totalMatches,
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600',
      trend: stats.totalMatches > 0 ? 'Match reciproci' : 'Nessun match',
      href: '/dashboard/matches',
    },
    {
      name: 'In Attesa',
      value: stats.pendingMatches,
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
      trend: 'Aspettano risposta',
      href: '/dashboard/matches',
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
              {stats.totalCandidates > 0 ? `${stats.totalCandidates} già swipati` : 'Inizia ora'}
            </p>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.name}</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </p>
              <p className="text-xs text-gray-500">{stat.trend}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            Attività Recente
          </h2>
          <Link 
            href="/dashboard/matches"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Vedi Tutti →
          </Link>
        </div>
        
        {recentActivity.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-600 mb-4">Nessuna attività recente</p>
            <Link
              href="/dashboard/candidates"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Inizia a Swipare
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="text-3xl">👤</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {activity.candidate?.first_name} {activity.candidate?.last_name}
                    <span className="font-normal text-gray-600"> ha ricevuto il tuo like</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.candidate?.headline || 'Candidato'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Clock size={14} />
                  <span>{formatTimeAgo(activity.created_at)}</span>
                </div>
                <Link 
                  href={`/dashboard/candidates/${activity.candidate?.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                  Vedi Profilo
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}