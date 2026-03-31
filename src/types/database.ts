export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          slug: string
          iyzico_api_key_encrypted: string | null
          iyzico_secret_key_encrypted: string | null
          iyzico_merchant_id: string | null
          iyzico_base_url: string
          iyzico_connected: boolean
          plan: 'starter' | 'growth' | 'pro'
          plan_status: 'trialing' | 'active' | 'past_due' | 'canceled'
          recoverly_customer_id: string | null
          recoverly_subscription_id: string | null
          n8n_webhook_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          iyzico_api_key_encrypted?: string | null
          iyzico_secret_key_encrypted?: string | null
          iyzico_merchant_id?: string | null
          iyzico_base_url?: string
          iyzico_connected?: boolean
          plan?: 'starter' | 'growth' | 'pro'
          plan_status?: 'trialing' | 'active' | 'past_due' | 'canceled'
          recoverly_customer_id?: string | null
          recoverly_subscription_id?: string | null
          n8n_webhook_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['organizations']['Insert']>
        Relationships: []
      }
      users: {
        Row: {
          id: string
          org_id: string
          email: string
          full_name: string | null
          role: 'owner' | 'admin' | 'member'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          org_id: string
          email: string
          full_name?: string | null
          role?: 'owner' | 'admin' | 'member'
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'users_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      customers: {
        Row: {
          id: string
          org_id: string
          provider_customer_id: string | null
          iyzico_card_user_key: string | null
          iyzico_card_token: string | null
          email: string | null
          name: string | null
          risk_score: number
          total_failed_payments: number
          total_recovered_amount: number
          last_payment_failed_at: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          provider_customer_id?: string | null
          iyzico_card_user_key?: string | null
          iyzico_card_token?: string | null
          email?: string | null
          name?: string | null
          risk_score?: number
          total_failed_payments?: number
          total_recovered_amount?: number
          last_payment_failed_at?: string | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'customers_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      payment_events: {
        Row: {
          id: string
          org_id: string
          customer_id: string | null
          provider_event_id: string | null
          provider_payment_id: string | null
          provider_reference_code: string | null
          event_type: string
          amount: number
          currency: string
          failure_code: string | null
          failure_message: string | null
          status: 'new' | 'processing' | 'recovered' | 'failed' | 'ignored'
          raw_data: Json
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          customer_id?: string | null
          provider_event_id?: string | null
          provider_payment_id?: string | null
          provider_reference_code?: string | null
          event_type: string
          amount?: number
          currency?: string
          failure_code?: string | null
          failure_message?: string | null
          status?: 'new' | 'processing' | 'recovered' | 'failed' | 'ignored'
          raw_data?: Json
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['payment_events']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'payment_events_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'payment_events_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'customers'
            referencedColumns: ['id']
          }
        ]
      }
      recovery_sequences: {
        Row: {
          id: string
          org_id: string
          name: string
          is_default: boolean
          is_active: boolean
          steps: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          is_default?: boolean
          is_active?: boolean
          steps?: Json
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['recovery_sequences']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'recovery_sequences_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      message_templates: {
        Row: {
          id: string
          org_id: string
          name: string
          type: 'email' | 'sms'
          subject: string | null
          body: string
          variables: Json
          ai_enhanced: boolean
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          name: string
          type: 'email' | 'sms'
          subject?: string | null
          body: string
          variables?: Json
          ai_enhanced?: boolean
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['message_templates']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'message_templates_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      recovery_attempts: {
        Row: {
          id: string
          org_id: string
          payment_event_id: string
          customer_id: string | null
          sequence_id: string | null
          template_id: string | null
          step_number: number
          type: 'auto_retry' | 'email' | 'sms'
          status: 'pending' | 'scheduled' | 'in_progress' | 'sent' | 'succeeded' | 'failed' | 'skipped'
          scheduled_at: string
          executed_at: string | null
          result: Json
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          payment_event_id: string
          customer_id?: string | null
          sequence_id?: string | null
          template_id?: string | null
          step_number?: number
          type: 'auto_retry' | 'email' | 'sms'
          status?: 'pending' | 'scheduled' | 'in_progress' | 'sent' | 'succeeded' | 'failed' | 'skipped'
          scheduled_at: string
          executed_at?: string | null
          result?: Json
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['recovery_attempts']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'recovery_attempts_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'recovery_attempts_payment_event_id_fkey'
            columns: ['payment_event_id']
            isOneToOne: false
            referencedRelation: 'payment_events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'recovery_attempts_template_id_fkey'
            columns: ['template_id']
            isOneToOne: false
            referencedRelation: 'message_templates'
            referencedColumns: ['id']
          }
        ]
      }
      daily_analytics: {
        Row: {
          id: string
          org_id: string
          date: string
          total_failed_amount: number
          total_recovered_amount: number
          total_failed_count: number
          total_recovered_count: number
          recovery_rate: number
          retry_success_count: number
          email_success_count: number
          sms_success_count: number
          created_at: string
        }
        Insert: {
          id?: string
          org_id: string
          date: string
          total_failed_amount?: number
          total_recovered_amount?: number
          total_failed_count?: number
          total_recovered_count?: number
          recovery_rate?: number
          retry_success_count?: number
          email_success_count?: number
          sms_success_count?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['daily_analytics']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'daily_analytics_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
      notification_settings: {
        Row: {
          id: string
          org_id: string
          email_on_failure: boolean
          email_on_recovery: boolean
          daily_summary: boolean
          weekly_report: boolean
          slack_webhook_url: string | null
          notification_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          org_id: string
          email_on_failure?: boolean
          email_on_recovery?: boolean
          daily_summary?: boolean
          weekly_report?: boolean
          slack_webhook_url?: string | null
          notification_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['notification_settings']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'notification_settings_org_id_fkey'
            columns: ['org_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
    Functions: {
      get_user_org_id: {
        Args: Record<string, never>
        Returns: string
      }
      increment_customer_failures: {
        Args: { p_customer_id: string }
        Returns: undefined
      }
    }
  }
}

// Convenience row types
export type Organization = Database['public']['Tables']['organizations']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Customer = Database['public']['Tables']['customers']['Row']
export type PaymentEvent = Database['public']['Tables']['payment_events']['Row']
export type RecoverySequence = Database['public']['Tables']['recovery_sequences']['Row']
export type MessageTemplate = Database['public']['Tables']['message_templates']['Row']
export type RecoveryAttempt = Database['public']['Tables']['recovery_attempts']['Row']
export type DailyAnalytics = Database['public']['Tables']['daily_analytics']['Row']
export type NotificationSettings = Database['public']['Tables']['notification_settings']['Row']

// Sequence step type
export type SequenceStep = {
  step: number
  type: 'retry' | 'email' | 'sms'
  delay_hours: number
  template_id?: string
}
