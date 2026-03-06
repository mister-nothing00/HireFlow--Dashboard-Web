import { createBrowserClient } from "@supabase/ssr";

// Client Supabase condiviso per tutta l'app, utilizzato sia nei componenti che nei custom hooks, per interagire con il backend Supabase e gestire autenticazione, database e real-time updates
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
