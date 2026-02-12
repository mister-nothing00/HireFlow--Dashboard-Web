'use client';

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Eye, Edit2, Trash2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';

// Card per ogni job, con azioni per vedere, modificare ed eliminare
const JobCard = memo(function JobCard({ job, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{job.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          job.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {job.is_active ? 'Attivo' : 'Inattivo'}
        </span>
      </div>

      <div className="flex gap-2 text-sm text-gray-600 mb-4">
        <span className="px-2 py-1 bg-gray-100 rounded-lg">{job.contract_type}</span>
        <span className="px-2 py-1 bg-gray-100 rounded-lg">{job.remote_type}</span>
        {job.salary_min && (
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">
            €{job.salary_min.toLocaleString()} - €{(job.salary_max || 0).toLocaleString()}
          </span>
        )}
      </div>

      <div className="flex gap-2 border-t border-gray-200 pt-4">
        <Link
          href={`/dashboard/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
        >
          <Eye size={16} /> Vedi
        </Link>
        <Link
          href={`/dashboard/jobs/${job.id}/edit`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium text-sm"
        >
          <Edit2 size={16} /> Modifica
        </Link>
        <button
          onClick={() => onDelete(job.id)}
          className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
});

// ─── Main ─────────────────────────────────────────────────────────
export default function JobsClient({ company, initialJobs }) {
  const [jobs, setJobs]         = useState(initialJobs);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');

  // 📡 Real-time
  useEffect(() => {
    if (!company?.id) return;

    const channel = supabase
      .channel(`jobs-realtime-${company.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jobs', filter: `company_id=eq.${company.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT')
            setJobs(prev => [payload.new, ...prev]);
          else if (payload.eventType === 'UPDATE')
            setJobs(prev => prev.map(j => j.id === payload.new.id ? payload.new : j));
          else if (payload.eventType === 'DELETE')
            setJobs(prev => prev.filter(j => j.id !== payload.old.id));
        })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [company?.id]);

  const handleDelete = useCallback(async (jobId) => {
    if (!confirm('Sei sicuro di voler eliminare questo job?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', jobId);
    if (error) { showToast.error('Errore eliminazione'); return; }
    showToast.success('Job eliminato');
    // Real-time aggiornerà automaticamente la lista
  }, []);

  // Filtraggio memoizzato
  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch = !search ||
        j.title?.toLowerCase().includes(search.toLowerCase()) ||
        j.location?.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === 'all'    ? true :
        filter === 'active' ? j.is_active :
        !j.is_active;
      return matchesSearch && matchesFilter;
    });
  }, [jobs, search, filter]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">I Tuoi Jobs</h1>
          <p className="text-gray-600">{jobs.length} annunci pubblicati</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          <Plus size={20} /> Nuovo Job
        </Link>
      </div>

      {/* Filtri */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cerca job..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
        >
          <option value="all">Tutti</option>
          <option value="active">Attivi</option>
          <option value="inactive">Inattivi</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Nessun job trovato</h3>
          <p className="text-gray-500 mb-6">Pubblica il tuo primo annuncio</p>
          <Link href="/dashboard/jobs/new" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold">
            Crea Job
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(job => (
            <JobCard key={job.id} job={job} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}