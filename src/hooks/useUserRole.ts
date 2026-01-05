// src/hooks/useUserRole.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserData {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  role: 'admin' | 'team_member';
  status: 'pending' | 'accepted' | 'active';
  created_at: string;
  updated_at: string;
}

export function useUserRole() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUserRole = async () => {
      try {
        // Get auth user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          if (isMounted) {
            setUserData(null);
            setLoading(false);
          }
          return;
        }

        // Get user data from Users table
        const { data, error: dbError } = await supabase
          .from('Users')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (dbError) {
          console.error('Error fetching user role:', dbError);
          if (isMounted) {
            setError(dbError.message);
            setUserData(null);
          }
        } else if (isMounted) {
          setUserData(data as UserData);
        }
      } catch (err: any) {
        console.error('Error:', err);
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserRole();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUserData(null);
          setLoading(false);
        }
      } else if (event === 'SIGNED_IN' && session?.user) {
        fetchUserRole();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return {
    userData,
    role: userData?.role || null,
    isAdmin: userData?.role === 'admin',
    isTeamMember: userData?.role === 'team_member',
    loading,
    error,
  };
}