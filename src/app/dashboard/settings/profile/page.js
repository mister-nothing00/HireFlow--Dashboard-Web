'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, User, Building2, Mail, MapPin, Globe, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/lib/toast';

export default function ProfileEditPage() {
  const { user, company, setCompany } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // User data
    fullName: '',
    email: '',
    
    // Company data
    companyName: '',
    companyWebsite: '',
    companyLocation: '',
    companySize: '11-50',
    industry: '',
  });

  useEffect(() => {
    if (user && company) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        companyName: company.name || '',
        companyWebsite: company.website || '',
        companyLocation: company.location || '',
        companySize: company.size || '11-50',
        industry: company.industry || '',
      });
    }
  }, [user, company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    console.log('🚀 Starting profile update...');

    // 1. Update user metadata (più veloce)
    console.log('📝 Updating user metadata...');
    const { error: userError } = await supabase.auth.updateUser({
      data: {
        full_name: formData.fullName,
      },
    });

    if (userError) {
      console.error('❌ User update error:', userError);
      throw userError;
    }
    console.log('✅ User metadata updated');

    // 2. Update company data
    console.log('📝 Updating company data...');
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .update({
        name: formData.companyName,
        website: formData.companyWebsite || null,
        location: formData.companyLocation,
        size: formData.companySize,
        industry: formData.industry || null,
      })
      .eq('id', company.id)
      .eq('owner_id', user.id) // ✅ Security check
      .select()
      .single();

    if (companyError) {
      console.error('❌ Company update error:', companyError);
      throw companyError;
    }
    console.log('✅ Company data updated:', companyData);

    // 3. Update store
    setCompany(companyData);

    console.log('✅ Profile update complete!');
    showToast.success('Profilo aggiornato con successo!');
  } catch (error) {
    console.error('❌ Full error:', error);
    showToast.error(error.message || 'Errore nell\'aggiornamento del profilo');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={20} />
          <span>Torna alle Impostazioni</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Modifica Profilo
        </h1>
        <p className="text-gray-600">
          Aggiorna le tue informazioni personali e aziendali
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* User Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User size={24} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Informazioni Personali
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                L'email non può essere modificata
              </p>
            </div>
          </div>
        </div>

        {/* Company Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 size={24} className="text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Informazioni Azienda
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome Azienda *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sito Web
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://tuaazienda.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  required
                  placeholder="Milano, IT"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Dimensione Azienda
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                >
                  <option value="1-10">1-10 dipendenti</option>
                  <option value="11-50">11-50 dipendenti</option>
                  <option value="51-200">51-200 dipendenti</option>
                  <option value="201-500">201-500 dipendenti</option>
                  <option value="500+">500+ dipendenti</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Settore
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="es. Technology, Finance..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Salvataggio...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Salva Modifiche</span>
              </>
            )}
          </button>
          <Link
            href="/dashboard/settings"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
          >
            Annulla
          </Link>
        </div>
      </form>
    </div>
  );
}