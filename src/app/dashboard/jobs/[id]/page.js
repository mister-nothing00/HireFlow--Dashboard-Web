'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Euro, Calendar, Edit2, Trash2, Users, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { showToast } from '@/lib/toast';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { company } = useStore();
  const jobId = params.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const fetchJob = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          company:companies(name, logo_url, location)
        `)
        .eq('id', jobId)
        .single();

      if (error) throw error;

      // Verifica che il job appartenga alla company corrente
      if (data.company_id !== company?.id) {
        showToast.error('❌ Non hai i permessi per visualizzare questo job');
        router.push('/dashboard/jobs');
        return;
      }

      console.log('✅ Job loaded:', data);
      setJob(data);
    } catch (error) {
      console.error('❌ Error fetching job:', error);
      showToast.error('Errore nel caricamento del job');
      router.push('/dashboard/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo job? Questa azione è irreversibile.')) {
      return;
    }

    setDeleting(true);

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', jobId)
        .eq('company_id', company.id); // Security: verifica ownership

      if (error) throw error;

      console.log('✅ Job deleted');
      showToast.success('✅ Job eliminato con successo');
      router.push('/dashboard/jobs');
    } catch (error) {
      console.error('❌ Error deleting job:', error);
      showToast.error('Errore nell\'eliminazione del job');
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async () => {
    try {
      const newStatus = !job.is_active;

      const { error } = await supabase
        .from('jobs')
        .update({ is_active: newStatus })
        .eq('id', jobId)
        .eq('company_id', company.id);

      if (error) throw error;

      setJob({ ...job, is_active: newStatus });
      console.log(`✅ Job ${newStatus ? 'attivato' : 'disattivato'}`);
    } catch (error) {
      console.error('❌ Error toggling job status:', error);
      showToast.error('Errore nel cambio di stato');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento job...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Job non trovato
          </h2>
          <Link
            href="/dashboard/jobs"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Torna ai Jobs
          </Link>
        </div>
      </div>
    );
  }

  const formatSalary = (min, max, currency) => {
    return `${currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£'}${min.toLocaleString()} - ${currency === 'EUR' ? '€' : currency === 'USD' ? '$' : '£'}${max.toLocaleString()}`;
  };

  const getRemoteIcon = (policy) => {
    if (policy === 'remote') return '🏠';
    if (policy === 'hybrid') return '🔀';
    return '🏢';
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Torna ai Jobs</span>
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {job.title}
              </h1>
              <p className="text-gray-600">
                {job.company?.name || 'Company'} • {job.company?.location || job.location}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleActive}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  job.is_active
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {job.is_active ? '✓ Attivo' : '○ Inattivo'}
              </button>

              <Link
                href={`/dashboard/jobs/${job.id}/edit`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold flex items-center gap-2"
              >
                <Edit2 size={18} />
                <span>Modifica</span>
              </Link>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={18} />
                <span>{deleting ? 'Eliminazione...' : 'Elimina'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Job Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          {/* Key Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Euro size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Salary Range</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatSalary(job.salary_min, job.salary_max, job.salary_currency)} / anno
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <MapPin size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="text-lg font-bold text-gray-900">
                  {getRemoteIcon(job.remote_policy)} {job.location} • {job.remote_policy}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Briefcase size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tipo Contratto</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {job.contract_type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users size={24} className="text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Seniority</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {job.seniority}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Descrizione</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </div>

          {/* Skills Required */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Skills Richieste
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.required_skills?.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Skills Nice-to-Have */}
          {job.nice_to_have_skills?.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Skills Nice-to-Have
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.nice_to_have_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  Pubblicato il {new Date(job.created_at).toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              {job.experience_years_min && (
                <div>
                  Esperienza minima: {job.experience_years_min} anni
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Card (Mock) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Statistiche Job
          </h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600">Visualizzazioni</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600">Swipe Right</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-600">Match</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}