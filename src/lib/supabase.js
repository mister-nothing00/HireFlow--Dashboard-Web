import { createBrowserClient } from "@supabase/ssr";

// Inizializza il client Supabase per l'uso in tutto il frontend, con URL e chiave anonima da env
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
