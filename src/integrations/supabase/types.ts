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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      generation_logs: {
        Row: {
          created_at: string
          generation_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          generation_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          generation_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      invite_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_hash: string | null
          message: string | null
          name: string
          request_type: string
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_hash?: string | null
          message?: string | null
          name: string
          request_type: string
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_hash?: string | null
          message?: string | null
          name?: string
          request_type?: string
          status?: string | null
        }
        Relationships: []
      }
      library_brands: {
        Row: {
          additional_notes: string | null
          colors: string[] | null
          created_at: string
          description: string | null
          fonts: string | null
          id: string
          logo_url: string | null
          name: string
          team_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          fonts?: string | null
          id?: string
          logo_url?: string | null
          name: string
          team_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          colors?: string[] | null
          created_at?: string
          description?: string | null
          fonts?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          team_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      library_characters: {
        Row: {
          created_at: string
          demeanor: string | null
          enhanced_demeanor: string | null
          enhanced_look: string | null
          enhanced_role: string | null
          id: string
          look: string | null
          name: string
          role: string | null
          source_template: string | null
          team_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          demeanor?: string | null
          enhanced_demeanor?: string | null
          enhanced_look?: string | null
          enhanced_role?: string | null
          id?: string
          look?: string | null
          name: string
          role?: string | null
          source_template?: string | null
          team_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          demeanor?: string | null
          enhanced_demeanor?: string | null
          enhanced_look?: string | null
          enhanced_role?: string | null
          id?: string
          look?: string | null
          name?: string
          role?: string | null
          source_template?: string | null
          team_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      library_environments: {
        Row: {
          audio: string | null
          created_at: string
          enhanced_audio: string | null
          enhanced_lighting: string | null
          enhanced_props: string | null
          enhanced_setting: string | null
          id: string
          lighting: string | null
          name: string
          props: string | null
          setting: string | null
          source_template: string | null
          team_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          audio?: string | null
          created_at?: string
          enhanced_audio?: string | null
          enhanced_lighting?: string | null
          enhanced_props?: string | null
          enhanced_setting?: string | null
          id?: string
          lighting?: string | null
          name: string
          props?: string | null
          setting?: string | null
          source_template?: string | null
          team_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          audio?: string | null
          created_at?: string
          enhanced_audio?: string | null
          enhanced_lighting?: string | null
          enhanced_props?: string | null
          enhanced_setting?: string | null
          id?: string
          lighting?: string | null
          name?: string
          props?: string | null
          setting?: string | null
          source_template?: string | null
          team_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      library_photos: {
        Row: {
          created_at: string
          id: string
          image_base64: string
          name: string
          team_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_base64: string
          name: string
          team_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_base64?: string
          name?: string
          team_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      library_scene_styles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_preset: boolean | null
          name: string
          style_type: string
          team_id: string | null
          template: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_preset?: boolean | null
          name: string
          style_type?: string
          team_id?: string | null
          template: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_preset?: boolean | null
          name?: string
          style_type?: string
          team_id?: string | null
          template?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          generation_reset_at: string | null
          id: string
          monthly_generations: number | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          generation_reset_at?: string | null
          id?: string
          monthly_generations?: number | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          generation_reset_at?: string | null
          id?: string
          monthly_generations?: number | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          invited_email: string | null
          joined_at: string | null
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_email?: string | null
          joined_at?: string | null
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_email?: string | null
          joined_at?: string | null
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      usage_tracking: {
        Row: {
          created_at: string
          generation_count: number | null
          id: string
          ip_hash: string
          last_generation_at: string | null
          updated_at: string
          user_agent_hash: string | null
        }
        Insert: {
          created_at?: string
          generation_count?: number | null
          id?: string
          ip_hash: string
          last_generation_at?: string | null
          updated_at?: string
          user_agent_hash?: string | null
        }
        Update: {
          created_at?: string
          generation_count?: number | null
          id?: string
          ip_hash?: string
          last_generation_at?: string | null
          updated_at?: string
          user_agent_hash?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_team_member: {
        Args: { _team_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
