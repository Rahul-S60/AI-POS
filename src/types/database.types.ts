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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          timezone: string
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          timezone?: string
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          target_date: string | null
          status: 'active' | 'completed' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          target_date?: string | null
          status?: 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          target_date?: string | null
          status?: 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      milestones: {
        Row: {
          id: string
          goal_id: string
          title: string
          status: 'pending' | 'in_progress' | 'completed'
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          goal_id: string
          title: string
          status?: 'pending' | 'in_progress' | 'completed'
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          goal_id?: string
          title?: string
          status?: 'pending' | 'in_progress' | 'completed'
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          goal_id: string | null
          title: string
          description: string | null
          frequency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id?: string | null
          title: string
          description?: string | null
          frequency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string | null
          title?: string
          description?: string | null
          frequency?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          goal_id: string | null
          milestone_id: string | null
          title: string
          description: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          status: 'todo' | 'in_progress' | 'done' | 'cancelled'
          scheduled_date: string | null
          start_time: string | null
          end_time: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          goal_id?: string | null
          milestone_id?: string | null
          title: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'todo' | 'in_progress' | 'done' | 'cancelled'
          scheduled_date?: string | null
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          goal_id?: string | null
          milestone_id?: string | null
          title?: string
          description?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          status?: 'todo' | 'in_progress' | 'done' | 'cancelled'
          scheduled_date?: string | null
          start_time?: string | null
          end_time?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          log_date: string
          mood: string | null
          reflection: string | null
          ai_insights: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          log_date: string
          mood?: string | null
          reflection?: string | null
          ai_insights?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          log_date?: string
          mood?: string | null
          reflection?: string | null
          ai_insights?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
