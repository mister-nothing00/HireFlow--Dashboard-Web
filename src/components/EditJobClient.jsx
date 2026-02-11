// ════════   ═══════════════════════════════════
// src/app/dashboard/jobs/[id]/edit/EditJobClient.jsx
// CLIENT COMPONENT
// ═══════════════════════════════════════════
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // ✅ CLIENT supabase
import { showToast } from "@/lib/toast";

const REMOTE_OPTIONS = ["remote", "hybrid", "onsite"];
const CONTRACT_OPTIONS = ["full-time", "part-time", "contract", "internship"];
const SENIORITY_OPTIONS = ["junior", "mid", "senior", "lead", "principal"];
const CURRENCY_OPTIONS = ["EUR", "USD", "GBP"];

function FieldError({ msg }) {
  return msg ? (
    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
      <AlertCircle size={13} /> {msg}
    </p>
  ) : null;
}

function Label({ children, required }) {
  return (
    <label className="block text-sm font-semibold text-gray-900 mb-2">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function Input({ name, value, onChange, error, ...rest }) {
  return (
    <>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm ${
          error ? "border-red-400 bg-red-50" : "border-gray-200"
        }`}
        {...rest}
      />
      <FieldError msg={error} />
    </>
  );
}

export default function EditJobClient({ job, company }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    title: job.title || "",
    description: job.description || "",
    location: job.location || "",
    remote_policy: job.remote_policy || "hybrid",
    contract_type: job.contract_type || "full-time",
    salary_min: job.salary_min || "",
    salary_max: job.salary_max || "",
    salary_currency: job.salary_currency || "EUR",
    required_skills: job.required_skills?.join(", ") || "",
    nice_to_have_skills: job.nice_to_have_skills?.join(", ") || "",
    seniority: job.seniority || "mid",
    experience_years_min: job.experience_years_min || "",
  });

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

      setSaving(true);
      try {
        const jobData = {
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
        };

        const { error } = await supabase
          .from("jobs")
          .update(jobData)
          .eq("id", job.id)
          .eq("company_id", company.id);

        if (error) throw error;

        showToast.success("✅ Job aggiornato!");
        router.push(`/dashboard/jobs/${job.id}`);
      } catch (err) {
        console.error("❌ Update error:", err);
        showToast.error(`Errore: ${err.message}`);
      } finally {
        setSaving(false);
      }
    },
    [form, job.id, company.id, router],
  );

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <Link
          href={`/dashboard/jobs/${job.id}`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft size={18} /> Torna al Job
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Modifica Job</h1>
        <p className="text-gray-500 text-sm">
          Aggiorna le informazioni dell'annuncio
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6"
      >
        {/* Titolo */}
        <div>
          <Label required>Titolo Job</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="es. Frontend Developer"
            error={errors.title}
          />
        </div>

        {/* Descrizione */}
        <div>
          <Label required>Descrizione</Label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Descrivi il ruolo, le responsabilità..."
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-sm resize-none ${
              errors.description
                ? "border-red-400 bg-red-50"
                : "border-gray-200"
            }`}
          />
          <FieldError msg={errors.description} />
        </div>

        {/* Location */}
        <div>
          <Label required>Location</Label>
          <Input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="es. Milano, Roma, Remote..."
            error={errors.location}
          />
        </div>

        {/* Remote + Contract */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label required>Remote Policy</Label>
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
            <Label required>Tipo Contratto</Label>
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
          <Label required>Salary Range (annuo)</Label>
          <div className="flex items-center gap-3">
            <select
              name="salary_currency"
              value={form.salary_currency}
              onChange={handleChange}
              className="px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white w-24"
            >
              {CURRENCY_OPTIONS.map((o) => (
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
          <Label required>Skills Richieste (virgola-separated)</Label>
          <Input
            name="required_skills"
            value={form.required_skills}
            onChange={handleChange}
            placeholder="React, TypeScript, Node.js"
            error={errors.required_skills}
          />
        </div>
        <div>
          <Label>Nice to Have</Label>
          <Input
            name="nice_to_have_skills"
            value={form.nice_to_have_skills}
            onChange={handleChange}
            placeholder="GraphQL, Docker, AWS"
          />
        </div>

        {/* Seniority + Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Seniority</Label>
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
            <Label>Anni di Esperienza Min</Label>
            <Input
              name="experience_years_min"
              type="number"
              value={form.experience_years_min}
              onChange={handleChange}
              placeholder="es. 3"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <Link
            href={`/dashboard/jobs/${job.id}`}
            className="flex-1 text-center px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
          >
            Annulla
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Salvataggio...
              </>
            ) : (
              <>
                <Save size={18} /> Salva Modifiche
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
