import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Middleware per gestire l'autenticazione e la protezione del percorso
export async function middleware(request) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name, options) {
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");

  // Reindirizza gli utenti non autenticati alla pagina di accesso quando provano ad accedere alla dashboard
  if (!session && isDashboard) {
    console.log("🚫 Middleware: Redirecting to /login (no session)");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Reindirizza gli utenti autenticati lontano dalle pagine di autenticazione (login/signup)
  if (session && isAuthPage) {
    console.log(
      "✅ Middleware: Redirecting to /dashboard (already authenticated)",
    );
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// Configura il middleware per applicarsi solo a specifici percorsi
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
