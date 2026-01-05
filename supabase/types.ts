// src/integrations/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Users: {
        Row: {
          id: string
          user_id: string | null
          email: string
          name: string | null
          role: 'admin' | 'team_member'
          status: 'pending' | 'accepted' | 'active'
          invite_token: string | null
          invite_expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          name?: string | null
          role?: 'admin' | 'team_member'
          status?: 'pending' | 'accepted' | 'active'
          invite_token?: string | null
          invite_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          name?: string | null
          role?: 'admin' | 'team_member'
          status?: 'pending' | 'accepted' | 'active'
          invite_token?: string | null
          invite_expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      // Add your other tables here (proposals, etc.)
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'team_member'
      user_status: 'pending' | 'accepted' | 'active'
    }
  }
}