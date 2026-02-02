import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../supabase';
import { useStore } from '../store';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, clearAuth } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check sessione corrente
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          console.log('✅ Session found:', session.user.email);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth event:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          console.log('✅ User signed in:', session.user.email);
        } 
        else if (event === 'SIGNED_OUT') {
          setUser(null);
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
    loading, 
    logout,
    isAuthenticated: !!user,
  };
}