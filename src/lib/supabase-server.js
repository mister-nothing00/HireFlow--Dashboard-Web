import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Usato SOLO nei Server Components e Server Actions
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

// Helper: ottieni sessione + company dal server
export async function getServerSession() {
  const supabase = await createSupabaseServer();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session)
    return { session: null, user: null, company: null, supabase };

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  return { session, user: session.user, company, supabase };
}
