"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
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

    // Salary validation
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

  setLoading(true);

  try {
    // Parse skills (comma separated)
    const requiredSkillsArray = formData.required_skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const niceToHaveSkillsArray = formData.nice_to_have_skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Prepare data for Supabase
    const jobData = {
      company_id: 'cdf8c6e0-8f89-4d3f-b123-456789abcdef',
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
      is_active: true,
    };

    console.log('🚀 Starting job creation...');
    console.log('📦 Job data:', JSON.stringify(jobData, null, 2));

    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    console.log('📊 Supabase full response:', { data, error });
    
    if (error) {
      console.error('❌ Detailed error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: JSON.stringify(error, null, 2)
      });
      alert(`Errore Supabase: ${error.message || 'Unknown error'}\n\nDettagli: ${JSON.stringify(error, null, 2)}`);
      return;
    }

    console.log('✅ Job created:', data);
    alert('✅ Job pubblicato con successo!');
    router.push('/dashboard/jobs');
  } catch (error) {
    console.error('❌ Catch error:', error);
    console.error('Error stack:', error.stack);
    alert('Errore nella pubblicazione del job. Controlla la console!');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Torna ai Jobs</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Pubblica Nuovo Job
        </h1>
        <p className="text-gray-600">
          Compila tutti i campi per creare un annuncio trasparente
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

        {/* Salary Range - IL CUORE DELLA TRASPARENZA! 💰 */}
        <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">💰</span>
            <h3 className="text-lg font-bold text-gray-900">
              Salary Range (Obbligatorio per Trasparenza!)
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

          <p className="mt-3 text-xs text-gray-600">
            💡 <strong>Tip:</strong> Aziende con salary trasparente ricevono
            1.5x più candidature!
          </p>
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
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Pubblicazione..." : "Pubblica Job 🚀"}
          </button>
          <Link
            href="/dashboard/jobs"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}
