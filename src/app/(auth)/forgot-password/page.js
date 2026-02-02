'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
      console.log('✅ Password reset email sent to:', email);
    } catch (err) {
      console.error('❌ Reset error:', err);
      setError(err.message || 'Errore nell\'invio dell\'email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
      {/* Back Button */}
      <Link 
        href="/login"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <ArrowLeft size={20} />
        <span>Torna al login</span>
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
          <span className="text-3xl">🔐</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Password Dimenticata?
        </h1>
        <p className="text-gray-600">
          Inserisci la tua email e ti invieremo un link per resetarla
        </p>
      </div>

      {/* Success State */}
      {success ? (
        <div className="space-y-6">
          <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="text-white" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-green-900 mb-1">Email Inviata!</h3>
                <p className="text-sm text-green-700">
                  Abbiamo inviato un link per resettare la password a:
                </p>
                <p className="text-sm font-semibold text-green-900 mt-1">{email}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900">
              <strong>📧 Controlla la tua inbox</strong>
              <br />
              Il link è valido per 1 ora. Se non trovi l'email, controlla anche lo spam.
            </p>
          </div>

          <Link
            href="/login"
            className="block w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition text-center"
          >
            Torna al Login
          </Link>
        </div>
      ) : (
        <>
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Errore</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tua@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Invio in corso...</span>
                </>
              ) : (
                <span>Invia Link di Reset</span>
              )}
            </button>
          </form>
        </>
      )}
    </div>
  );
}