export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          plant_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          plant_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          plant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          created_at: string
          description: string
          id: string
          insight_type: string
          is_read: boolean | null
          plant_id: string | null
          priority: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          insight_type: string
          is_read?: boolean | null
          plant_id?: string | null
          priority?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          insight_type?: string
          is_read?: boolean | null
          plant_id?: string | null
          priority?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      measurements: {
        Row: {
          ai_analysis: string | null
          branching_count: number | null
          created_at: string
          density_score: number | null
          health_notes: string | null
          id: string
          image_url: string | null
          measured_at: string
          plant_id: string
          root_depth: number | null
          root_length: number
        }
        Insert: {
          ai_analysis?: string | null
          branching_count?: number | null
          created_at?: string
          density_score?: number | null
          health_notes?: string | null
          id?: string
          image_url?: string | null
          measured_at?: string
          plant_id: string
          root_depth?: number | null
          root_length: number
        }
        Update: {
          ai_analysis?: string | null
          branching_count?: number | null
          created_at?: string
          density_score?: number | null
          health_notes?: string | null
          id?: string
          image_url?: string | null
          measured_at?: string
          plant_id?: string
          root_depth?: number | null
          root_length?: number
        }
        Relationships: [
          {
            foreignKeyName: "measurements_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          created_at: string
          days_planted: number | null
          health_score: number | null
          id: string
          light_level: number | null
          max_root_length: number | null
          moisture: number | null
          name: string
          notes: string | null
          root_length: number | null
          soil_type: string | null
          species: string
          stage: string | null
          temperature: number | null
          updated_at: string
          water_level: number | null
        }
        Insert: {
          created_at?: string
          days_planted?: number | null
          health_score?: number | null
          id?: string
          light_level?: number | null
          max_root_length?: number | null
          moisture?: number | null
          name: string
          notes?: string | null
          root_length?: number | null
          soil_type?: string | null
          species: string
          stage?: string | null
          temperature?: number | null
          updated_at?: string
          water_level?: number | null
        }
        Update: {
          created_at?: string
          days_planted?: number | null
          health_score?: number | null
          id?: string
          light_level?: number | null
          max_root_length?: number | null
          moisture?: number | null
          name?: string
          notes?: string | null
          root_length?: number | null
          soil_type?: string | null
          species?: string
          stage?: string | null
          temperature?: number | null
          updated_at?: string
          water_level?: number | null
        }
        Relationships: []
      }
      predictions: {
        Row: {
          conditions: Json | null
          confidence: number | null
          created_at: string
          id: string
          plant_id: string
          predicted_date: string
          predicted_length: number
        }
        Insert: {
          conditions?: Json | null
          confidence?: number | null
          created_at?: string
          id?: string
          plant_id: string
          predicted_date: string
          predicted_length: number
        }
        Update: {
          conditions?: Json | null
          confidence?: number | null
          created_at?: string
          id?: string
          plant_id?: string
          predicted_date?: string
          predicted_length?: number
        }
        Relationships: [
          {
            foreignKeyName: "predictions_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
