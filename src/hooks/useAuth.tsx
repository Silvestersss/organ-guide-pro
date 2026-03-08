import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

const ADMIN_EMAILS = ["leezhixing117@gmail.com", "amypy117@gmail.com"];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isEditMode: boolean;
  setEditMode: (v: boolean) => void;
  isPreviewingAsMember: boolean;
  setPreviewingAsMember: (v: boolean) => void;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  isEditMode: false,
  setEditMode: () => {},
  isPreviewingAsMember: false,
  setPreviewingAsMember: () => {},
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setEditMode] = useState(false);
  const [isPreviewingAsMember, setPreviewingAsMember] = useState(false);

  const isAdmin = !isPreviewingAsMember && !!user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setEditMode(false);
    setPreviewingAsMember(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, isEditMode, setEditMode, isPreviewingAsMember, setPreviewingAsMember, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
