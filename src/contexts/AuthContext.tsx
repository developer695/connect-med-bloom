// src/contexts/AuthContext.tsx

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
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
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: any; data?: any }>;
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

  // Use refs for duplicate fetch prevention (refs don't have stale closure issues)
  const isFetchingRoleRef = useRef(false);
  const lastFetchedUserIdRef = useRef<string | null>(null);
  const userRoleRef = useRef<string | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    userRoleRef.current = userRole;
  }, [userRole]);

  // ✅ canEdit is true for BOTH admin AND team_member
  const canEdit = isAdmin || isTeamMember;

  const fetchUserRole = async (userId: string, force = false) => {
    // Skip if already fetching (using ref for immediate check)
    if (isFetchingRoleRef.current) {
      console.log("⏳ Already fetching role, skipping duplicate call");
      return;
    }

    // Skip if already fetched for this user (unless forced)
    if (
      !force &&
      lastFetchedUserIdRef.current === userId &&
      userRoleRef.current !== null
    ) {
      console.log(
        "✅ Role already fetched for this user, skipping. Role:",
        userRoleRef.current
      );
      return;
    }

    isFetchingRoleRef.current = true;
    try {
      console.log("🔍 Fetching role for user:", userId);

      // Add timeout to prevent hanging forever
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .abortSignal(controller.signal)
        .maybeSingle();

      clearTimeout(timeoutId);

      console.log("📦 Profile query result:", { profileData, profileError });

      if (profileError) {
        console.error("❌ Profile fetch error:", profileError);
        // Only reset if we don't already have valid role data
        if (!userRoleRef.current) {
          setUserRole(null);
          setIsAdmin(false);
          setIsTeamMember(false);
        }
        return;
      }

      if (profileData) {
        const role = profileData.role;
        console.log("✅ Role from profiles:", role);
        setUserRole(role);
        userRoleRef.current = role;
        setIsAdmin(role === "admin");
        setIsTeamMember(role === "team_member");
        lastFetchedUserIdRef.current = userId;
        return;
      }

      console.log("⚠️ No role found in profiles table");
      // Only reset if we don't already have valid role data
      if (!userRoleRef.current) {
        setUserRole(null);
        setIsAdmin(false);
        setIsTeamMember(false);
      }
    } catch (error: any) {
      if (error?.name === "AbortError") {
        console.error("❌ Query timed out after 10 seconds");
      } else {
        console.error("❌ Error fetching role:", error);
      }
      // DON'T reset state on error if we already have valid role data
      if (!userRoleRef.current) {
        setIsAdmin(false);
        setIsTeamMember(false);
        setUserRole(null);
      } else {
        console.log(
          "⚠️ Keeping existing role data despite error:",
          userRoleRef.current
        );
      }
    } finally {
      isFetchingRoleRef.current = false;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Step 1: Recover session from localStorage (persisted by Supabase)
        const {
          data: { session: recoveredSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("❌ Error recovering session:", sessionError);
          setIsLoading(false);
          return;
        }

        if (mounted && recoveredSession?.user) {
          console.log(
            "✅ Session recovered from localStorage:",
            recoveredSession.user.email
          );
          setSession(recoveredSession);
          setUser(recoveredSession.user);
          await fetchUserRole(recoveredSession.user.id);
        } else {
          console.log("⚠️ No persisted session found");
          setSession(null);
          setUser(null);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("❌ Error during auth initialization:", error);
        setIsLoading(false);
      }
    };

    // Initialize auth on mount
    initializeAuth();

    // Step 2: Listen for auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("🔄 Auth state changed:", event, session?.user?.email);

      // Update session and user state immediately
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // IMPORTANT: Defer the database call to allow Supabase client to update its internal auth state
        // This prevents RLS issues where the query runs before the auth token is available
        setTimeout(async () => {
          if (mounted) {
            await fetchUserRole(session.user.id);
            setIsLoading(false);
          }
        }, 100);
      } else {
        setIsAdmin(false);
        setIsTeamMember(false);
        setUserRole(null);
        lastFetchedUserIdRef.current = null;
        userRoleRef.current = null;
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error };
    return { data, error: null };
  };

  const signUp = async (email: string, password: string) => {
    if (isSigningUp) return { error: { message: "Already processing..." } };
    setIsSigningUp(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) return { error: signUpError };

      if (data.user) {
        await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: data.user.email,
            role: "team_member",
            status: "active",
          },
        ]);
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
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
