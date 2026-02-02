'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, User, Building2, MapPin, Users, 
  ArrowRight, ArrowLeft, Check, AlertCircle, Loader2 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';

const STEPS = [
  { id: 1, name: 'Account', icon: User },
  { id: 2, name: 'Azienda', icon: Building2 },
  { id: 3, name: 'Conferma', icon: Check },
];

export default function SignupPage() {
  const router = useRouter();
  const { setCompany } = useStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state consolidato
  const [formData, setFormData] = useState({
    // Step 1: Account
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    
    // Step 2: Azienda
    companyName: '',
    companyWebsite: '',
    companyLocation: '',
    companySize: '11-50',
    industry: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Compila tutti i campi obbligatori');
      return false;
    }
    if (formData.password.length < 8) {
      setError('La password deve essere di almeno 8 caratteri');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Le password non corrispondono');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.companyName || !formData.companyLocation) {
      setError('Compila almeno Nome azienda e Location');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    
    setCurrentStep(currentStep + 1);
    setError('');
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Starting signup process...');

      // 1. Crea utente su Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: 'recruiter',
          },
        },
      });

      if (authError) throw authError;

      console.log('✅ User created:', authData.user.email);

      // 2. Crea company su DB (collegata al nuovo user)
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{
          owner_id: authData.user.id, // ✅ COLLEGAMENTO USER → COMPANY
          name: formData.companyName,
          website: formData.companyWebsite || null,
          location: formData.companyLocation,
          size: formData.companySize,
          industry: formData.industry || null,
        }])
        .select()
        .single();

      if (companyError) {
        console.error('❌ Company creation error:', companyError);
        throw companyError;
      }

      console.log('✅ Company created:', companyData.name);

      // 3. Salva company nello store globale
      setCompany(companyData);

      // 4. Redirect a dashboard
      console.log('✅ Redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err) {
      console.error('❌ Signup error:', err);
      setError(err.message || 'Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className={`
                  flex items-center justify-center w-12 h-12 rounded-full transition-all
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-600/20' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                `}>
                  {isCompleted ? <Check size={24} /> : <Icon size={24} />}
                </div>

                {/* Line */}
                {index < STEPS.length - 1 && (
                  <div className={`
                    flex-1 h-1 mx-2 transition-all
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-3">
          {STEPS.map((step) => (
            <div key={step.id} className="flex-1 text-center">
              <p className={`text-sm font-medium ${
                currentStep >= step.id ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
          <span className="text-3xl">🚀</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentStep === 1 && 'Crea il tuo account'}
          {currentStep === 2 && 'Informazioni azienda'}
          {currentStep === 3 && 'Conferma e inizia'}
        </h1>
        <p className="text-gray-600">
          {currentStep === 1 && 'Inizia a trovare i candidati perfetti'}
          {currentStep === 2 && 'Aiutaci a conoscerti meglio'}
          {currentStep === 3 && 'Sei pronto per rivoluzionare il recruiting'}
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* STEP 1: Account */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Mario Rossi"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email aziendale
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tua@azienda.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimo 8 caratteri"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Conferma password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Ripeti la password"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Azienda */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nome azienda *
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Tech Startup Inc."
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sito web (opzionale)
              </label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                placeholder="https://tuaazienda.com"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
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
                  placeholder="Milano, IT"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Dimensione azienda
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition appearance-none"
                >
                  <option value="1-10">1-10 dipendenti</option>
                  <option value="11-50">11-50 dipendenti</option>
                  <option value="51-200">51-200 dipendenti</option>
                  <option value="201-500">201-500 dipendenti</option>
                  <option value="500+">500+ dipendenti</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Settore (opzionale)
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="es. Technology, Finance, Healthcare..."
                className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Conferma */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Riepilogo Account</h3>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Nome</dt>
                  <dd className="font-semibold text-gray-900">{formData.fullName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Email</dt>
                  <dd className="font-semibold text-gray-900">{formData.email}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Azienda</dt>
                  <dd className="font-semibold text-gray-900">{formData.companyName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Location</dt>
                  <dd className="font-semibold text-gray-900">{formData.companyLocation}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex gap-3">
                <Check className="text-green-600 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold text-green-900">Tutto pronto!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Clicca su "Crea Account" per iniziare.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="flex-1 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              <span>Indietro</span>
            </button>
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="flex-1 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Continua</span>
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Creazione account...</span>
                </>
              ) : (
                <>
                  <Check size={20} />
                  <span>Crea Account</span>
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Hai già un account?{' '}
          <Link 
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
}