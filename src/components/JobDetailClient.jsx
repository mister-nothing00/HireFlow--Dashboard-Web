'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Edit2, Trash2, Users, Briefcase, Euro, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase'; // ✅ CLIENT supabase
import { showToast } from '@/lib/toast';

export default function JobDetailClient({ job: initialJob, company }) {
  const router = useRouter();
  const [job, setJob]         = useState(initialJob);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!confirm('Sei sicuro di voler eliminare questo job? Azione irreversibile.')) return;
    setDeleting(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', job.id)
        .eq('company_id', company.id);
      if (error) throw error;
      showToast.success('Job eliminato!');
      router.push('/dashboard/jobs');
    } catch (e) {
      showToast.error("Errore nell'eliminazione");
    } finally {
      setDeleting(false);
    }
  }, [job.id, company.id, router]);

  const handleToggleActive = useCallback(async () => {
    setToggling(true);
    try {
      const newStatus = !job.is_active;
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: newStatus })
        .eq('id', job.id)
        .eq('company_id', company.id);
      if (error) throw error;
      setJob(prev => ({ ...prev, is_active: newStatus }));
      showToast.success(`Job ${newStatus ? 'attivato' : 'disattivato'}`);
    } catch (e) {
      showToast.error('Errore aggiornamento stato');
    } finally {
      setToggling(false);
    }
  }, [job.id, job.is_active, company.id]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* Back */}
        <Link href="/dashboard/jobs" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition">
          <ArrowLeft size={18} /> Torna ai Jobs
        </Link>

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6 shadow-sm">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  job.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {job.is_active ? '● Attivo' : '○ Inattivo'}
                </span>
              </div>
              <p className="text-gray-500 flex items-center gap-1">
                <MapPin size={14} /> {job.location}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleActive}
                disabled={toggling}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-medium disabled:opacity-50"
              >
                {job.is_active
                  ? <><ToggleRight size={18} className="text-green-600" /> Disattiva</>
                  : <><ToggleLeft size={18} /> Attiva</>
                }
              </button>
              <Link
                href={`/dashboard/jobs/${job.id}/edit`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition text-sm font-medium"
              >
                <Edit2 size={16} /> Modifica
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition text-sm font-medium disabled:opacity-50"
              >
                <Trash2 size={16} /> {deleting ? 'Eliminando...' : 'Elimina'}
              </button>
            </div>
          </div>

          {/* Badges info */}
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
              <Briefcase size={14} /> {job.contract_type}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium">
              {job.remote_policy === 'remote' ? '🏠' : job.remote_policy === 'hybrid' ? '🔀' : '🏢'} {job.remote_policy}
            </span>
            {(job.salary_min || job.salary_max) && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                <Euro size={14} /> {job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
              </span>
            )}
            {job.seniority && (
              <span className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium capitalize">
                {job.seniority}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">📋 Descrizione</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
          </div>
        </div>

        {/* Skills */}
        {(job.required_skills?.length > 0 || job.nice_to_have_skills?.length > 0) && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
            {job.required_skills?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">🎯 Skills Richieste</h2>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {job.nice_to_have_skills?.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">✨ Nice to Have</h2>
                <div className="flex flex-wrap gap-2">
                  {job.nice_to_have_skills.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CTA candidati */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <Link href="/dashboard/candidates" className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-1">Cerca Candidati per questo Job</h3>
              <p className="text-blue-200 text-sm">Swipa i candidati e crea match</p>
            </div>
            <Users size={32} className="text-blue-200" />
          </Link>
        </div>

      </div>
    </div>
  );
}