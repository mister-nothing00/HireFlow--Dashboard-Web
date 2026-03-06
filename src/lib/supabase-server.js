import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Funzione per creare un client Supabase lato server, con gestione dei cookie per autenticazione e sessione, utilizzabile in Server Components e API routes
export async function createSupabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // In Server Components read-only, ignora
          }
        },
        remove(name, options) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // In Server Components read-only, ignora
          }
        },
      },
    },
  );
}

export async function getServerSession() {
  const supabase = await createSupabaseServer();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  
  if (error || !session) {
    return { session: null, user: null, company: null, supabase };
  }

  console.log("🔍 Looking for company with owner_id:", session.user.id);

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", session.user.id) // ✅ CORRETTO! owner_id
    .single();

  if (companyError) {
    console.warn("⚠️ Company query error:", companyError);
  }

  console.log("✅ Company found:", company?.name || "NONE");

  return { session, user: session.user, company, supabase };
}