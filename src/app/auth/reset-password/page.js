'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, Loader2, Check } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      router.push('/auth/login'); // ✅ FIX
    }
  }, [router]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) { setError('La password deve essere almeno 8 caratteri'); return; }
    if (password !== confirmPassword) { setError('Le password non corrispondono'); return; }
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2000); // ✅ FIX
    } catch (err) {
      setError(err.message || 'Errore nel reset della password');
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIX: rimosso il layout wrapper esterno — usa il layout di /auth/
  if (success) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="text-green-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Aggiornata!</h2>
        <p className="text-gray-600">Reindirizzamento al login...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">
      <Link href="/auth/login" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition">
        <ArrowLeft size={20} />
        <span>Torna al login</span>
      </Link>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg shadow-blue-600/30">
          <Lock className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nuova Password</h1>
        <p className="text-gray-600">Inserisci la tua nuova password</p>
      </div>

      <form onSubmit={handleReset} className="space-y-5">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nuova Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Almeno 8 caratteri" required minLength={8} disabled={loading}
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Conferma Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Reinserisci la password" required disabled={loading}
            className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button type="submit" disabled={loading || !password || !confirmPassword}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="animate-spin" size={20} /><span>Aggiornamento...</span></> : 'Resetta Password'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <p className="text-sm text-blue-900"><strong>Requisiti:</strong> Minimo 8 caratteri</p>
      </div>
    </div>
  );
}