"use client";

import { useState } from "react";
import { User, Bell, LogOut, ChevronRight, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/lib/hooks/useAuth";
import { showToast } from "@/lib/toast";

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value || "—"}</span>
    </div>
  );
}

export default function SettingsPage() {
  const { user, company, settings, updateSettings } = useApp(); // ✅
  const { logout } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    showToast.success("Impostazioni salvate!");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Impostazioni</h1>
        <p className="text-gray-600">Gestisci il tuo account e le preferenze</p>
      </div>

      <div className="space-y-6">
        {/* Profilo Rapido */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Profilo & Azienda
            </h2>
            <Link
              href="/dashboard/settings/profile"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Modifica →
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            <Row label="Email" value={user?.email} />
            <Row label="Nome" value={user?.user_metadata?.full_name} />
            <Row label="Azienda" value={company?.name} />
            <Row label="Location" value={company?.location} />
            <Row label="Settore" value={company?.industry} />
          </div>
        </div>

        {/* Notifiche */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Notifiche</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              {
                key: "notifications",
                label: "Notifiche in-app",
                desc: "Nuovi match e messaggi",
              },
              {
                key: "emailAlerts",
                label: "Email alerts",
                desc: "Riepilogo settimanale",
              },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between px-6 py-4"
              >
                <div>
                  <p className="font-medium text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <button
                  onClick={() => updateSettings({ [key]: !settings[key] })}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                    settings[key] ? "bg-blue-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block w-4 h-4 bg-white rounded-full shadow transform transition-transform mt-1 ${
                      settings[key] ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Salva */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition font-semibold"
        >
          {saving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {saving ? "Salvataggio..." : "Salva Impostazioni"}
        </button>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition font-semibold border border-red-200"
        >
          <LogOut size={18} />
          Esci dall'account
        </button>
      </div>
    </div>
  );
}
