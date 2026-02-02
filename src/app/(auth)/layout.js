'use client';

import Link from 'next/link';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl" />
      </div>

      {/* Logo top-left */}
      <Link 
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-900 hover:text-blue-600 transition z-10"
      >
        <span className="text-2xl">🚀</span>
        <span className="text-xl font-bold">HireFlow</span>
      </Link>

      {/* Content */}
      <div className="relative w-full max-w-md">
        {children}
      </div>
    </div>
  );
}