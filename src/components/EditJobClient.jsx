"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { showToast } from "@/lib/toast";

// Componente per modificare o eliminare un lavoro esistente, con form precompilato e gestione dello stato di caricamento
export default function EditJobClient({ job, company }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    title: job.title || "",
    description: job.description || "",
    location: job.location || "",
    contract_type: job.contract_type || "full-time",
    remote_policy: job.remote_policy || "hybrid",
    salary_min: job.salary_min || "",
    salary_max: job.salary_max || "",
    salary_currency: job.salary_currency || "EUR",
    required_skills: job.required_skills?.join(", ") || "",
    seniority: job.seniority || "mid",
    is_active: job.is_active ?? true,
  });

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      showToast.error("Compila i campi obbligatori");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("jobs")
        .update({
          title: form.title,
          description: form.description,
          location: form.location,
          contract_type: form.contract_type,
          remote_policy: form.remote_policy,
          salary_min: parseInt(form.salary_min) || 0,
          salary_max: parseInt(form.salary_max) || 0,
          salary_currency: form.salary_currency,
          required_skills: form.required_skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          seniority: form.seniority,
          is_active: form.is_active,
        })
        .eq("id", job.id)
        .eq("company_id", company.id);

      if (error) throw error;

      showToast.success("Lavoro aggiornato!");
      router.push("/dashboard/jobs");
    } catch (err) {
      console.error("❌ Update job error:", err);
      showToast.error(err.message || "Errore aggiornamento");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Sei sicuro di voler eliminare questo lavoro?")) return;

    setDeleting(true);

    try {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", job.id)
        .eq("company_id", company.id);

      if (error) throw error;

      showToast.success("Lavoro eliminato!");
      router.push("/dashboard/jobs");
    } catch (err) {
      console.error("❌ Delete job error:", err);
      showToast.error(err.message || "Errore eliminazione");
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/jobs"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Modifica Lavoro
              </h1>
              <p className="text-gray-600 mt-1">
                Aggiorna i dettagli del lavoro
              </p>
            </div>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition disabled:opacity-50"
          >
            {deleting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Trash2 size={18} />
            )}
            <span>Elimina</span>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleUpdate}
          className="bg-white rounded-xl border border-gray-200 p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titolo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="es. Senior React Developer"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrizione <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Descrivi il ruolo, le responsabilità..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Località
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="es. Milano, Italia"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Contract & Remote */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo Contratto
              </label>
              <select
                value={form.contract_type}
                onChange={(e) =>
                  setForm({ ...form, contract_type: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contratto</option>
                <option value="internship">Stage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Policy Remote
              </label>
              <select
                value={form.remote_policy}
                onChange={(e) =>
                  setForm({ ...form, remote_policy: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="remote">Full Remote</option>
                <option value="hybrid">Ibrido</option>
                <option value="onsite">In sede</option>
              </select>
            </div>
          </div>

          {/* Salary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salario Min (€)
              </label>
              <input
                type="number"
                value={form.salary_min}
                onChange={(e) =>
                  setForm({ ...form, salary_min: e.target.value })
                }
                placeholder="30000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salario Max (€)
              </label>
              <input
                type="number"
                value={form.salary_max}
                onChange={(e) =>
                  setForm({ ...form, salary_max: e.target.value })
                }
                placeholder="50000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valuta
              </label>
              <select
                value={form.salary_currency}
                onChange={(e) =>
                  setForm({ ...form, salary_currency: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills Richieste
            </label>
            <input
              type="text"
              value={form.required_skills}
              onChange={(e) =>
                setForm({ ...form, required_skills: e.target.value })
              }
              placeholder="React, Node.js, TypeScript (separati da virgola)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">Separa con virgole</p>
          </div>

          {/* Seniority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seniority
            </label>
            <select
              value={form.seniority}
              onChange={(e) => setForm({ ...form, seniority: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={form.is_active}
              onChange={(e) =>
                setForm({ ...form, is_active: e.target.checked })
              }
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm font-medium text-gray-700"
            >
              Lavoro attivo (visibile ai candidati)
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Salvataggio...</span>
                </>
              ) : (
                "Salva Modifiche"
              )}
            </button>

            <Link
              href="/dashboard/jobs"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Annulla
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
