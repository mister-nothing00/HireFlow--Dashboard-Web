# 🚀 HireFlow — Web Dashboard

> **Il recruiting trasparente.** HireFlow abbina aziende e candidati come Tinder: veloce, bidirezionale, senza CV infiniti.

---

## 📖 Cos'è HireFlow

HireFlow è una piattaforma di recruiting innovativa che combina il concetto di LinkedIn con la meccanica di Tinder. Il **matching è bidirezionale**: le aziende swipano i candidati, i candidati swipano le offerte di lavoro. Solo quando entrambi si scelgono reciprocamente si crea un match — eliminando candidature a vuoto e processi infiniti.

Questo repository contiene la **web dashboard per recruiter**, costruita con Next.js 15. L'app mobile per candidati (React Native + Expo) è in un repo separato.

---

## 🛠️ Tech Stack

| Layer | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database & Auth | Supabase (PostgreSQL + Auth + Realtime) |
| Styling | Tailwind CSS + shadcn/ui |
| State Management | Zustand + React Context |
| Icons | Lucide React |
| Deploy | Vercel |
| Font | Inter (Google Fonts) |

---

## ✨ Features

### 🏠 Dashboard Home
- Stats in tempo reale: jobs attivi, candidati valutati, match totali, in attesa
- Feed attività recente
- Quick action per scoprire nuovi candidati
- Aggiornamenti live via Supabase Realtime

### 💼 Gestione Jobs
- Creazione offerte con salary obbligatorio (trasparenza totale)
- Campi: titolo, descrizione, contratto, remote policy, seniority, skills richieste, nice-to-have
- Lista jobs con filtri e ricerca
- Dettaglio job con attiva/disattiva e eliminazione
- Modifica job esistenti

### 👥 Candidati
- Interfaccia swipe (left/right) per valutare candidati
- Card candidato con skills, salary range, esperienza, preferenze remote
- Profilo completo candidato con tutte le informazioni
- Swipe destro → controllo automatico match bidirezionale
- Stato swipe persistito per ogni candidato

### 🎉 Matches
- Lista di tutti i match reciproci confermati
- Ricerca per nome/headline candidato
- Aggiornamenti realtime su nuovi match
- Link diretto a profilo candidato e chat

### 💬 Chat
- Lista conversazioni ordinate per ultimo messaggio
- Chat in tempo reale con optimistic update
- Badge messaggi non letti nella sidebar
- Mark as read automatico all'apertura
- Supporto invio con Enter (Shift+Enter per a capo)

### ⚙️ Impostazioni
- Visualizzazione e modifica profilo recruiter
- Modifica dati azienda (nome, sito, location, dimensione, settore)
- Toggle notifiche in-app e email alerts

### 🔐 Autenticazione
- Signup multistep con creazione company contestuale
- Login con email/password
- Middleware di protezione route (redirect automatici)
- Sessione gestita via Supabase SSR

### 🌐 SEO & Performance
- Metadata ottimizzati (OG, Twitter Card, robots)
- Sitemap dinamica con jobs attivi
- Canonical URL configurato
- Favicon multi-formato (ico, png, apple-touch)
- Server Components dove possibile

---

## 📁 Struttura del Progetto

```
hireflow-web/
├── public/
│   ├── favicon/
│   │   ├── favicon-96x96.png
│   │   ├── favicon.svg
│   │   └── apple-touch-icon.png
│   ├── favicon.ico
│   └── og-image.png              # 1200x630 per social preview
│
├── src/
│   ├── app/
│   │   ├── layout.js             # Root layout + metadata globali
│   │   ├── page.js               # Landing page pubblica
│   │   ├── not-found.js          # Pagina 404
│   │   ├── globals.css
│   │   │
│   │   ├── (auth)/               # Route group autenticazione
│   │   │   ├── login/page.js
│   │   │   └── signup/page.js
│   │   │
│   │   └── dashboard/
│   │       ├── layout.js         # Sidebar + unread badge realtime
│   │       ├── page.js           # Home dashboard
│   │       ├── jobs/
│   │       │   ├── page.js       # Lista jobs
│   │       │   ├── new/page.js   # Crea job
│   │       │   └── [id]/
│   │       │       ├── page.js   # Dettaglio job
│   │       │       └── edit/page.js
│   │       ├── candidates/
│   │       │   ├── page.js       # Swipe candidati
│   │       │   └── [id]/page.js  # Profilo candidato
│   │       ├── matches/
│   │       │   └── page.js
│   │       ├── chat/
│   │       │   ├── page.js       # Lista chat
│   │       │   └── [matchId]/page.js
│   │       └── settings/
│   │           ├── page.js
│   │           └── profile/page.js
│   │
│   ├── components/
│   │   ├── ui/                   # Componenti base (Skeletons, Toast, ecc.)
│   │   ├── DashboardHomeClient.jsx
│   │   ├── CandidatesClient.jsx
│   │   ├── MatchesClient.jsx
│   │   ├── ChatListClient.jsx
│   │   ├── ChatDetailClient.jsx
│   │   └── JobDetailClient.jsx
│   │
│   ├── context/
│   │   └── AppContext.jsx        # Auth, chat, candidati state globale
│   │
│   ├── lib/
│   │   ├── supabase.js           # Client Supabase (browser)
│   │   ├── supabase-server.js    # Client Supabase (server) + getServerSession
│   │   ├── seo.js                # Config SEO centralizzata
│   │   ├── toast.js              # Helper notifiche
│   │   └── hooks/
│   │       ├── useAuth.js
│   │       └── useChat.js
│   │
│   └── middleware.js             # Protezione route auth
```

---

## 🗄️ Schema Database (Supabase)

```sql
-- Aziende (recruiter)
companies         (id, owner_id, name, website, location, size, industry, ...)

-- Offerte di lavoro
jobs              (id, company_id, title, description, contract_type,
                   remote_policy, seniority, salary_min, salary_max,
                   required_skills[], nice_to_have_skills[], is_active, ...)

-- Candidati (creati dall'app mobile)
candidates        (id, first_name, last_name, headline, bio, skills[],
                   experience_years, salary_min, salary_max,
                   remote_preference, location, links, ...)

-- Swipe aziende → candidati
company_swipes    (id, company_id, candidate_id, job_id, direction)

-- Swipe candidati → jobs (dall'app mobile)
swipes            (id, candidate_id, job_id, direction)

-- Match bidirezionali confermati
matches           (id, company_id, candidate_id, job_id, status,
                   last_message, last_message_at, ...)

-- Messaggi chat
messages          (id, match_id, sender_id, sender_type, content,
                   created_at, read_at)
```

---

## 🚀 Setup Locale

### Prerequisiti
- Node.js 18+
- Account Supabase
- Account Vercel (per deploy)

### 1. Clona il repository
```bash
git clone https://github.com/mister-nothing00/HireFlow--Dashboard-Web.git
cd hireflow-web
```

### 2. Installa dipendenze
```bash
npm install
```

### 3. Configura variabili d'ambiente
Crea `.env.local` nella root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Avvia il server di sviluppo
```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy

Il progetto è deployato su **Vercel** con deploy automatico ad ogni push su `main`.

```bash
# Build di produzione locale
npm run build
npm start
```

Variabili d'ambiente da configurare su Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🔄 Come Funziona il Matching

```
1. Recruiter pubblica un job su HireFlow Web
2. Candidato vede il job sull'app mobile e swipa → RIGHT (interessato)
3. Recruiter vede il candidato sulla dashboard e swipa → RIGHT
4. Sistema rileva match bidirezionale → crea record in `matches`
5. Si sblocca la chat tra azienda e candidato
```

Il controllo match avviene in tempo reale: quando il recruiter swipa right, il sistema controlla automaticamente se quel candidato ha già swipato right su uno dei job dell'azienda.

---

## 📱 App Mobile

L'app mobile per candidati è sviluppata in **React Native + Expo SDK 54** ed è disponibile in un repository separato.

Features mobile:
- Discovery jobs con swipe (Tinder-like)
- Social feed
- Profilo candidato
- Chat con le aziende
- Notifiche push

---

## 🗺️ Roadmap

- [ ] OAuth login (Google, LinkedIn)
- [ ] Push notifications
- [ ] Analytics avanzati per le aziende
- [ ] Filtri avanzati candidati (skills, salary, location)
- [ ] Piano pricing e Stripe integration
- [ ] App Store / Play Store release

---

## 👨‍💻 Autore

**Francesco Davide di Vita**
Full-Stack Developer

- LinkedIn: [linkedin.com/in/francescodavidevita](https://www.linkedin.com/in/francesco-di-vita/)
- GitHub: [github.com/francescodavidevita](https://github.com/mister-nothing00)

---

## 📄 Copyright

© 2026 Francesco Davide di Vita