import Link from "next/link";
import {
  TrendingUp,
  CheckCircle,
  Euro,
  Zap,
  Shield,
  ArrowRight,
  Star,
  Users,
  Briefcase,
  Heart,
  Smartphone,
  Download,
} from "lucide-react";
import TypingTitle from "@/components/ui/TypingTitle";
import HeroStats from "@/components/ui/HeroStats";
import UltimateHeroDemo from "@/components/ui/UltimateHeroDemo.jsx";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-3xl">🚀</span>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  HireFlow
                </span>
                <p className="text-xs text-gray-500">
                  Il Recruiting Trasparente
                </p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Features
              </a>
              <a
                href="#app"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                App Mobile
              </a>
              <a
                href="#demo"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Demo
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-blue-600 transition font-medium"
              >
                Prezzi
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 font-semibold transition hidden md:block"
              >
                Accedi
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold shadow-lg shadow-blue-600/30 transition"
              >
                Inizia Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/*  Testo + Stats */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold shadow-md">
                <span className="text-lg">🎉</span>
                <span>La rivoluzione del recruiting è qui</span>
              </div>

              {/* Typing Title */}
              <TypingTitle />
              {/* Animated Stats */}

              {/* Subtitle */}
              <p className="text-xl text-gray-600 leading-relaxed">
                Dimentica CV infiniti e processi lunghi mesi. Con HireFlow trovi
                i candidati perfetti in{" "}
                <strong className="text-blue-600">72 ore</strong>, proprio come
                su Tinder.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-xl shadow-blue-600/30 transition hover:scale-105 text-center"
                >
                  Inizia Gratis
                </Link>

                <a
                  href="#demo"
                  className="px-8 py-4 bg-white text-gray-900 rounded-xl border-2 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition font-bold text-lg shadow-lg text-center"
                >
                  Guarda Demo
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-semibold">Gratis per candidati</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="font-semibold">No carta richiesta</span>
                </div>
              </div>
            </div>

            {/* Swipe Demo */}
            <div className="relative lg:pl-8">
              <UltimateHeroDemo />
            </div>
            <HeroStats />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Perché Scegliere HireFlow?
            </h2>
            <p className="text-xl text-gray-600">
              Il futuro del recruiting è qui. Veloce, trasparente, efficace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon={<Zap size={40} />}
              title="Velocità Estrema"
              description="Dal primo swipe all'assunzione in soli 72 ore. Zero tempi morti, solo risultati."
              gradient="from-yellow-400 to-orange-500"
            />
            <Feature
              icon={<Euro size={40} />}
              title="Trasparenza Totale"
              description="Salari, benefit e condizioni sempre visibili. No sorprese, solo chiarezza."
              gradient="from-green-400 to-emerald-500"
            />
            <Feature
              icon={<Heart size={40} />}
              title="Match Perfetti"
              description="Algoritmo intelligente che trova la compatibilità ideale tra azienda e candidato."
              gradient="from-pink-400 to-red-500"
            />
            <Feature
              icon={<Shield size={40} />}
              title="100% Sicuro"
              description="Dati protetti e verificati. Privacy garantita per candidati e aziende."
              gradient="from-blue-400 to-indigo-500"
            />
            <Feature
              icon={<TrendingUp size={40} />}
              title="Analytics Avanzati"
              description="Dashboard completa per monitorare performance e ottimizzare la strategia."
              gradient="from-purple-400 to-violet-500"
            />
            <Feature
              icon={<Users size={40} />}
              title="Community Attiva"
              description="Oltre 5000 candidati qualificati e 500+ aziende innovative già attive."
              gradient="from-cyan-400 to-blue-500"
            />
          </div>
        </div>
      </section>

      {/* App Mobile Section */}
      <section
        id="app"
        className="py-20 px-4 bg-gradient-to-br from-indigo-50 to-purple-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-6">
              <Smartphone size={18} />
              <span>Coming Soon</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              App Mobile Nativa
            </h2>
            <p className="text-xl text-gray-600">
              L'esperienza completa sempre in tasca
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <FeatureMobile
                icon="⚡"
                title="Performance Native"
                description="60fps garantiti. Zero lag, zero problemi."
              />
              <FeatureMobile
                icon="🔔"
                title="Push Notifications"
                description="Ricevi notifiche immediate per nuovi match e messaggi"
              />
              <FeatureMobile
                icon="📊"
                title="Analytics Completi"
                description="Traccia le tue performance e ottimizza la tua strategia"
              />
              <FeatureMobile
                icon="🌙"
                title="Dark Mode"
                description="Modalità scura per un'esperienza più confortevole"
              />

              <div className="flex gap-4 pt-6">
                <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold">
                  <Download size={20} />
                  App Store
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-semibold">
                  <Download size={20} />
                  Play Store
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-1 mx-auto max-w-sm">
                <div className="bg-white rounded-3xl p-8">
                  <div className="relative aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className="text-6xl mb-4">📱</div>
                      <p className="text-lg font-bold mb-2">App Coming Soon</p>
                      <p className="text-sm text-gray-400">
                        Swipe. Match. Hire.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     {/* Video Demo Section */}
<section id="demo" className="py-20 px-4 bg-white">
  <div className="max-w-6xl mx-auto">
    <div className="text-center mb-12">
      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
        Vedi HireFlow in Azione
      </h2>
      <p className="text-xl text-gray-600">
        2 minuti per capire come rivoluzionare il tuo recruiting
      </p>
    </div>

    {/* Video Player - FIX */}
    <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gray-900" style={{ aspectRatio: '16/9' }}>
      <video
        controls
        preload="metadata"
        playsInline
        className="w-full h-full object-cover"
      >
        <source 
          src="https://res.cloudinary.com/dhettqwu6/video/upload/v1771251848/HireFlow_-_Dashboard_Recruiter_s3nhg7.webm" 
          type="video/webm" 
        />
        Il tuo browser non supporta la riproduzione video.
      </video>
    </div>

    <div className="grid md:grid-cols-3 gap-6 mt-12">
      <div className="text-center p-6 bg-blue-50 rounded-2xl">
        <div className="text-4xl mb-3">⚡</div>
        <p className="font-bold text-gray-900">Setup 2 min</p>
        <p className="text-sm text-gray-600">Velocissimo</p>
      </div>
      <div className="text-center p-6 bg-green-50 rounded-2xl">
        <div className="text-4xl mb-3">🎯</div>
        <p className="font-bold text-gray-900">Match in 24h</p>
        <p className="text-sm text-gray-600">Garantito</p>
      </div>
      <div className="text-center p-6 bg-purple-50 rounded-2xl">
        <div className="text-4xl mb-3">💼</div>
        <p className="font-bold text-gray-900">Assunzione 72h</p>
        <p className="text-sm text-gray-600">Record</p>
      </div>
    </div>
  </div>
</section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Prezzi Trasparenti
            </h2>
            <p className="text-xl text-gray-600">
              Semplice, chiaro, conveniente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard
              name="Free"
              price="0"
              description="Perfetto per iniziare"
              features={[
                "1 job attivo",
                "10 swipe al giorno",
                "Chat base",
                "Dashboard analytics",
              ]}
            />
            <PricingCard
              name="Pro"
              price="99"
              description="Per aziende in crescita"
              features={[
                "Job illimitati",
                "Swipe illimitati",
                "Chat prioritaria",
                "Analytics avanzati",
                "Match algorithm boost",
              ]}
              highlighted={true}
            />
            <PricingCard
              name="Enterprise"
              price="Custom"
              description="Per grandi organizzazioni"
              features={[
                "Tutto di Pro",
                "API access",
                "White-label",
                "Dedicated support",
                "Custom integrations",
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">
            Pronto a Rivoluzionare il Tuo Recruiting?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Unisciti a 500+ aziende che hanno già scelto HireFlow
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition font-bold text-lg shadow-2xl"
          >
            Inizia Gratis Ora
            <ArrowRight size={24} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚀</span>
                <span className="text-xl font-bold text-white">HireFlow</span>
              </div>
              <p className="text-sm">
                Il recruiting moderno, veloce e trasparente.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Prodotto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#features" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition">
                    Prezzi
                  </a>
                </li>
                <li>
                  <a href="#demo" className="hover:text-white transition">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Chi Siamo
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Carriere
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contatti
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Termini
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Cookie
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 HireFlow. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Componenti UI per la pagina principale
function Feature({ icon, title, description, gradient }) {
  return (
    <div className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-300">
      <div
        className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureMobile({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow">
      <div className="text-4xl flex-shrink-0">{icon}</div>
      <div>
        <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({
  name,
  price,
  description,
  features,
  highlighted = false,
}) {
  return (
    <div
      className={`p-8 rounded-3xl ${
        highlighted
          ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105"
          : "bg-white text-gray-900 shadow-lg"
      } transition-transform hover:scale-105`}
    >
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <p
        className={`text-sm mb-6 ${highlighted ? "text-blue-100" : "text-gray-600"}`}
      >
        {description}
      </p>
      <div className="mb-6">
        <span className="text-5xl font-black">
          {price === "Custom" ? price : `€${price}`}
        </span>
        {price !== "Custom" && <span className="text-lg">/mese</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle
              size={20}
              className={highlighted ? "text-blue-200" : "text-green-500"}
            />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/signup"
        className={`block w-full py-3 rounded-xl font-bold text-center transition ${
          highlighted
            ? "bg-white text-blue-600 hover:bg-gray-100"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        Inizia Ora
      </Link>
    </div>
  );
}
