import type { Customer, PaymentEvent, RecoveryAttempt } from './database'

// Dashboard metrics
export type DashboardMetrics = {
  recovered_amount: number
  recovered_count: number
  failed_amount: number
  failed_count: number
  recovery_rate: number
  active_failures: number
  trend: 'up' | 'down' | 'flat'
}

// Payment event with joined customer
export type PaymentEventWithCustomer = PaymentEvent & {
  customers: Pick<Customer, 'id' | 'name' | 'email' | 'risk_score'> | null
}

// Recovery attempt with joined relations
export type RecoveryAttemptWithRelations = RecoveryAttempt & {
  message_templates: { name: string; type: string } | null
}

// Payment event detail (with attempts)
export type PaymentEventDetail = PaymentEventWithCustomer & {
  recovery_attempts: RecoveryAttemptWithRelations[]
}

// Customer with payment history
export type CustomerWithHistory = Customer & {
  payment_events: Pick<PaymentEvent, 'id' | 'amount' | 'currency' | 'status' | 'created_at'>[]
}

// İyzico webhook payload
export type IyzicoWebhookPayload = {
  orgId: string
  eventId: string
  iyziReferenceCode: string
  customerId: string | null
  amount: number
  currency: string
  failureCode: string | null
  failureMessage: string | null
  type: string
}

// n8n trigger payload
export type N8nTriggerPayload = {
  org_id: string
  event_id: string
  customer_id: string | null
  amount: number
  currency: string
  failure_code: string | null
  event_type: string
}

// API response wrapper
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string }

// Pagination
export type PaginatedResponse<T> = {
  data: T[]
  count: number
  page: number
  per_page: number
}
