// src/contexts/AuthContext.tsx

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isTeamMember: boolean;
  canEdit: boolean;
  userRole: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data?: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeamMember, setIsTeamMember] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // ✅ canEdit is true for BOTH admin AND team_member
  const canEdit = isAdmin || isTeamMember;

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('🔍 Fetching role for user:', userId);

      // Check profiles table (uses 'id' column)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (profileData) {
        const role = profileData.role;
        console.log('✅ Role from profiles:', role);
        setUserRole(role);
        setIsAdmin(role === 'admin');
        setIsTeamMember(role === 'team_member');
        return;
      }

      // Fallback: check Users table (uses 'user_id' column)
      const { data: userData } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (userData) {
        const role = userData.role;
        console.log('✅ Role from Users:', role);
        setUserRole(role);
        setIsAdmin(role === 'admin');
        setIsTeamMember(role === 'team_member');
        return;
      }

      console.log('⚠️ No role found');
      setUserRole(null);
      setIsAdmin(false);
      setIsTeamMember(false);

    } catch (error) {
      console.error('❌ Error fetching role:', error);
      setIsAdmin(false);
      setIsTeamMember(false);
      setUserRole(null);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id).then(() => setIsLoading(false));
          }, 0);
        } else {
          setIsAdmin(false);
          setIsTeamMember(false);
          setUserRole(null);
          setIsLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchUserRole(session.user.id).then(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    return { data, error: null };
  };

  const signUp = async (email: string, password: string) => {
    if (isSigningUp) return { error: { message: 'Already processing...' } };
    setIsSigningUp(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) return { error: signUpError };

      if (data.user) {
        await supabase.from("profiles").insert([{
          user_id: data.user.id,
          email: data.user.email,
          role: 'team_member ||',
        }]);
      }
      return { error: null };
    } finally {
      setIsSigningUp(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setIsTeamMember(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAdmin,
      isTeamMember,
      canEdit,
      userRole,
      isLoading,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};