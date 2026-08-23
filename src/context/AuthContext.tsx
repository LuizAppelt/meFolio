import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (notification?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isConfigured: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const configured = isSupabaseConfigured();

  // Handle Google ID Token Response from Native Popup / One Tap
  const handleGoogleCredentialResponse = useCallback(async (response: { credential: string }) => {
    if (!response.credential) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        console.error('Supabase Google ID Token error:', error.message);
        alert(`Erro ao autenticar com Google: ${error.message}`);
      } else if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
    } catch (err) {
      console.error('Google Sign-in failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize Native Google Identity Services (One Tap & Native Popup)
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const initGoogleGSI = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Prompt Google One Tap on mount if not logged in
        if (!user) {
          window.google.accounts.id.prompt();
        }
      }
    };

    // Check if script is already loaded
    if (window.google?.accounts?.id) {
      initGoogleGSI();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGoogleGSI();
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [handleGoogleCredentialResponse, user]);

  // Listen for Supabase session changes
  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [configured]);

  const signInWithGoogle = async () => {
    // 1. Try Native Google One-Tap / Popup prompt first (No ugly redirect URL!)
    if (window.google?.accounts?.id && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.prompt((notification: any) => {
        // If One Tap was dismissed or suppressed, fallback to Supabase OAuth
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          if (configured) {
            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: { redirectTo: window.location.origin }
            });
          }
        }
      });
      return;
    }

    // 2. Fallback to Supabase OAuth if GSI not loaded
    if (configured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) alert(`Erro no login: ${error.message}`);
    } else {
      alert('Para conectar o login com Google, insira a ANON_KEY do Supabase no arquivo .env.');
    }
  };

  const signOut = async () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    if (configured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isConfigured: configured, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
