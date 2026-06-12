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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          account_number: string | null
          created_at: string
          customer_code: string | null
          due_amount: number
          email: string | null
          expected_amount: number
          id: string
          name: string
          organization_id: string
          phone: string | null
          service: string | null
          status: Database["public"]["Enums"]["customer_status"]
          updated_at: string
          customer_status: string
          created_by: string | null
          discount_eligible: boolean
          discount_type: "percentage" | "fixed" | "scholarship" | null
          discount_value: number | null
          discount_ref: string | null
        }
        Insert: {
          account_number?: string | null
          created_at?: string
          customer_code?: string | null
          due_amount?: number
          email?: string | null
          expected_amount?: number
          id?: string
          name: string
          organization_id: string
          phone?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          updated_at?: string
          customer_status?: string
          created_by?: string | null
          discount_eligible?: boolean
          discount_type?: "percentage" | "fixed" | "scholarship" | null
          discount_value?: number | null
          discount_ref?: string | null
        }
        Update: {
          account_number?: string | null
          created_at?: string
          customer_code?: string | null
          due_amount?: number
          email?: string | null
          expected_amount?: number
          id?: string
          name?: string
          organization_id?: string
          phone?: string | null
          service?: string | null
          status?: Database["public"]["Enums"]["customer_status"]
          updated_at?: string
          customer_status?: string
          created_by?: string | null
          discount_eligible?: boolean
          discount_type?: "percentage" | "fixed" | "scholarship" | null
          discount_value?: number | null
          discount_ref?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          currency: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_providers: {
        Row: {
          id: string
          organization_id: string
          provider_type: string
          provider_name: string
          credentials_json: Record<string, any>
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          provider_type: string
          provider_name: string
          credentials_json?: Record<string, any>
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          provider_type?: string
          provider_name?: string
          credentials_json?: Record<string, any>
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_providers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_paid: number
          bank_name: string | null
          created_at: string
          currency: string
          customer_id: string | null
          id: string
          mobile_number: string | null
          notes: string | null
          organization_id: string
          paid_by_name: string | null
          paid_by_phone: string | null
          payment_date: string
          payment_method: string | null
          reference: string | null
          relationship: string | null
          source: Database["public"]["Enums"]["payment_source"]
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          amount_paid?: number
          bank_name?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          mobile_number?: string | null
          notes?: string | null
          organization_id: string
          paid_by_name?: string | null
          paid_by_phone?: string | null
          payment_date?: string
          payment_method?: string | null
          reference?: string | null
          relationship?: string | null
          source?: Database["public"]["Enums"]["payment_source"]
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          bank_name?: string | null
          created_at?: string
          currency?: string
          customer_id?: string | null
          id?: string
          mobile_number?: string | null
          notes?: string | null
          organization_id?: string
          paid_by_name?: string | null
          paid_by_phone?: string | null
          payment_date?: string
          payment_method?: string | null
          reference?: string | null
          relationship?: string | null
          source?: Database["public"]["Enums"]["payment_source"]
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      paystack_transactions: {
        Row: {
          id: string
          organization_id: string
          paystack_id: number
          reference: string
          amount: number
          currency: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          status: string
          channel: string | null
          paid_at: string | null
          metadata: Record<string, any> | null
          reconciled: boolean
          linked_payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          paystack_id: number
          reference: string
          amount?: number
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          status?: string
          channel?: string | null
          paid_at?: string | null
          metadata?: Record<string, any> | null
          reconciled?: boolean
          linked_payment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          paystack_id?: number
          reference?: string
          amount?: number
          currency?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          status?: string
          channel?: string | null
          paid_at?: string | null
          metadata?: Record<string, any> | null
          reconciled?: boolean
          linked_payment_id?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "paystack_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paystack_transactions_linked_payment_id_fkey"
            columns: ["linked_payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          id: string
          organization_id: string
          name: string
          fee: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          fee?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          fee?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "manager" | "finance_staff" | "viewer" | "member"
      customer_status: "paid" | "partial" | "unpaid" | "mismatch"
      payment_source: "paystack" | "bank" | "cash" | "manual" | "mtn_momo" | "telecel_cash" | "airteltigo"
      payment_status: "paid" | "partial" | "unpaid" | "duplicate" | "mismatch"
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
      app_role: ["super_admin", "admin", "manager", "finance_staff", "viewer", "member"],
      customer_status: ["paid", "partial", "unpaid", "mismatch"],
      payment_source: ["paystack", "bank", "cash", "manual", "mtn_momo", "telecel_cash", "airteltigo"],
      payment_status: ["paid", "partial", "unpaid", "duplicate", "mismatch"],
    },
  },
} as const
