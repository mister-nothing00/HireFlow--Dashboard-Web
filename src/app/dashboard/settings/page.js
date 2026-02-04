// src/app/dashboard/settings/page.js
"use client";

import { useState } from "react";
import { Bell, Mail, Moon, Sun, Save } from "lucide-react";
import { useStore } from "@/lib/store";
import Link from "next/link";

export default function SettingsPage() {
  const { settings, updateSettings, user, company } = useStore();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // TODO: Salvare settings su Supabase quando auth implementata
    await new Promise((resolve) => setTimeout(resolve, 500)); // Mock delay
    setSaving(false);
    showToast.success("✅ Impostazioni salvate!");
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Impostazioni</h1>

      {/* Notifiche */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={24} className="text-blue-600" />
          Notifiche
        </h2>

        <div className="space-y-4">
          <ToggleSetting
            label="Notifiche Push"
            description="Ricevi notifiche per nuovi match e messaggi"
            checked={settings.notifications}
            onChange={(checked) => updateSettings({ notifications: checked })}
          />
          <ToggleSetting
            label="Email Alerts"
            description="Ricevi email per match e messaggi importanti"
            checked={settings.emailAlerts}
            onChange={(checked) => updateSettings({ emailAlerts: checked })}
          />
        </div>
      </div>

      {/* Tema */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          {settings.theme === "light" ? (
            <Sun size={24} className="text-yellow-500" />
          ) : (
            <Moon size={24} className="text-indigo-600" />
          )}
          Tema
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() => updateSettings({ theme: "light" })}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
              settings.theme === "light"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            <Sun size={20} className="mx-auto mb-2" />
            <span className="font-semibold">Chiaro</span>
          </button>
          <button
            onClick={() => updateSettings({ theme: "dark" })}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${
              settings.theme === "dark"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 text-gray-700 hover:border-gray-400"
            }`}
          >
            <Moon size={20} className="mx-auto mb-2" />
            <span className="font-semibold">Scuro</span>
          </button>
        </div>
      </div>

      {/* Info Account */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Account</h2>
          <Link
            href="/dashboard/settings/profile"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Modifica →
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Email</span>
            <span className="font-semibold">{user?.email || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Nome</span>
            <span className="font-semibold">
              {user?.user_metadata?.full_name || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Azienda</span>
            <span className="font-semibold">{company?.name || "N/A"}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Location</span>
            <span className="font-semibold">{company?.location || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Save size={20} />
        {saving ? "Salvataggio..." : "Salva Modifiche"}
      </button>
    </div>
  );
}

// Component Helper
function ToggleSetting({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="font-semibold text-gray-900">{label}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
          checked ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
