"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/lib/store";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const { company } = useStore();
  const jobId = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    remote_policy: "hybrid",
    contract_type: "full-time",
    salary_min: "",
    salary_max: "",
    salary_currency: "EUR",
    required_skills: "",
    nice_to_have_skills: "",
    seniority: "mid",
    experience_years_min: "",
  });

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
        .select('*')
        .eq('id', jobId)
        .single();

      if (error) throw error;

      // Verifica ownership
      if (data.company_id !== company?.id) {
        alert('❌ Non hai i permessi per modificare questo job');
        router.push('/dashboard/jobs');
        return;
      }

      // Popola il form con i dati esistenti
      setFormData({
        title: data.title || "",
        description: data.description || "",
        location: data.location || "",
        remote_policy: data.remote_policy || "hybrid",
        contract_type: data.contract_type || "full-time",
        salary_min: data.salary_min || "",
        salary_max: data.salary_max || "",
        salary_currency: data.salary_currency || "EUR",
        required_skills: data.required_skills?.join(', ') || "",
        nice_to_have_skills: data.nice_to_have_skills?.join(', ') || "",
        seniority: data.seniority || "mid",
        experience_years_min: data.experience_years_min || "",
      });

      console.log('✅ Job loaded for editing:', data);
    } catch (error) {
      console.error('❌ Error fetching job:', error);
      alert('Errore nel caricamento del job');
      router.push('/dashboard/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Titolo obbligatorio";
    if (!formData.description.trim())
      newErrors.description = "Descrizione obbligatoria";
    if (!formData.location.trim()) newErrors.location = "Location obbligatoria";
    if (!formData.salary_min)
      newErrors.salary_min = "Salary minimo obbligatorio";
    if (!formData.salary_max)
      newErrors.salary_max = "Salary massimo obbligatorio";
    if (!formData.required_skills.trim())
      newErrors.required_skills = "Almeno una skill richiesta";

    const salaryMin = parseInt(formData.salary_min);
    const salaryMax = parseInt(formData.salary_max);

    if (salaryMin && salaryMax && salaryMin >= salaryMax) {
      newErrors.salary_max = "Salary max deve essere maggiore del minimo";
    }

    if (salaryMin < 10000 || salaryMax > 500000) {
      newErrors.salary_min = "Range salary non realistico";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      console.log('❌ Validation failed:', errors);
      return;
    }

    if (!company?.id) {
      alert('❌ Errore: Company non trovata. Ricarica la pagina.');
      return;
    }

    setSaving(true);

    try {
      const requiredSkillsArray = formData.required_skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const niceToHaveSkillsArray = formData.nice_to_have_skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const jobData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        remote_policy: formData.remote_policy,
        contract_type: formData.contract_type,
        salary_min: parseInt(formData.salary_min),
        salary_max: parseInt(formData.salary_max),
        salary_currency: formData.salary_currency,
        required_skills: requiredSkillsArray,
        nice_to_have_skills: niceToHaveSkillsArray,
        seniority: formData.seniority,
        experience_years_min: formData.experience_years_min ? parseInt(formData.experience_years_min) : null,
      };

      console.log('🚀 Updating job...');
      console.log('📦 Job data:', JSON.stringify(jobData, null, 2));

      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', jobId)
        .eq('company_id', company.id) // Security check
        .select()
        .single();

      if (error) {
        console.error('❌ Update error:', error);
        alert(`Errore Supabase: ${error.message}`);
        return;
      }

      console.log('✅ Job updated:', data);
      alert('✅ Job aggiornato con successo!');
      router.push(`/dashboard/jobs/${jobId}`);
    } catch (error) {
      console.error('❌ Catch error:', error);
      alert('Errore nell\'aggiornamento del job. Controlla la console!');
    } finally {
      setSaving(false);
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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/jobs/${jobId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Torna al Job</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Modifica Job
        </h1>
        <p className="text-gray-600">
          Aggiorna le informazioni del tuo annuncio
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-200 p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Titolo Job *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="es. Frontend Developer, UX Designer..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Descrizione *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={6}
            placeholder="Descrivi il ruolo, le responsabilità, cosa offrite..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.description}
            </p>
          )}
        </div>

        {/* Location + Remote Policy */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="es. Milano, Roma, Remote..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.location && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Remote Policy *
            </label>
            <select
              name="remote_policy"
              value={formData.remote_policy}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="remote">🏠 Full Remote</option>
              <option value="hybrid">🔀 Ibrido</option>
              <option value="onsite">🏢 In Sede</option>
            </select>
          </div>
        </div>

        {/* Contract Type + Seniority */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tipo Contratto *
            </label>
            <select
              name="contract_type"
              value={formData.contract_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contratto</option>
              <option value="internship">Stage</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Seniority *
            </label>
            <select
              name="seniority"
              value={formData.seniority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="junior">Junior (0-2 anni)</option>
              <option value="mid">Mid (3-5 anni)</option>
              <option value="senior">Senior (5+ anni)</option>
              <option value="lead">Lead / Principal</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>

        {/* Salary Range */}
        <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💰</span>
            <h3 className="text-lg font-bold text-gray-900">
              Salary Range
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Minimo (€) *
              </label>
              <input
                type="number"
                name="salary_min"
                value={formData.salary_min}
                onChange={handleChange}
                placeholder="30000"
                min="10000"
                max="500000"
                step="1000"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.salary_min ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Massimo (€) *
              </label>
              <input
                type="number"
                name="salary_max"
                value={formData.salary_max}
                onChange={handleChange}
                placeholder="50000"
                min="10000"
                max="500000"
                step="1000"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors.salary_max ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Valuta
              </label>
              <select
                name="salary_currency"
                value={formData.salary_currency}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          {(errors.salary_min || errors.salary_max) && (
            <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.salary_min || errors.salary_max}
            </p>
          )}
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Skills Richieste *
          </label>
          <input
            type="text"
            name="required_skills"
            value={formData.required_skills}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js (separati da virgola)"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              errors.required_skills ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.required_skills && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.required_skills}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Skills Nice-to-Have (Opzionale)
          </label>
          <input
            type="text"
            name="nice_to_have_skills"
            value={formData.nice_to_have_skills}
            onChange={handleChange}
            placeholder="GraphQL, Docker, AWS (separati da virgola)"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Salvataggio...</span>
              </>
            ) : (
              <span>Salva Modifiche 💾</span>
            )}
          </button>
          <Link
            href={`/dashboard/jobs/${jobId}`}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}