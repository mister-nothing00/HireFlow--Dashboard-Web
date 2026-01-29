import { Briefcase, Users, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  // Mock data (poi da Supabase)
  const stats = [
    {
      name: 'Jobs Attivi',
      value: '8',
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600',
      trend: '+2 questo mese',
      trendUp: true,
    },
    {
      name: 'Candidati Interessati',
      value: '142',
      icon: Users,
      color: 'bg-green-100 text-green-600',
      trend: '+24 questa settimana',
      trendUp: true,
    },
    {
      name: 'Match Attivi',
      value: '18',
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600',
      trend: '+5 oggi',
      trendUp: true,
    },
    {
      name: 'Colloqui in Corso',
      value: '6',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
      trend: '3 questa settimana',
      trendUp: false,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      candidate: 'Mario Rossi',
      action: 'ha swipato right',
      job: 'Frontend Developer - Milano',
      time: '5 min fa',
      avatar: '👨‍💻',
    },
    {
      id: 2,
      candidate: 'Laura Bianchi',
      action: 'ha swipato right',
      job: 'UX Designer - Remote',
      time: '12 min fa',
      avatar: '👩‍🎨',
    },
    {
      id: 3,
      candidate: 'Giuseppe Verdi',
      action: 'ha swipato super',
      job: 'Backend Developer - Milano',
      time: '1 ora fa',
      avatar: '👨‍💼',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Benvenuto! 👋
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
            <p className="text-green-100 text-sm">142 nuovi profili</p>
          </div>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
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
              <div className="flex items-center gap-1">
                <span className={`text-xs ${stat.trendUp ? 'text-green-600' : 'text-gray-500'}`}>
                  {stat.trendUp ? '↗' : '→'}
                </span>
                <span className="text-xs text-gray-500">{stat.trend}</span>
              </div>
            </div>
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
            href="/dashboard/candidates"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Vedi Tutti →
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-3xl">{activity.avatar}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">
                  {activity.candidate} <span className="font-normal text-gray-600">{activity.action}</span>
                </p>
                <p className="text-sm text-gray-600">
                  {activity.job}
                </p>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Clock size={14} />
                <span>{activity.time}</span>
              </div>
              <Link 
                href={`/dashboard/candidates/${activity.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
              >
                Vedi Profilo
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}