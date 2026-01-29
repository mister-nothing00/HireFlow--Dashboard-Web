import Link from 'next/link';
import { Briefcase, Users, MessageCircle, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">🚀 HireFlow</span>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/login" 
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Registrati
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Trova i candidati perfetti
            <br />
            <span className="text-blue-600">con un semplice swipe</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            La piattaforma di recruiting che porta trasparenza e velocità 
            nel processo di assunzione. Salary sempre visibile, match istantanei.
          </p>
          <Link 
            href="/signup"
            className="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-lg"
          >
            Inizia Gratis
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-4 gap-8 mt-20">
          <FeatureCard 
            icon={<Briefcase className="w-8 h-8 text-blue-600" />}
            title="Pubblica Job"
            description="Crea annunci con salary trasparente in 2 minuti"
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-blue-600" />}
            title="Swipe Candidati"
            description="Scorri profili qualificati come su Tinder"
          />
          <FeatureCard 
            icon={<MessageCircle className="w-8 h-8 text-blue-600" />}
            title="Chat Diretta"
            description="Parla subito con i match senza intermediari"
          />
          <FeatureCard 
            icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
            title="AI Matching"
            description="L'AI trova i candidati più compatibili"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}