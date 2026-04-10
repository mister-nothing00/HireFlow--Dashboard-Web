import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value; },
        set(name, value, options) { response.cookies.set({ name, value, ...options }); },
        remove(name, options) { response.cookies.set({ name, value: "", ...options }); },
      },
    },
  );

  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/auth/login") || pathname.startsWith("/auth/signup");
  const isDashboard = pathname.startsWith("/dashboard");

  if (!session && isDashboard) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/signup"],
};