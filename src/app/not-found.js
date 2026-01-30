// src/app/not-found.js
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated 404 */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            404
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Pagina Non Trovata
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            La pagina che stai cercando non esiste o è stata spostata.
            <br />
            Non preoccuparti, ti riportiamo sulla strada giusta! 🚀
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
          >
            <Home size={20} />
            Vai alla Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition font-semibold border-2 border-gray-300"
          >
            <ArrowLeft size={20} />
            Torna Indietro
          </button>
        </div>

        {/* Fun Animation */}
        <div className="mt-12 text-6xl animate-bounce">
          🔍
        </div>
      </div>
    </div>
  );
}