'use client';

import { Plus, MapPin, Euro, Calendar, Edit2, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useJobs } from '@/lib/hooks/useJobs';

export default function JobsPage() {
  const { jobs, loading } = useJobs(); // ✅ Centralizzato con real-time!

  const getRemoteIcon = (policy) => {
    if (policy === 'remote') return '🏠';
    if (policy === 'hybrid') return '🔀';
    return '🏢';
  };

  const formatSalary = (min, max) => {
    return `€${min.toLocaleString()} - €${max.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            I Tuoi Jobs
          </h1>
          <p className="text-gray-600">
            {jobs.length} {jobs.length === 1 ? 'annuncio pubblicato' : 'annunci pubblicati'}
          </p>
        </div>
        <Link 
          href="/dashboard/jobs/new"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
        >
          <Plus size={20} />
          <span>Nuovo Job</span>
        </Link>
      </div>

      {/* Jobs Grid */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Nessun job pubblicato ancora
          </h3>
          <p className="text-gray-600 mb-6">
            Inizia a pubblicare il tuo primo annuncio per trovare candidati
          </p>
          <Link 
            href="/dashboard/jobs/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus size={20} />
            <span>Pubblica Primo Job</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div 
              key={job.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              {/* Job Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{job.company?.logo_url || '💼'}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {job.company?.name || 'Company'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  job.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {job.is_active ? 'Attivo' : 'Inattivo'}
                </span>
              </div>

              {/* Job Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Euro size={16} className="text-green-600" />
                  <span className="font-semibold">
                    {formatSalary(job.salary_min, job.salary_max)}
                  </span>
                  <span className="text-gray-500">/ anno</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>{job.location || 'Non specificato'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{getRemoteIcon(job.remote_policy)}</span>
                  <span className="capitalize">{job.remote_policy}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} />
                  <span>{new Date(job.created_at).toLocaleDateString('it-IT')}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.required_skills?.slice(0, 3).map((skill, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.required_skills?.length > 3 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    +{job.required_skills.length - 3}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                <Link 
                  href={`/dashboard/jobs/${job.id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                >
                  <Eye size={16} />
                  <span>Vedi</span>
                </Link>
                <Link 
                  href={`/dashboard/jobs/${job.id}/edit`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
                >
                  <Edit2 size={16} />
                  <span>Modifica</span>
                </Link>
                <button 
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}