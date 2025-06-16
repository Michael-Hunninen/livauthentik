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
      user_rewards: {
        Row: {
          id: string
          user_id: string
          points_balance: number
          current_tier_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points_balance?: number
          current_tier_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points_balance?: number
          current_tier_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      reward_tiers: {
        Row: {
          id: string
          name: string
          description: string | null
          min_points: number
          max_points: number | null
          benefits: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          min_points: number
          max_points?: number | null
          benefits?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          min_points?: number
          max_points?: number | null
          benefits?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      reward_items: {
        Row: {
          id: string
          name: string
          description: string | null
          points_cost: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          points_cost: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          points_cost?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reward_transactions: {
        Row: {
          id: string
          user_id: string
          points: number
          description: string
          source: string
          type: string
          reference_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          points: number
          description: string
          source: string
          type: string
          reference_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          points?: number
          description?: string
          source?: string
          type?: string
          reference_id?: string | null
          created_at?: string
        }
      }
      user_reward_redemptions: {
        Row: {
          id: string
          user_id: string
          reward_item_id: string
          points_cost: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reward_item_id: string
          points_cost: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reward_item_id?: string
          points_cost?: number
          status?: string
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
