import Link from 'next/link';
import { 
  TrendingUp,
  CheckCircle,
  Euro,
  Zap,
  Shield,
  ArrowRight,
} from 'lucide-react';

// ✅ Server Component (SSG per SEO)
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span className="text-xl font-bold text-gray-900">HireFlow</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition">
                Come Funziona
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition">
                Prezzi
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Accedi
              </Link>
              <Link 
                href="/signup" 
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-lg shadow-blue-600/30 transition"
              >
                Inizia Gratis
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                <Zap size={16} />
                <span>Il Futuro del Recruiting è Qui</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Trova i candidati
                <br />
                perfetti con un
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  semplice swipe
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                La piattaforma di recruiting che porta <strong>trasparenza totale</strong> 
                {' '}e <strong>velocità</strong> nel processo di assunzione. 
                Salary sempre visibile, match istantanei, zero ghosting.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/signup"
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-xl shadow-blue-600/40 transition flex items-center justify-center gap-2"
                >
                  Inizia Gratis
                  <ArrowRight size={20} />
                </Link>
                <a 
                  href="#demo"
                  className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 text-lg font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center gap-2"
                >
                  Guarda Demo
                  <span className="text-2xl">▶️</span>
                </a>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span>Setup in 2 minuti</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  <span>Nessuna carta richiesta</span>
                </div>
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b">
                  <div className="text-4xl">💼</div>
                  <div>
                    <h3 className="font-bold text-gray-900">Frontend Developer</h3>
                    <p className="text-sm text-gray-600">Tech Startup Inc. • Milano</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Euro size={16} className="text-green-600" />
                    <span className="font-semibold text-gray-900">€45,000 - €65,000</span>
                    <span className="text-gray-600">/ anno</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>🏠</span>
                    <span>Full Remote</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>⏰</span>
                    <span>Full-time</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {['React', 'TypeScript', 'Node.js'].map((skill) => (
                    <span 
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 py-3 bg-red-500 text-white rounded-lg font-semibold text-center">
                    ❌ Passa
                  </div>
                  <div className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold text-center">
                    ✅ Interessa
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                100% Match!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatCard number="8,500+" label="Candidati Attivi" />
            <StatCard number="500+" label="Aziende Partner" />
            <StatCard number="12,000+" label="Match Completati" />
            <StatCard number="87%" label="Success Rate" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Perché HireFlow è Diverso
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Non siamo l'ennesimo job board. Siamo la piattaforma che mette 
              <strong> trasparenza e candidati</strong> al centro.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Euro className="w-10 h-10 text-blue-600" />}
              title="Salary Trasparente"
              description="100% degli annunci mostra salary range. Sempre. No sorprese."
              highlight="Obbligatorio per legge EU 2026"
            />
            <FeatureCard 
              icon={<Zap className="w-10 h-10 text-purple-600" />}
              title="Match in 5 Minuti"
              description="Swipe, match, chat. Dal primo contatto al colloquio in ore, non settimane."
              highlight="5x più veloce di LinkedIn"
            />
            <FeatureCard 
              icon={<Shield className="w-10 h-10 text-green-600" />}
              title="Zero Ghosting"
              description="Tracking real-time dello status. Feedback garantito anche in caso di rifiuto."
              highlight="59% candidati ghostati altrove"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-10 h-10 text-orange-600" />}
              title="AI Matching"
              description="Score 0-100% basato su skills reali, cultura aziendale, preferenze."
              highlight="Non keyword matching"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Come Funziona
            </h2>
            <p className="text-xl text-gray-600">
              3 step per trovare il candidato perfetto
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard 
              number="1"
              title="Pubblica il Job"
              description="Crea un annuncio con salary range, skills richieste, remote policy. 2 minuti."
              emoji="📝"
            />
            <StepCard 
              number="2"
              title="Swipe Candidati"
              description="Scorri profili qualificati. Like quelli che ti interessano. L'AI pre-filtra per te."
              emoji="👆"
            />
            <StepCard 
              number="3"
              title="Chat e Assume"
              description="Match istantaneo quando c'è interesse reciproco. Parla direttamente, nessun intermediario."
              emoji="💬"
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Prezzi Semplici e Trasparenti
            </h2>
            <p className="text-xl text-gray-600">
              Nessun costo nascosto. Nessun lock-in annuale.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard 
              name="Free"
              price="€0"
              features={[
                '1 job attivo',
                'ATS base',
                '10 messaggi/mese',
                'Match illimitati'
              ]}
              cta="Inizia Gratis"
              popular={false}
            />
            <PricingCard 
              name="Starter"
              price="€49"
              features={[
                '3 job attivi',
                '50 messaggi/mese',
                'Matching AI base',
                'Support prioritario'
              ]}
              cta="Prova 14 Giorni"
              popular={true}
            />
            <PricingCard 
              name="Pro"
              price="€199"
              features={[
                '10 job attivi',
                '200 messaggi/mese',
                'AI matching avanzato',
                'Analytics & Report',
                '2 team seats'
              ]}
              cta="Contattaci"
              popular={false}
            />
          </div>

          <p className="text-center text-gray-600 mt-8">
            💡 <strong>Per candidati:</strong> Sempre 100% gratuito. Swipe, match, chat senza limiti.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto a Rivoluzionare il Tuo Recruiting?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Unisciti a 500+ aziende che stanno già assumendo meglio e più velocemente.
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg font-bold rounded-lg hover:bg-gray-100 shadow-xl transition"
          >
            Inizia Gratis Ora
            <ArrowRight size={20} />
          </Link>
          <p className="text-blue-200 mt-4 text-sm">
            Nessuna carta richiesta • Setup in 2 minuti • Cancella quando vuoi
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🚀</span>
                <span className="text-xl font-bold text-white">HireFlow</span>
              </div>
              <p className="text-sm">
                Il recruiting trasparente che candidati e aziende meritano.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Prodotto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Prezzi</a></li>
                <li><a href="#demo" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Azienda</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Chi Siamo</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Carriere</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Termini</a></li>
                <li><a href="#" className="hover:text-white">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 HireFlow. Made with ❤️ in Italia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ========== COMPONENTS (Server Components) ==========

function StatCard({ number, label }) {
  return (
    <div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description, highlight }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
      <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
        {highlight}
      </div>
    </div>
  );
}

function StepCard({ number, title, description, emoji }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, features, cta, popular }) {
  return (
    <div className={`bg-white rounded-2xl p-8 ${popular ? 'ring-2 ring-blue-600 shadow-2xl scale-105' : 'shadow-lg'} relative`}>
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-bold">
          🔥 Più Popolare
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        <span className="text-gray-600">/mese</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-gray-700">
            <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        href="/signup"
        className={`block w-full py-3 text-center rounded-lg font-semibold transition ${
          popular 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}