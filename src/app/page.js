import Link from 'next/link';
import Image from 'next/image';
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
} from 'lucide-react';

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
                <p className="text-xs text-gray-500">Il Recruiting Trasparente</p>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Features
              </a>
              <a href="#app" className="text-gray-700 hover:text-blue-600 transition font-medium">
                App Mobile
              </a>
              <a href="#demo" className="text-gray-700 hover:text-blue-600 transition font-medium">
                Demo
              </a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition font-medium">
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

      {/* Hero Section con Video Demo */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold mb-6 shadow-md">
                <Zap size={16} />
                <span>Il Futuro del Recruiting è Qui</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
                Trova il lavoro
                <br />
                perfetto con un
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  semplice swipe
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed font-medium">
                🎯 <strong>Trasparenza totale:</strong> Salary sempre visibile
                <br />
                ⚡ <strong>Match istantanei:</strong> Zero ghosting garantito
                <br />
                🚀 <strong>Onboarding veloce:</strong> Setup in 2 minuti
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link 
                  href="/signup"
                  className="px-8 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-600/50 transition flex items-center justify-center gap-3 group"
                >
                  Inizia Gratis
                  <ArrowRight size={24} className="group-hover:translate-x-1 transition" />
                </Link>
                <a 
                  href="#demo"
                  className="px-8 py-5 bg-white border-2 border-gray-300 text-gray-900 text-lg font-bold rounded-xl hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center gap-3 shadow-lg"
                >
                  <span className="text-3xl">▶️</span>
                  Guarda Demo
                </a>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="font-semibold">Gratis per candidati</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-500" />
                  <span className="font-semibold">No carta richiesta</span>
                </div>
              </div>
            </div>

            {/* Right: Demo Video Placeholder */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-1">
                <div className="bg-white rounded-3xl p-8">
                  {/* Video Container */}
                  <div className="relative aspect-[9/16] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Placeholder per video demo */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                      <div className="text-6xl mb-4">📱</div>
                      <p className="text-lg font-bold mb-2">Video Demo Coming Soon</p>
                      <p className="text-sm text-gray-400">Swipe. Match. Hire.</p>
                    </div>
                    
                    {/* Overlay Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition cursor-pointer group">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition shadow-2xl">
                        <div className="w-0 h-0 border-l-[20px] border-l-blue-600 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-center text-gray-600 mt-4 text-sm font-medium">
                    ⚡ Dal primo swipe all'assunzione in <strong>72 ore</strong>
                  </p>
                </div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Users size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">8,500+</p>
                    <p className="text-xs text-gray-600 font-medium">Candidati Attivi</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Briefcase size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">12K+</p>
                    <p className="text-xs text-gray-600 font-medium">Match Completati</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-gray-600 mb-8 font-medium">
            Trusted by innovative companies
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            {['TechCorp', 'StartupHub', 'InnovateCo', 'FutureWork'].map((company) => (
              <div key={company} className="text-center text-2xl font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Mobile Section con QR Code */}
      <section id="app" className="py-20 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">
              <Smartphone size={16} />
              <span>Mobile First Experience</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Scarica l'App Mobile
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Swipe candidati ovunque tu sia. Disponibile per iOS e Android.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: QR Code + Download */}
            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                📱 Scansiona per Scaricare
              </h3>
              
              {/* QR Code Placeholder */}
              <div className="bg-gray-100 aspect-square max-w-sm mx-auto rounded-2xl flex items-center justify-center mb-6 border-4 border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-4">📲</div>
                  <p className="text-gray-600 font-medium">QR Code Here</p>
                  <p className="text-sm text-gray-500 mt-2">Expo Go Link</p>
                </div>
              </div>

              <div className="space-y-3">
                <a 
                  href="#" 
                  className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition font-bold"
                >
                  <Download size={20} />
                  <span>Download su App Store</span>
                </a>
                <a 
                  href="#" 
                  className="flex items-center justify-center gap-3 w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition font-bold"
                >
                  <Download size={20} />
                  <span>Download su Google Play</span>
                </a>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                🔒 100% Gratuito • ⚡ Setup in 2 minuti
              </p>
            </div>

            {/* Right: Features */}
            <div className="space-y-6">
              <FeatureMobile 
                icon="🎯"
                title="Swipe Intelligente"
                description="Algoritmo AI che ti mostra solo i candidati più rilevanti per te"
              />
              <FeatureMobile 
                icon="💬"
                title="Chat Real-time"
                description="Messaggi istantanei con i candidati. Zero lag, zero problemi."
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

          {/* Video Embed Placeholder */}
          <div className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="text-8xl mb-6">🎬</div>
              <h3 className="text-3xl font-bold mb-4">Video Demo Platform</h3>
              <p className="text-gray-400 mb-8">Coming Soon</p>
              
              {/* Play Button */}
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition cursor-pointer shadow-2xl">
                <div className="w-0 h-0 border-l-[24px] border-l-white border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent ml-2"></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 bg-blue-50 rounded-2xl">
              <div className="text-4xl mb-3">⚡</div>
              <p className="font-bold text-gray-900">Setup 2 min</p>
              <p className="text-sm text-gray-600">Velocissimo</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-2xl">
              <div className="text-4xl mb-3">🎯</div>
              <p className="font-bold text-gray-900">87% Match Rate</p>
              <p className="text-sm text-gray-600">Precision AI</p>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-2xl">
              <div className="text-4xl mb-3">💰</div>
              <p className="font-bold text-gray-900">100% Trasparente</p>
              <p className="text-sm text-gray-600">Salary sempre visibile</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Perché HireFlow è Diverso
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Non siamo l'ennesimo job board. Siamo la rivoluzione del recruiting.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<Euro className="w-12 h-12 text-blue-600" />}
              title="Salary Trasparente"
              description="100% degli annunci mostra salary range. Sempre. No sorprese."
              highlight="Obbligatorio EU 2026"
            />
            <FeatureCard 
              icon={<Zap className="w-12 h-12 text-purple-600" />}
              title="Match in 5 Minuti"
              description="Swipe, match, chat. Dal primo contatto al colloquio in ore."
              highlight="5x più veloce"
            />
            <FeatureCard 
              icon={<Shield className="w-12 h-12 text-green-600" />}
              title="Zero Ghosting"
              description="Tracking real-time. Feedback garantito anche in caso di no."
              highlight="59% ghostati altrove"
            />
            <FeatureCard 
              icon={<TrendingUp className="w-12 h-12 text-orange-600" />}
              title="AI Matching"
              description="Score 0-100% basato su skills reali, cultura, preferenze."
              highlight="Non keyword"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
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
                'Analytics & Report'
              ]}
              cta="Contattaci"
              popular={false}
            />
          </div>

          <p className="text-center text-gray-600 mt-12 text-lg">
            💡 <strong>Per candidati:</strong> Sempre 100% gratuito. Swipe, match, chat senza limiti.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Pronto a Rivoluzionare il Recruiting?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Unisciti a 500+ aziende che stanno già assumendo meglio e più velocemente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-blue-600 text-lg font-black rounded-xl hover:bg-gray-100 shadow-2xl transition group"
            >
              Inizia Gratis Ora
              <ArrowRight size={24} className="group-hover:translate-x-1 transition" />
            </Link>
            
            <a  href="#demo"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border-2 border-white text-white text-lg font-black rounded-xl hover:bg-white/10 transition"
            >
              <span className="text-2xl">▶️</span>
              Guarda Demo
            </a>
          </div>
          <p className="text-blue-200 mt-6 text-sm">
            Nessuna carta richiesta • Setup in 2 minuti • Cancella quando vuoi
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-3xl">🚀</span>
                <span className="text-2xl font-bold text-white">HireFlow</span>
              </div>
              <p className="text-sm leading-relaxed">
                Il recruiting trasparente che candidati e aziende meritano.
              </p>
              <div className="flex gap-4 mt-6">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition">
                    {social[0]}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Prodotto</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Prezzi</a></li>
                <li><a href="#demo" className="hover:text-white transition">Demo</a></li>
                <li><a href="#app" className="hover:text-white transition">App Mobile</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Azienda</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition">Chi Siamo</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Carriere</a></li>
                <li><a href="#" className="hover:text-white transition">Contatti</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Termini</a></li>
                <li><a href="#" className="hover:text-white transition">GDPR</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 HireFlow. Made with ❤️ in Italia by <a href="https://github.com/mister-nothing00" className="text-blue-400 hover:text-blue-300 transition font-semibold">Francesco</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ========== COMPONENTS ==========

function FeatureMobile({ icon, title, description }) {
  return (
    <div className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
      <div className="text-4xl flex-shrink-0">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, highlight }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition border border-gray-200 group">
      <div className="mb-6 group-hover:scale-110 transition">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 leading-relaxed text-sm">{description}</p>
      <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
        {highlight}
      </div>
    </div>
  );
}

function PricingCard({ name, price, features, cta, popular }) {
  return (
    <div className={`bg-white rounded-3xl p-8 ${popular ? 'ring-4 ring-blue-600 shadow-2xl scale-105' : 'shadow-lg'} relative`}>
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-black shadow-lg">
          🔥 Più Popolare
        </div>
      )}
      <h3 className="text-2xl font-black text-gray-900 mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-5xl font-black text-gray-900">{price}</span>
        <span className="text-gray-600 font-medium">/mese</span>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-gray-700">
            <CheckCircle size={22} className="text-green-500 flex-shrink-0" />
            <span className="font-medium">{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        href="/signup"
        className={`block w-full py-4 text-center rounded-xl font-black transition text-lg ${
          popular 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}