# 🚀 HireFlow — Web Dashboard

> Perché mandare 100 candidature nel vuoto quando puoi fare match come su Tinder?

---

## Ok ma cos'è esattamente?

HireFlow nasce da una frustrazione reale: il recruiting tradizionale è obsoleto. Le aziende pubblicano job e aspettano CV. I candidati mandano candidature e aspettano risposte che non arrivano mai. Tutti aspettano. Nessuno è felice.

L'idea è semplice: **il match deve essere bidirezionale**. Le aziende swipano i candidati, i candidati swipano le offerte. Solo quando entrambi si scelgono si crea un match — come Tinder, ma per il lavoro. Senza sprechi di tempo, senza ghosting, con i salari visibili fin dall'inizio.

Questo repo è la **web dashboard per recruiter**. L'app mobile per candidati (React Native + Expo) vive in un repo separato.

---

## Stack tecnico

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

## Cosa puoi fare

### Dashboard home
Apri l'app e hai subito tutto sotto controllo: jobs attivi, candidati valutati, match confermati, candidature in attesa. Tutto aggiornato in tempo reale senza ricaricare la pagina — grazie a Supabase Realtime.

### Jobs
Crei un'offerta di lavoro in pochi minuti. Il salary è obbligatorio — niente di quel "RAL da definire" che fa perdere tempo a tutti. Puoi specificare contratto, remote policy, seniority, skills richieste e nice-to-have. Modifichi, attivi, disattivi, elimini quando vuoi.

### Candidati
Qui viene il bello. Swipa left se non ti convince, right se ti interessa. Se anche il candidato ha swipato right su uno dei tuoi job — boom, match. Il sistema lo rileva in automatico in tempo reale.

### Matches
Lista pulita di tutti i match reciproci. Puoi cercare per nome, vedere il profilo completo del candidato o aprire direttamente la chat. Solo persone che si sono scelte a vicenda — zero rumore.

### Chat
Messaggistica in tempo reale con optimistic update (il messaggio appare subito, senza aspettare la risposta del server). Badge messaggi non letti nella sidebar, mark as read automatico quando apri la conversazione. Invii con Enter, vai a capo con Shift+Enter.

### Impostazioni
Modifichi profilo, dati azienda, preferenze notifiche. Niente di speciale, ma funziona tutto.

### Auth
Signup multistep che crea account e company in un unico flusso. Login classico email/password. Middleware che protegge tutte le route della dashboard — prova ad accedere a `/dashboard` senza essere loggato e ti ritrovi al login.

---

## 📁 Struttura del progetto

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
│   │   └── AppContext.jsx        # Stato globale: auth, chat, candidati
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

## Database (Supabase)

```sql
-- Aziende (recruiter)
companies         (id, owner_id, name, website, location, size, industry, ...)

-- Offerte di lavoro
jobs              (id, company_id, title, description, contract_type,
                   remote_policy, seniority, salary_min, salary_max,
                   required_skills[], nice_to_have_skills[], is_active, ...)

-- Candidati — popolati dall'app mobile
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

## Setup locale

```bash
# 1. Clona
git clone https://github.com/mister-nothing00/HireFlow--Dashboard-Web.git
cd hireflow-web

# 2. Installa
npm install

# 3. Crea .env.local con le tue credenziali Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# 4. Avvia
npm run dev
```

Vai su [http://localhost:3000](http://localhost:3000) e dovresti vedere la landing page.

---

## Deploy

Su Vercel, deploy automatico ad ogni push su `main`. Aggiungi le due variabili d'ambiente nel pannello Vercel e sei a posto.

---

## 🔄 Come funziona il matching (la parte interessante)

```
1. Recruiter pubblica un job
2. Candidato lo vede sull'app mobile → swipa RIGHT
3. Recruiter vede il candidato sulla dashboard → swipa RIGHT
4. Il sistema rileva il match bidirezionale → crea il record in matches
5. Si sblocca la chat
```

Non c'è un algoritmo magico — c'è solo rispetto del tempo di entrambi. Se non sei interessato, non swipare. Se lo sei, lo scoprirete insieme.

---

## App mobile

Sviluppata in React Native + Expo SDK 54, repo separato. Ha tutto: swipe jobs, social feed, profilo, chat con le aziende. La versione mobile è quella che usano i candidati — questa dashboard è per chi assume.

---

## Roadmap

- [ ] OAuth (Google, LinkedIn, GitHub)
- [ ] Push notifications
- [ ] Analytics per le aziende
- [ ] Filtri avanzati candidati
- [ ] Pricing + Stripe
- [ ] App Store / Play Store

---

## Chi l'ha costruito

Sono Francesco, developer full-stack. Ho costruito HireFlow perché volevo un progetto reale da mostrare — non un altro todo-list o clone di Netflix. Se ti interessa collaborare, parlami pure.

- LinkedIn: [Francesco Di Vita](https://www.linkedin.com/in/francesco-di-vita/)
- GitHub: [mister-nothing00](https://github.com/mister-nothing00)

---

© 2026 Francesco Davide di Vita
