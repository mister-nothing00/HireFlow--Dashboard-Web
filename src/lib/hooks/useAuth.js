import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../supabase';
import { useStore } from '../store';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, company, setCompany, clearAuth } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check sessione corrente all'avvio
    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth event:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          await fetchCompanyData(session.user.id);
          console.log('✅ User signed in:', session.user.email);
        } 
        else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCompany(null);
          clearAuth();
          console.log('🚪 User signed out');
        }
        else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Redirect logic
  useEffect(() => {
    if (loading) return;

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isDashboard = pathname.startsWith('/dashboard');

    if (!user && isDashboard) {
      // User non loggato cerca di accedere a dashboard → redirect a login
      console.log('🚫 Redirecting to login (not authenticated)');
      router.push('/login');
    } 
    else if (user && isAuthPage) {
      // User loggato è in auth pages → redirect a dashboard
      console.log('✅ Redirecting to dashboard (already authenticated)');
      router.push('/dashboard');
    }
  }, [user, loading, pathname]);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session?.user) {
        setUser(session.user);
        await fetchCompanyData(session.user.id);
        console.log('✅ Session found:', session.user.email);
      } else {
        setUser(null);
        setCompany(null);
        console.log('ℹ️ No active session');
      }
    } catch (error) {
      console.error('❌ Session check error:', error);
      setUser(null);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyData = async (userId) => {
    try {
      console.log('🔍 Fetching company data for user:', userId);

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_id', userId)
        .single();

      if (error) {
        // Se non ha company, è un nuovo utente che deve completare signup
        console.warn('⚠️ No company found for user:', userId);
        setCompany(null);
        return;
      }

      if (data) {
        setCompany(data);
        console.log('✅ Company loaded:', data.name);
      }
    } catch (error) {
      console.error('❌ Error fetching company:', error);
      setCompany(null);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearAuth();
      router.push('/login');
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  return { 
    user, 
    company,
    loading, 
    logout,
    isAuthenticated: !!user,
  };
}