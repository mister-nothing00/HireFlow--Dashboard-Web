"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase-server.js";
import { useApp } from "@/context/AppContext";

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, company, setUser, setCompany, clearAuth } = useApp();
  const [loading, setLoading] = useState(true);

  // Fetch dati company dato userId
  const fetchCompanyData = useCallback(
    async (userId) => {
      try {
        const { data, error } = await supabase
          .from("companies")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error) {
          console.warn("⚠️ Company non trovata per user:", userId);
          setCompany(null);
          return null;
        }

        setCompany(data);
        console.log("✅ Company caricata:", data.name);
        return data;
      } catch (e) {
        console.error("❌ fetchCompanyData error:", e);
        return null;
      }
    },
    [setCompany],
  );

  // Check sessione iniziale
  const checkSession = useCallback(async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;

      if (session?.user) {
        setUser(session.user);
        await fetchCompanyData(session.user.id);
        console.log("✅ Session found:", session.user.email);
      } else {
        setUser(null);
        setCompany(null);
        console.log("ℹ️ No active session");
      }
    } catch (e) {
      console.error("❌ checkSession error:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [setUser, setCompany, fetchCompanyData]);

  useEffect(() => {
    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔔 Auth event:", event);

      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        await fetchCompanyData(session.user.id);
      } else if (event === "SIGNED_OUT") {
        clearAuth();
        console.log("🚪 User signed out");
      } else if (event === "TOKEN_REFRESHED") {
        console.log("🔄 Token refreshed");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    const isAuthPage =
      pathname.startsWith("/login") || pathname.startsWith("/signup");
    const isDashboard = pathname.startsWith("/dashboard");

    if (!user && isDashboard) {
      console.log("🚫 Redirect → /login");
      router.push("/login");
    } else if (user && isAuthPage) {
      console.log("✅ Redirect → /dashboard");
      router.push("/dashboard");
    }
  }, [user, loading, pathname]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    clearAuth();
    router.push("/login");
    console.log("🚪 Logout completato");
  }, [clearAuth, router]);

  return { user, company, loading, logout, fetchCompanyData };
}
