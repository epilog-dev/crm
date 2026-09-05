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
      conversations: {
        Row: {
          avatar_url: string | null
          created_at: string
          customer_id: string | null
          id: string
          instagram_handle: string
          instagram_name: string | null
          instagram_thread_id: string | null
          last_message_at: string | null
          last_message_preview: string | null
          platform: string
          store_id: string
          unread_count: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          instagram_handle: string
          instagram_name?: string | null
          instagram_thread_id?: string | null
          last_message_at?: string | null
          last_message_preview?: string | null
          platform?: string
          store_id: string
          unread_count?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          instagram_handle?: string
          instagram_name?: string | null
          instagram_thread_id?: string | null
          last_message_at?: string | null
          last_message_preview?: string | null
          platform?: string
          store_id?: string
          unread_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          id: string
          instagram_handle: string
          name: string | null
          phone: string | null
          pincode: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          instagram_handle: string
          name?: string | null
          phone?: string | null
          pincode?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          id?: string
          instagram_handle?: string
          name?: string | null
          phone?: string | null
          pincode?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_votes: {
        Row: {
          created_at: string
          feature_key: string
          id: string
        }
        Insert: {
          created_at?: string
          feature_key: string
          id?: string
        }
        Update: {
          created_at?: string
          feature_key?: string
          id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          instagram_message_id: string | null
          order_id: string | null
          sender: string
          store_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          instagram_message_id?: string | null
          order_id?: string | null
          sender: string
          store_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          instagram_message_id?: string | null
          order_id?: string | null
          sender?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          badge_color: string
          conversation_id: string | null
          created_at: string
          icon: string
          id: string
          link: string | null
          message: string
          order_id: string | null
          read: boolean
          store_id: string
          title: string
          type: string
        }
        Insert: {
          badge_color?: string
          conversation_id?: string | null
          created_at?: string
          icon?: string
          id?: string
          link?: string | null
          message: string
          order_id?: string | null
          read?: boolean
          store_id: string
          title: string
          type: string
        }
        Update: {
          badge_color?: string
          conversation_id?: string | null
          created_at?: string
          icon?: string
          id?: string
          link?: string | null
          message?: string
          order_id?: string | null
          read?: boolean
          store_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          currency: string
          id: string
          item_name: string
          order_id: string
          product_id: string | null
          quantity: number
          store_id: string
          unit_price: number
          variant_id: string | null
          variant_label: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          id?: string
          item_name: string
          order_id: string
          product_id?: string | null
          quantity?: number
          store_id: string
          unit_price: number
          variant_id?: string | null
          variant_label?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          id?: string
          item_name?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          store_id?: string
          unit_price?: number
          variant_id?: string | null
          variant_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          confirmed_by_customer: boolean
          conversation_id: string | null
          created_at: string
          currency: string
          customer_address: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          customer_pincode: string | null
          id: string
          order_code: string
          payment_method: string | null
          payment_ref: string | null
          payment_status: string
          receipt_uploaded: boolean
          receipt_url: string | null
          status: string
          store_id: string
          updated_at: string
        }
        Insert: {
          confirmed_by_customer?: boolean
          conversation_id?: string | null
          created_at?: string
          currency?: string
          customer_address?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_pincode?: string | null
          id?: string
          order_code?: string
          payment_method?: string | null
          payment_ref?: string | null
          payment_status?: string
          receipt_uploaded?: boolean
          receipt_url?: string | null
          status?: string
          store_id: string
          updated_at?: string
        }
        Update: {
          confirmed_by_customer?: boolean
          conversation_id?: string | null
          created_at?: string
          currency?: string
          customer_address?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          customer_pincode?: string | null
          id?: string
          order_code?: string
          payment_method?: string | null
          payment_ref?: string | null
          payment_status?: string
          receipt_uploaded?: boolean
          receipt_url?: string | null
          status?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_validation_responses: {
        Row: {
          answer: string
          created_at: string
          id: string
          monthly_amount: number | null
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          monthly_amount?: number | null
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          monthly_amount?: number | null
        }
        Relationships: []
      }
      product_variants: {
        Row: {
          attributes: Json
          created_at: string
          id: string
          label: string
          price: number | null
          product_id: string
          sku: string | null
          stock: number
          store_id: string
          updated_at: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          id?: string
          label: string
          price?: number | null
          product_id: string
          sku?: string | null
          stock?: number
          store_id: string
          updated_at?: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          id?: string
          label?: string
          price?: number | null
          product_id?: string
          sku?: string | null
          stock?: number
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          attributes: Json
          base_price: number | null
          created_at: string
          currency: string
          description: string | null
          id: string
          image_url: string | null
          instagram_link: string | null
          instagram_post_id: string | null
          status: string
          store_id: string
          title: string
          updated_at: string
        }
        Insert: {
          attributes?: Json
          base_price?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instagram_link?: string | null
          instagram_post_id?: string | null
          status?: string
          store_id: string
          title: string
          updated_at?: string
        }
        Update: {
          attributes?: Json
          base_price?: number | null
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          image_url?: string | null
          instagram_link?: string | null
          instagram_post_id?: string | null
          status?: string
          store_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      store_members: {
        Row: {
          created_at: string
          id: string
          role: string
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          store_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_members_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          auto_link_dms: boolean
          cod_enabled: boolean
          created_at: string
          id: string
          instagram_avatar_url: string | null
          instagram_business_id: string | null
          instagram_connected: boolean
          instagram_connected_at: string | null
          instagram_followers_count: number | null
          instagram_handle: string | null
          instagram_username: string | null
          name: string
          require_receipt_upload: boolean
          updated_at: string
          upi_vpa: string | null
          webhook_status: string | null
        }
        Insert: {
          auto_link_dms?: boolean
          cod_enabled?: boolean
          created_at?: string
          id?: string
          instagram_avatar_url?: string | null
          instagram_business_id?: string | null
          instagram_connected?: boolean
          instagram_connected_at?: string | null
          instagram_followers_count?: number | null
          instagram_handle?: string | null
          instagram_username?: string | null
          name: string
          require_receipt_upload?: boolean
          updated_at?: string
          upi_vpa?: string | null
          webhook_status?: string | null
        }
        Update: {
          auto_link_dms?: boolean
          cod_enabled?: boolean
          created_at?: string
          id?: string
          instagram_avatar_url?: string | null
          instagram_business_id?: string | null
          instagram_connected?: boolean
          instagram_connected_at?: string | null
          instagram_followers_count?: number | null
          instagram_handle?: string | null
          instagram_username?: string | null
          name?: string
          require_receipt_upload?: boolean
          updated_at?: string
          upi_vpa?: string | null
          webhook_status?: string | null
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
        }
        Relationships: []
      }
      waitlist_signups: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_or_create_store: {
        Args: never
        Returns: {
          auto_link_dms: boolean
          cod_enabled: boolean
          created_at: string
          id: string
          instagram_avatar_url: string | null
          instagram_business_id: string | null
          instagram_connected: boolean
          instagram_connected_at: string | null
          instagram_followers_count: number | null
          instagram_handle: string | null
          instagram_username: string | null
          name: string
          require_receipt_upload: boolean
          updated_at: string
          upi_vpa: string | null
          webhook_status: string | null
        }
        SetofOptions: {
          from: "*"
          to: "stores"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_store_member: { Args: { _store_id: string }; Returns: boolean }
      is_store_owner: { Args: { _store_id: string }; Returns: boolean }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
