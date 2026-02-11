"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useApp } from "@/context/AppContext";
import { showToast } from "@/lib/toast";

const REMOTE_OPTIONS = ["remote", "hybrid", "onsite"];
const CONTRACT_OPTIONS = ["full-time", "part-time", "contract", "internship"];
const SENIORITY_OPTIONS = ["junior", "mid", "senior", "lead"];

function FieldError({ msg }) {
  return msg ? (
    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
      <AlertCircle size={13} /> {msg}
    </p>
  ) : null;
}

const INITIAL_FORM = {
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
};

export default function NewJobPage() {
  const router = useRouter();
  const { company } = useApp(); // ✅ Context
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Obbligatorio";
    if (!form.description.trim()) e.description = "Obbligatorio";
    if (!form.location.trim()) e.location = "Obbligatorio";
    if (!form.salary_min) e.salary_min = "Obbligatorio";
    if (!form.salary_max) e.salary_max = "Obbligatorio";
    if (!form.required_skills.trim()) e.required_skills = "Almeno una skill";

    const min = parseInt(form.salary_min);
    const max = parseInt(form.salary_max);
    if (min && max && min >= max)
      e.salary_max = "Deve essere maggiore del minimo";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) return;

      if (!company?.id) {
        showToast.error("Errore: ricarica la pagina");
        return;
      }

      setLoading(true);
      try {
        const jobData = {
          company_id: company.id,
          title: form.title.trim(),
          description: form.description.trim(),
          location: form.location.trim(),
          remote_policy: form.remote_policy,
          contract_type: form.contract_type,
          salary_min: parseInt(form.salary_min),
          salary_max: parseInt(form.salary_max),
          salary_currency: form.salary_currency,
          required_skills: form.required_skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          nice_to_have_skills: form.nice_to_have_skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          seniority: form.seniority,
          experience_years_min: form.experience_years_min
            ? parseInt(form.experience_years_min)
            : null,
          is_active: true,
        };

        const { data, error } = await supabase
          .from("jobs")
          .insert([jobData])
          .select()
          .single();
        if (error) throw error;

        showToast.success("✅ Job pubblicato!");
        router.push("/dashboard/jobs");
      } catch (err) {
        console.error("❌ Error creating job:", err);
        showToast.error(`Errore: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [form, company?.id, router],
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft size={18} /> Torna ai Jobs
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Pubblica Nuovo Job
        </h1>
        <p className="text-gray-500 text-sm">
          Compila tutti i campi — salary range obbligatorio! Zero ghosting 🚀
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6"
      >
        {/* Titolo */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Titolo Job <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="es. Frontend Developer, UX Designer..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition ${errors.title ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          <FieldError msg={errors.title} />
        </div>

        {/* Descrizione */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Descrizione <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Descrivi il ruolo, responsabilità, cosa offrite..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none transition ${errors.description ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          <FieldError msg={errors.description} />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="es. Milano, Roma, Remote..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition ${errors.location ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          <FieldError msg={errors.location} />
        </div>

        {/* Remote + Contratto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Remote Policy <span className="text-red-500">*</span>
            </label>
            <select
              name="remote_policy"
              value={form.remote_policy}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            >
              {REMOTE_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tipo Contratto <span className="text-red-500">*</span>
            </label>
            <select
              name="contract_type"
              value={form.contract_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
            >
              {CONTRACT_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Salary Range Annuo <span className="text-red-500">*</span>
            <span className="text-gray-400 font-normal ml-2">
              — trasparenza totale, obbligatorio
            </span>
          </label>
          <div className="flex items-center gap-3">
            <select
              name="salary_currency"
              value={form.salary_currency}
              onChange={handleChange}
              className="px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white w-24"
            >
              {["EUR", "USD", "GBP"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
            <input
              name="salary_min"
              type="number"
              value={form.salary_min}
              onChange={handleChange}
              placeholder="Min"
              className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm ${errors.salary_min ? "border-red-400" : "border-gray-200"}`}
            />
            <span className="text-gray-400 font-bold">–</span>
            <input
              name="salary_max"
              type="number"
              value={form.salary_max}
              onChange={handleChange}
              placeholder="Max"
              className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm ${errors.salary_max ? "border-red-400" : "border-gray-200"}`}
            />
          </div>
          <FieldError msg={errors.salary_min || errors.salary_max} />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Skills Richieste <span className="text-red-500">*</span>{" "}
            <span className="text-gray-400 font-normal">
              (separate da virgola)
            </span>
          </label>
          <input
            name="required_skills"
            value={form.required_skills}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition ${errors.required_skills ? "border-red-400 bg-red-50" : "border-gray-200"}`}
          />
          <FieldError msg={errors.required_skills} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Nice to Have{" "}
            <span className="text-gray-400 font-normal">(opzionale)</span>
          </label>
          <input
            name="nice_to_have_skills"
            value={form.nice_to_have_skills}
            onChange={handleChange}
            placeholder="GraphQL, Docker, AWS"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        {/* Seniority + Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Seniority
            </label>
            <select
              name="seniority"
              value={form.seniority}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white capitalize"
            >
              {SENIORITY_OPTIONS.map((o) => (
                <option key={o} value={o} className="capitalize">
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Anni Esperienza Min
            </label>
            <input
              name="experience_years_min"
              type="number"
              value={form.experience_years_min}
              onChange={handleChange}
              placeholder="es. 3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/dashboard/jobs"
            className="flex-1 text-center px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Pubblicando...
              </>
            ) : (
              <>
                <Plus size={18} /> Pubblica Job
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
