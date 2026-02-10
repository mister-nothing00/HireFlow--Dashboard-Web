'use client';

import { useState } from 'react';
import {
  User, Building2, Bell, Moon, Sun, LogOut,
  ChevronRight, Shield, Trash2, Save, Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';
import { showToast } from '@/lib/toast';

export default function SettingsPage() {
  const { user, company, settings, updateSettings } = useStore();
  const { logout } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    // Simula salvataggio (i settings Zustand si salvano già in localStorage)
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    showToast.success('Impostazioni salvate!');
  };

  const handleLogout = async () => {
    if (confirm('Sei sicuro di voler uscire?')) {
      await logout();
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Impostazioni</h1>
        <p className="text-gray-600">Gestisci il tuo account e le preferenze</p>
      </div>

      <div className="space-y-6">

        {/* ── PROFILO RAPIDO ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Profilo & Azienda</h2>
            <Link
              href="/dashboard/settings/profile"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Modifica →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            <Row label="Email" value={user?.email || '—'} />
            <Row label="Nome" value={user?.user_metadata?.full_name || '—'} />
            <Row label="Azienda" value={company?.name || '—'} />
            <Row label="Location" value={company?.location || '—'} />
            <Row label="Settore" value={company?.industry || '—'} />
            <Row label="Dimensione" value={company?.size ? `${company.size} dipendenti` : '—'} />
          </div>

          <div className="px-6 py-4">
            <Link
              href="/dashboard/settings/profile"
              className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition">
                  <Building2 size={18} className="text-blue-600" />
                </div>
                <span className="font-medium text-gray-800 group-hover:text-blue-700">
                  Completa profilo azienda
                </span>
              </div>
              <ChevronRight size={18} className="text-gray-400 group-hover:text-blue-600" />
            </Link>
          </div>
        </div>

        {/* ── NOTIFICHE ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Bell size={20} className="text-orange-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Notifiche</h2>
          </div>

          <div className="space-y-4">
            <Toggle
              label="Notifiche app"
              description="Ricevi notifiche per nuovi match e messaggi"
              checked={settings?.notifications ?? true}
              onChange={v => updateSettings({ notifications: v })}
            />
            <Toggle
              label="Alert email"
              description="Ricevi aggiornamenti via email"
              checked={settings?.emailAlerts ?? true}
              onChange={v => updateSettings({ emailAlerts: v })}
            />
          </div>
        </div>

        {/* ── TEMA ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Sun size={20} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Aspetto</h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => updateSettings({ theme: 'light' })}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition ${
                (settings?.theme ?? 'light') === 'light'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Sun size={22} />
              <span className="font-semibold text-sm">Chiaro</span>
            </button>
            <button
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition ${
                settings?.theme === 'dark'
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Moon size={22} />
              <span className="font-semibold text-sm">Scuro</span>
            </button>
          </div>
        </div>

        {/* ── SICUREZZA ── */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield size={18} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Sicurezza</h2>
          </div>
          <Link
            href="/dashboard/settings/password"
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition"
          >
            <div>
              <p className="font-medium text-gray-800">Cambia password</p>
              <p className="text-sm text-gray-500 mt-0.5">Aggiorna la tua password di accesso</p>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
        </div>

        {/* ── SALVA IMPOSTAZIONI ── */}
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {saving ? 'Salvataggio...' : 'Salva Impostazioni'}
        </button>

        {/* ── DANGER ZONE ── */}
        <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-100 bg-red-50">
            <h2 className="text-lg font-bold text-red-700">Zona Pericolosa</h2>
          </div>
          <div className="divide-y divide-red-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-6 py-4 hover:bg-red-50 transition text-left"
            >
              <LogOut size={18} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-700">Logout</p>
                <p className="text-sm text-red-400">Esci dal tuo account</p>
              </div>
            </button>
            <button
              onClick={() => alert('Contatta support per eliminare l\'account')}
              className="flex items-center gap-3 w-full px-6 py-4 hover:bg-red-50 transition text-left"
            >
              <Trash2 size={18} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-700">Elimina account</p>
                <p className="text-sm text-red-400">Rimuovi permanentemente tutti i tuoi dati</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Componenti interni ───
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between px-6 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}