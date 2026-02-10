'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, User, Building2, Mail, MapPin, Globe,
  Save, Loader2, Camera, Linkedin, Twitter, Instagram,
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';
import { SkeletonCandidateProfile } from '@/components/ui/Skeletons';

export default function ProfileEditPage() {
  const { user, company, setCompany } = useStore();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    // User
    fullName: '',
    // Company
    companyName: '',
    companyWebsite: '',
    companyLocation: '',
    companySize: '11-50',
    industry: '',
    description: '',
    // Social
    linkedin: '',
    twitter: '',
    instagram: '',
  });

  useEffect(() => {
    if (user && company) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        companyName: company.name || '',
        companyWebsite: company.website || '',
        companyLocation: company.location || '',
        companySize: company.size || '11-50',
        industry: company.industry || '',
        description: company.description || '',
        linkedin: company.linkedin || '',
        twitter: company.twitter || '',
        instagram: company.instagram || '',
      });
    }
  }, [user, company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Upload logo azienda ──
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !company?.id) return;

    // Validazione
    if (!file.type.startsWith('image/')) {
      showToast.error('Solo file immagine supportati (jpg, png, webp)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast.error('Immagine troppo grande (max 2MB)');
      return;
    }

    setUploadingLogo(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `logos/${company.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('company-assets')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('company-assets')
        .getPublicUrl(path);

      // Aggiorna company nel DB
      const { data, error } = await supabase
        .from('companies')
        .update({ logo_url: publicUrl })
        .eq('id', company.id)
        .select()
        .single();

      if (error) throw error;

      setCompany(data);
      showToast.success('Logo aggiornato!');
    } catch (error) {
      console.error('❌ Logo upload error:', error);
      showToast.error('Errore nel caricamento logo');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update user metadata
      const { error: userError } = await supabase.auth.updateUser({
        data: { full_name: formData.fullName },
      });
      if (userError) throw userError;

      // 2. Update company (tutti i campi in una sola query)
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .update({
          name: formData.companyName,
          website: formData.companyWebsite || null,
          location: formData.companyLocation,
          size: formData.companySize,
          industry: formData.industry || null,
          description: formData.description || null,
          linkedin: formData.linkedin || null,
          twitter: formData.twitter || null,
          instagram: formData.instagram || null,
        })
        .eq('id', company.id)
        .eq('owner_id', user.id) // security check
        .select()
        .single();

      if (companyError) throw companyError;

      setCompany(companyData);
      showToast.success('Profilo aggiornato con successo!');
    } catch (error) {
      console.error('❌ Profile update error:', error);
      showToast.error(error.message || 'Errore nell\'aggiornamento del profilo');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !company) return <SkeletonCandidateProfile />;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
        >
          <ArrowLeft size={20} />
          <span>Torna alle Impostazioni</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Modifica Profilo</h1>
        <p className="text-gray-600">Aggiorna le informazioni del tuo account e dell'azienda</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── LOGO AZIENDA ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Camera size={22} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Logo Azienda</h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Preview logo */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                {company?.logo_url ? (
                  <img src={company.logo_url} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl">🏢</span>
                )}
              </div>
              {uploadingLogo && (
                <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                </div>
              )}
            </div>

            {/* Upload button */}
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Carica un logo per la tua azienda. Formati supportati: JPG, PNG, WebP (max 2MB)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm disabled:opacity-50 flex items-center gap-2"
              >
                <Camera size={16} />
                {uploadingLogo ? 'Caricamento...' : 'Carica Logo'}
              </button>
            </div>
          </div>
        </div>

        {/* ── INFORMAZIONI PERSONALI ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User size={22} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Informazioni Personali</h2>
          </div>

          <div className="space-y-5">
            <Field label="Nome Completo" required>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </Field>

            <Field label="Email">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className={`${inputCls} pl-12 bg-gray-50 text-gray-400 cursor-not-allowed`}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">L'email non può essere modificata</p>
            </Field>
          </div>
        </div>

        {/* ── INFORMAZIONI AZIENDA ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 size={22} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Informazioni Azienda</h2>
          </div>

          <div className="space-y-5">
            <Field label="Nome Azienda" required>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className={inputCls}
              />
            </Field>

            <Field label="Descrizione Azienda">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descrivi la tua azienda, la cultura, i valori..."
                rows={4}
                className={`${inputCls} resize-none`}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.description.length}/500 caratteri
              </p>
            </Field>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Sito Web">
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://tuaazienda.com"
                    className={`${inputCls} pl-12`}
                  />
                </div>
              </Field>

              <Field label="Location" required>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="companyLocation"
                    value={formData.companyLocation}
                    onChange={handleChange}
                    required
                    placeholder="Milano, IT"
                    className={`${inputCls} pl-12`}
                  />
                </div>
              </Field>

              <Field label="Dimensione Azienda">
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="1-10">1-10 dipendenti</option>
                  <option value="11-50">11-50 dipendenti</option>
                  <option value="51-200">51-200 dipendenti</option>
                  <option value="201-500">201-500 dipendenti</option>
                  <option value="500+">500+ dipendenti</option>
                </select>
              </Field>

              <Field label="Settore">
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="es. Technology, Finance..."
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* ── SOCIAL LINKS ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-sky-100 rounded-lg">
              <Linkedin size={22} className="text-sky-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Social & Link</h2>
          </div>

          <div className="space-y-4">
            <Field label="LinkedIn">
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/company/..."
                  className={`${inputCls} pl-12`}
                />
              </div>
            </Field>

            <Field label="Twitter / X">
              <div className="relative">
                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400" size={18} />
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="https://twitter.com/..."
                  className={`${inputCls} pl-12`}
                />
              </div>
            </Field>

            <Field label="Instagram">
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-500" size={18} />
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                  className={`${inputCls} pl-12`}
                />
              </div>
            </Field>
          </div>
        </div>

        {/* ── SUBMIT ── */}
        <div className="flex items-center gap-4 pb-8">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 className="animate-spin" size={20} /><span>Salvataggio...</span></>
              : <><Save size={20} /><span>Salva Modifiche</span></>
            }
          </button>
          <Link
            href="/dashboard/settings"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
          >
            Annulla
          </Link>
        </div>

      </form>
    </div>
  );
}

// ─── Componenti interni ───
const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}